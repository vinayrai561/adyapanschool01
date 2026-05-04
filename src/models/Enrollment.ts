import mongoose, { Schema, model, models } from 'mongoose';

export interface EnrollmentDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;       // matches Course.slug
  courseName: string;
  planLabel: string;
  amountPaid: number;
  paymentId: string;
  enrolledAt: Date;
  expiresAt?: Date;
}

const enrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId:     { type: String, required: true, index: true },
    courseSlug: { type: String, required: true },
    courseName: { type: String, required: true },
    planLabel:  { type: String, default: '' },
    amountPaid: { type: Number, default: 0 },
    paymentId:  { type: String, required: true, unique: true },
    enrolledAt: { type: Date, default: Date.now },
    expiresAt:  { type: Date },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseSlug: 1 });

const Enrollment = models.Enrollment || model<EnrollmentDocument>('Enrollment', enrollmentSchema);
export default Enrollment;
