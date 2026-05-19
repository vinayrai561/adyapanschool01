import mongoose, { Schema, model, models } from 'mongoose';

export type AdminActionType =
  | 'login'
  | 'logout'
  | 'view_student'
  | 'view_payment'
  | 'view_course'
  | 'export_students'
  | 'export_payments'
  | 'update_user'
  | 'update_course'
  | 'update_plan'
  | 'refund_initiated'
  | 'certificate_issued'
  | 'enrollment_created'
  | 'enrollment_cancelled'
  | 'email_sent'
  | 'system_event';

export interface AdminActivityLogDocument {
  _id: mongoose.Types.ObjectId;
  adminId: string;
  adminEmail: string;
  actionType: AdminActionType;
  description: string;
  targetUserId?: string;
  targetUserEmail?: string;
  targetCourseId?: string;
  targetPaymentId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const adminActivityLogSchema = new Schema<AdminActivityLogDocument>(
  {
    adminId:          { type: String, required: true, index: true },
    adminEmail:       { type: String, required: true, lowercase: true, trim: true },
    actionType:       {
      type: String,
      enum: [
        'login', 'logout', 'view_student', 'view_payment', 'view_course',
        'export_students', 'export_payments', 'update_user', 'update_course',
        'update_plan', 'refund_initiated', 'certificate_issued', 'enrollment_created',
        'enrollment_cancelled', 'email_sent', 'system_event',
      ],
      required: true,
    },
    description:      { type: String, required: true, trim: true },
    targetUserId:     { type: String, default: '' },
    targetUserEmail:  { type: String, default: '', lowercase: true, trim: true },
    targetCourseId:   { type: String, default: '' },
    targetPaymentId:  { type: String, default: '' },
    metadata:         { type: Schema.Types.Mixed, default: {} },
    ipAddress:        { type: String, default: '' },
    userAgent:        { type: String, default: '' },
  },
  {
    timestamps: true,
    // Only keep createdAt, no updatedAt needed for logs
    toJSON: { virtuals: false },
  }
);

adminActivityLogSchema.index({ adminId: 1, createdAt: -1 });
adminActivityLogSchema.index({ actionType: 1 });
adminActivityLogSchema.index({ targetUserId: 1 });
adminActivityLogSchema.index({ createdAt: -1 });

const AdminActivityLog = models.AdminActivityLog || model<AdminActivityLogDocument>('AdminActivityLog', adminActivityLogSchema);
export default AdminActivityLog;
