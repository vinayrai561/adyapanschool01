/**
 * CVDownloadLog — tracks CV downloads by recruiters
 * Collection: cvdownloadlogs
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface CVDownloadLogDocument {
  _id: mongoose.Types.ObjectId;
  recruiterId: string;
  recruiterEmail: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseSlug?: string;
  courseName?: string;
  downloadedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const schema = new Schema<CVDownloadLogDocument>(
  {
    recruiterId:    { type: String, required: true, index: true },
    recruiterEmail: { type: String, required: true, lowercase: true, trim: true },
    studentId:      { type: String, required: true, index: true },
    studentName:    { type: String, default: '' },
    studentEmail:   { type: String, default: '', lowercase: true, trim: true },
    courseSlug:     { type: String, default: '' },
    courseName:     { type: String, default: '' },
    downloadedAt:   { type: Date, default: Date.now },
    ipAddress:      { type: String, default: '' },
    userAgent:      { type: String, default: '' },
  },
  { timestamps: true, collection: 'cvdownloadlogs' }
);

schema.index({ recruiterId: 1, downloadedAt: -1 });
schema.index({ studentId: 1, downloadedAt: -1 });
schema.index({ recruiterId: 1, studentId: 1 });

const CVDownloadLog = models.CVDownloadLog
  || model<CVDownloadLogDocument>('CVDownloadLog', schema);
export default CVDownloadLog;
