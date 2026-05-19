import mongoose, { Schema, model, models } from 'mongoose';

export type EmailType =
  | 'payment_success'
  | 'payment_failed'
  | 'certificate_ready'
  | 'welcome'
  | 'course_completion'
  | 'password_reset'
  | 'enrollment_confirmation';

export interface EmailLogDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  email: string;
  emailType: EmailType;
  subject: string;
  status: 'sent' | 'failed';
  provider: string;           // 'sendgrid' | 'nodemailer' | 'none'
  providerResponse?: string;
  errorMessage?: string;
  // Related entity refs
  paymentId?: string;
  orderId?: string;
  courseSlug?: string;
  courseName?: string;
  certificateId?: string;
  amount?: number;
  // Metadata
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const emailLogSchema = new Schema<EmailLogDocument>(
  {
    userId:           { type: String, default: '', index: true },
    email:            { type: String, required: true, lowercase: true, trim: true, index: true },
    emailType:        {
      type: String,
      enum: ['payment_success', 'payment_failed', 'certificate_ready', 'welcome', 'course_completion', 'password_reset', 'enrollment_confirmation'],
      required: true,
    },
    subject:          { type: String, default: '' },
    status:           { type: String, enum: ['sent', 'failed'], required: true },
    provider:         { type: String, default: 'sendgrid' },
    providerResponse: { type: String, default: '' },
    errorMessage:     { type: String, default: '' },
    // Related refs
    paymentId:        { type: String, default: '', index: true },
    orderId:          { type: String, default: '' },
    courseSlug:       { type: String, default: '' },
    courseName:       { type: String, default: '' },
    certificateId:    { type: String, default: '' },
    amount:           { type: Number, default: 0 },
    retryCount:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound indexes for deduplication checks
emailLogSchema.index({ paymentId: 1, emailType: 1, status: 1 });
emailLogSchema.index({ userId: 1, emailType: 1 });
emailLogSchema.index({ email: 1, emailType: 1 });
emailLogSchema.index({ createdAt: -1 });

const EmailLog = models.EmailLog || model<EmailLogDocument>('EmailLog', emailLogSchema);
export default EmailLog;
