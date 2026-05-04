import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import AuthUser from '@/models/AuthUser';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.cookies.get('authToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await AuthUser.findById(decoded.userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      purchasedCourses: user.purchasedCourses || [],
      wishlist: user.wishlist || [],
    });
  } catch (err) {
    console.error('purchased-courses error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
