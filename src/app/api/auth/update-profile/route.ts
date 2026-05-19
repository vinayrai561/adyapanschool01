import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import { cleanText, normalizePhone, sanitizeMongoInput } from '@/lib/security';
import AuthUser from '@/models/AuthUser';

export async function PATCH(req: NextRequest) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await req.json());
    const { name, phone, avatar } = body;

    const updateFields: Record<string, string> = {};
    if (name?.trim())   updateFields.name   = cleanText(name, 100);
    if (phone?.trim())  updateFields.phone  = normalizePhone(phone);
    if (avatar?.trim()) updateFields.avatar = cleanText(avatar, 500);

    const updated = await AuthUser.findByIdAndUpdate(
      auth.userId,
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
