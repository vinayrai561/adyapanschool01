import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import AuthUser from '@/models/AuthUser';

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { name, phone, avatar } = body;

    const updateFields: Record<string, string> = {};
    if (name?.trim())   updateFields.name   = name.trim();
    if (phone?.trim())  updateFields.phone  = phone.trim();
    if (avatar?.trim()) updateFields.avatar = avatar.trim();

    const updated = await AuthUser.findByIdAndUpdate(
      decoded.userId,
      { $set: updateFields },
      { new: true, lean: true }
    );

    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        role: updated.role,
      },
    });
  } catch (err) {
    console.error('update-profile error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
