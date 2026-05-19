import mongoose, { Schema, model, models } from 'mongoose';

export interface EnrollmentDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  courseName: string;
  planId: string;           // 'plan-1', 'plan-2', etc.
  planLabel: string;        // 'Starter Plan', 'Career Pro Plan'
  amountPaid: number;
  paymentId: string;        // Razorpay payment ID
  enrollmentStatus: 'active' | 'expired' | 'cancelled' | 'completed';
  enrolledAt: Date;
  expiresAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId:           { type: String, required: true, index: true },
    courseSlug:       { type: String, required: true, index: true },
    courseName:       { type: String, required: true },
    planId:           { type: String, default: '' },
    planLabel:        { type: String, default: '' },
    amountPaid:       { type: Number, default: 0 },
    paymentId:        { type: String, required: true, unique: true, index: true },
    enrollmentStatus: { type: String, enum: ['active', 'expired', 'cancelled', 'completed'], default: 'active', index: true },
    enrolledAt:       { type: Date, default: Date.now },
    expiresAt:        { type: Date },
    completedAt:      { type: Date },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseSlug: 1 });
enrollmentSchema.index({ userId: 1, enrollmentStatus: 1 });
enrollmentSchema.index({ courseSlug: 1, enrollmentStatus: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

const Enrollment = models.Enrollment || model<EnrollmentDocument>('Enrollment', enrollmentSchema);
export default Enrollment;
