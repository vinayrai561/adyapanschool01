import mongoose, { Schema, model, models } from 'mongoose';

export type CertificateType = 'course_completion' | 'internship_completion' | 'project_completion' | 'best_performance';

export interface CertificateDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  certificateType: CertificateType;
  certificateId: string;       // e.g. ADYP-2024-XXXXXX
  studentName: string;
  courseName: string;
  issuedAt: Date;
  certificateUrl: string;
  status: 'ready' | 'pending';
  emailSent: boolean;
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<CertificateDocument>(
  {
    userId:          { type: String, required: true, index: true },
    courseSlug:      { type: String, required: true, index: true },
    certificateType: {
      type: String,
      enum: ['course_completion', 'internship_completion', 'project_completion', 'best_performance'],
      default: 'course_completion',
    },
    certificateId:   { type: String, required: true, unique: true, index: true },
    studentName:     { type: String, required: true, trim: true },
    courseName:      { type: String, required: true, trim: true },
    issuedAt:        { type: Date, default: Date.now },
    certificateUrl:  { type: String, default: '' },
    status:          { type: String, enum: ['ready', 'pending'], default: 'pending', index: true },
    emailSent:       { type: Boolean, default: false },
    emailSentAt:     { type: Date },
  },
  { timestamps: true }
);

certificateSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });
certificateSchema.index({ userId: 1, status: 1 });
certificateSchema.index({ status: 1, emailSent: 1 });
certificateSchema.index({ issuedAt: -1 });

const Certificate = models.Certificate || model<CertificateDocument>('Certificate', certificateSchema);
export default Certificate;
