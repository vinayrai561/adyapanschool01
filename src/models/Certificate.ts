import mongoose, { Schema, model, models } from 'mongoose';

export interface CertificateDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  certificateId: string;       // e.g. ADYP-2024-XXXXXX
  studentName: string;
  courseName: string;
  issuedAt: Date;
  certificateUrl: string;      // path or URL to PDF
  status: 'ready' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<CertificateDocument>(
  {
    userId:         { type: String, required: true, index: true },
    courseSlug:     { type: String, required: true },
    certificateId:  { type: String, required: true, unique: true },
    studentName:    { type: String, required: true, trim: true },
    courseName:     { type: String, required: true, trim: true },
    issuedAt:       { type: Date, default: Date.now },
    certificateUrl: { type: String, default: '' },
    status:         { type: String, enum: ['ready', 'pending'], default: 'pending' },
  },
  { timestamps: true }
);

certificateSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

const Certificate = models.Certificate || model<CertificateDocument>('Certificate', certificateSchema);
export default Certificate;
