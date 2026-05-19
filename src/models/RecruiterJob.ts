/**
 * RecruiterJob — job/project postings by recruiters.
 * Collection: recruiterjobs
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface RecruiterJobDocument {
  _id: mongoose.Types.ObjectId;
  recruiterId: string;
  recruiterEmail: string;
  recruiterName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget?: number;
  deadline?: Date;
  jobType: 'internship' | 'part-time' | 'full-time' | 'project';
  status: 'open' | 'closed' | 'draft';
  applicants: string[];   // studentIds
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<RecruiterJobDocument>(
  {
    recruiterId:    { type: String, required: true, index: true },
    recruiterEmail: { type: String, required: true, lowercase: true, trim: true },
    recruiterName:  { type: String, default: '' },
    title:          { type: String, required: true, trim: true },
    description:    { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    budget:         { type: Number },
    deadline:       { type: Date },
    jobType:        { type: String, enum: ['internship', 'part-time', 'full-time', 'project'], default: 'internship' },
    status:         { type: String, enum: ['open', 'closed', 'draft'], default: 'open', index: true },
    applicants:     { type: [String], default: [] },
  },
  { timestamps: true, collection: 'recruiterjobs' }
);

schema.index({ recruiterId: 1, createdAt: -1 });
schema.index({ status: 1 });

const RecruiterJob = models.RecruiterJob
  || model<RecruiterJobDocument>('RecruiterJob', schema);
export default RecruiterJob;
