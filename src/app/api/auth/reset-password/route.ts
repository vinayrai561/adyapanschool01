import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {
  getClientIp,
  isRateLimited,
  rateLimitResponse,
  requireJwtSecret,
  sanitizeMongoInput,
} from '@/lib/security';

const prisma = new PrismaClient();

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`reset-password:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse('Too many password reset attempts. Please try again later.');
  }

  try {
    const body = sanitizeMongoInput(await request.json());
    const validatedData = ResetPasswordSchema.parse(body);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        validatedData.token,
        requireJwtSecret()
      ) as { userId: string; email: string; type: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Verify token type
    if (decoded.type !== 'password-reset') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
