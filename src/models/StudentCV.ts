/**
 * StudentCV — stores student CV/resume information
 * Collection: studentcvs
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface StudentCVDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  isActive: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<StudentCVDocument>(
  {
    userId:        { type: String, required: true, index: true },
    fileName:      { type: String, required: true, trim: true },
    fileUrl:       { type: String, required: true },
    fileSize:      { type: Number, default: 0 },
    mimeType:      { type: String, default: 'application/pdf' },
    uploadedAt:    { type: Date, default: Date.now },
    isActive:      { type: Boolean, default: true, index: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'studentcvs' }
);

schema.index({ userId: 1, isActive: 1 });
schema.index({ uploadedAt: -1 });

const StudentCV = models.StudentCV
  || model<StudentCVDocument>('StudentCV', schema);
export default StudentCV;
