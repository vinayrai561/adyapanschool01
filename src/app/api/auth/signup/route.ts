import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import AuthUser from "@/models/AuthUser";

/* ── Validation schemas ──────────────────────────────────────── */
const StudentSignupSchema = z
  .object({
    firstName:       z.string().min(2, "First name must be at least 2 characters"),
    lastName:        z.string().min(2, "Last name must be at least 2 characters"),
    email:           z.string().email("Invalid email address"),
    password:        z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone:           z.string().optional(),
    selectedProgram: z.string().min(1).optional(),
    selectedAmount:  z.number().positive().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const OrganizationSignupSchema = z
  .object({
    fullName:        z.string().min(2, "Full name must be at least 2 characters"),
    companyName:     z.string().min(2, "Company name must be at least 2 characters"),
    email:           z.string().email("Invalid email address"),
    password:        z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone:           z.string().optional(),
    selectedProgram: z.string().min(1).optional(),
    selectedAmount:  z.number().positive().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { role, ...data } = body;

    /* ── Validate ── */
    let validatedData: any;
    if (role === "student") {
      validatedData = StudentSignupSchema.parse(data);
    } else if (role === "organization") {
      validatedData = OrganizationSignupSchema.parse(data);
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    /* ── Duplicate check ── */
    const existing = await AuthUser.findOne({ email: validatedData.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    /* ── Hash password ── */
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    /* ── Collect metadata ── */
    const ip        = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
                   || request.headers.get("x-real-ip")
                   || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const now       = new Date();

    /* ── Create user ── */
    let createdUser;
    if (role === "student") {
      createdUser = await AuthUser.create({
        email:           validatedData.email.toLowerCase().trim(),
        name:            `${validatedData.firstName.trim()} ${validatedData.lastName.trim()}`,
        passwordHash,
        role:            "STUDENT",
        phone:           validatedData.phone?.trim() || "",
        selectedProgram: validatedData.selectedProgram || null,
        selectedAmount:  validatedData.selectedAmount  || null,
        purchasedCourses: [],
        wishlist:         [],
        loginCount:       0,
        lastLoginAt:      null,
        signupIp:         ip,
        userAgent,
        signupAt:         now,
      });
    } else {
      createdUser = await AuthUser.create({
        email:           validatedData.email.toLowerCase().trim(),
        name:            validatedData.fullName.trim(),
        passwordHash,
        role:            "COMPANY",
        phone:           validatedData.phone?.trim() || "",
        companyName:     validatedData.companyName.trim(),
        selectedProgram: validatedData.selectedProgram || null,
        selectedAmount:  validatedData.selectedAmount  || null,
        purchasedCourses: [],
        wishlist:         [],
        loginCount:       0,
        lastLoginAt:      null,
        signupIp:         ip,
        userAgent,
        signupAt:         now,
      });
    }

    console.log(`[Signup] ✅ New ${createdUser.role}: ${createdUser.name} <${createdUser.email}> | IP: ${ip}`);

    /* ── JWT ── */
    const token = jwt.sign(
      { userId: createdUser._id.toString(), email: createdUser.email, role: createdUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id:              createdUser._id.toString(),
          email:           createdUser.email,
          name:            createdUser.name,
          role:            createdUser.role,
          phone:           createdUser.phone || null,
          companyName:     createdUser.companyName || null,
          selectedProgram: createdUser.selectedProgram || null,
          selectedAmount:  createdUser.selectedAmount  || null,
        },
        token,
      },
      { status: 201 }
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
    console.error("[Signup] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
