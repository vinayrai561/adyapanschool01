import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  cleanText,
  getClientIp,
  isRateLimited,
  isSpamSubmission,
  normalizeEmail,
  rateLimitResponse,
  sanitizeMongoInput,
  verifyTurnstileToken,
} from '@/lib/security';

const ContactSchema = z.object({
  name:    z.string().min(2).max(100).transform((v) => cleanText(v, 100)),
  email:   z.string().email().transform(normalizeEmail),
  subject: z.string().min(1).max(150).transform((v) => cleanText(v, 150)),
  message: z.string().min(10).max(2000).transform((v) => cleanText(v, 2000)),
  cfTurnstileToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`contact:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse('Too many contact submissions. Please try again later.');
  }

  try {
    const body = sanitizeMongoInput(await req.json());
    if (isSpamSubmission(body as Record<string, unknown>)) {
      return NextResponse.json({ success: true });
    }

    const data = ContactSchema.parse(body);
    const turnstileOk = await verifyTurnstileToken(data.cfTurnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    // Log metadata only; do not print full user messages in server logs.
    console.log(`[Contact] New message from ${data.name} <${data.email}> | Subject: ${data.subject}`);

    // TODO: Send email via SendGrid/nodemailer to support@adyapan.com

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
