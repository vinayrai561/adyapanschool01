/**
 * JobApplication Model
 * Stores student applications for job postings.
 * Collection: jobapplications
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';

export interface JobApplicationDocument {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  companyId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  cvUrl: string;
  portfolioUrl: string;
  message: string;
  status: ApplicationStatus;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<JobApplicationDocument>(
  {
    jobId:         { type: Schema.Types.ObjectId, ref: 'JobPost', required: true, index: true },
    companyId:     { type: String, required: true, index: true },
    studentId:     { type: String, required: true, index: true },
    studentName:   { type: String, required: true, trim: true },
    studentEmail:  { type: String, required: true, lowercase: true, trim: true },
    studentPhone:  { type: String, default: '' },
    cvUrl:         { type: String, default: '' },
    portfolioUrl:  { type: String, default: '' },
    message:       { type: String, default: '' },
    status:        { type: String, enum: ['applied','shortlisted','rejected','hired'], default: 'applied', index: true },
    appliedAt:     { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'jobapplications' }
);

// Prevent duplicate applications
schema.index({ jobId: 1, studentId: 1 }, { unique: true });
schema.index({ studentId: 1, createdAt: -1 });
schema.index({ companyId: 1, status: 1 });
schema.index({ jobId: 1, status: 1 });

const JobApplication = models.JobApplication || model<JobApplicationDocument>('JobApplication', schema);
export default JobApplication;
