import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import AuthUser from "@/models/AuthUser";

const LoginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/* ── Simple in-memory rate limiter (per IP) ── */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not limited
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS; // true = blocked
}

function clearRateLimit(ip: string) {
  attempts.delete(ip);
}

export async function POST(request: NextRequest) {
  /* ── Rate limiting ── */
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          || request.headers.get("x-real-ip")
          || "unknown";

  if (checkRateLimit(ip)) {
    console.warn(`[Login] ⚠️ Rate limited: ${ip}`);
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();

    const body          = await request.json();
    const validatedData = LoginSchema.parse(body);

    /* ── Find user ── */
    const user = await AuthUser.findOne({ email: validatedData.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    /* ── Verify password ── */
    const isValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    /* ── Clear rate limit on success ── */
    clearRateLimit(ip);

    /* ── Collect metadata ── */
    const userAgent = request.headers.get("user-agent") || "unknown";
    const now       = new Date();

    /* ── Update login stats ── */
    user.lastLoginAt        = now;
    user.loginCount         = (user.loginCount || 0) + 1;
    (user as any).lastLoginIp   = ip;
    (user as any).lastUserAgent = userAgent;
    await user.save();

    console.log(`[Login] ✅ ${user.role}: ${user.name} <${user.email}> | loginCount: ${user.loginCount} | IP: ${ip}`);

    /* ── JWT ── */
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id:              user._id.toString(),
          email:           user.email,
          name:            user.name,
          role:            user.role,
          phone:           user.phone           || null,
          avatar:          user.avatar          || null,
          companyName:     user.companyName     || null,
          selectedProgram: user.selectedProgram || null,
          selectedAmount:  user.selectedAmount  || null,
          loginCount:      user.loginCount,
          lastLoginAt:     user.lastLoginAt,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("[Login] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
