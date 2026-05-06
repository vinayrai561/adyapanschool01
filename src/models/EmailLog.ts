import mongoose, { Schema, model, models } from 'mongoose';

export interface EmailLogDocument {
  userId?: string;
  email: string;
  type: 'payment_success' | 'payment_failed';
  status: 'sent' | 'failed';
  paymentId?: string;
  orderId?: string;
  courseName?: string;
  amount?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailLogSchema = new Schema<EmailLogDocument>(
  {
    userId:       { type: String, default: '' },
    email:        { type: String, required: true, lowercase: true, trim: true },
    type:         { type: String, enum: ['payment_success', 'payment_failed'], required: true },
    status:       { type: String, enum: ['sent', 'failed'], required: true },
    paymentId:    { type: String, default: '' },
    orderId:      { type: String, default: '' },
    courseName:   { type: String, default: '' },
    amount:       { type: Number, default: 0 },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for fast lookups
emailLogSchema.index({ paymentId: 1 });
emailLogSchema.index({ email: 1, type: 1 });
emailLogSchema.index({ createdAt: -1 });

const EmailLog = models.EmailLog || model<EmailLogDocument>('EmailLog', emailLogSchema);
export default EmailLog;
