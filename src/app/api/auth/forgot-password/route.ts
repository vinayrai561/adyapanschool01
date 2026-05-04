import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ForgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'password-reset',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // In a real application, you would:
    // 1. Store the reset token in database with expiration
    // 2. Send an email with reset link containing the token
    // 3. For now, we'll return the token (in production, never do this)

    // TODO: Send email with reset link
    // const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendEmail(user.email, 'Password Reset', resetLink);

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
        // In development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { resetToken }),
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

    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
