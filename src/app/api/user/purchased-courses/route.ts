import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';

export async function GET(req: NextRequest) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const user = await AuthUser.findById(auth.userId).lean();
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
