/**
 * RecruiterShortlist — tracks which students a recruiter has shortlisted.
 * Collection: recruitershortlists
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface RecruiterShortlistDocument {
  _id: mongoose.Types.ObjectId;
  recruiterId: string;       // OrganizationUser._id
  recruiterEmail: string;
  studentId: string;         // AuthUser._id
  studentName: string;
  studentEmail: string;
  courseSlug?: string;
  courseName?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<RecruiterShortlistDocument>(
  {
    recruiterId:    { type: String, required: true, index: true },
    recruiterEmail: { type: String, required: true, lowercase: true, trim: true },
    studentId:      { type: String, required: true, index: true },
    studentName:    { type: String, default: '' },
    studentEmail:   { type: String, default: '', lowercase: true, trim: true },
    courseSlug:     { type: String, default: '' },
    courseName:     { type: String, default: '' },
    note:           { type: String, default: '' },
  },
  { timestamps: true, collection: 'recruitershortlists' }
);

schema.index({ recruiterId: 1, studentId: 1 }, { unique: true });
schema.index({ recruiterId: 1, createdAt: -1 });

const RecruiterShortlist = models.RecruiterShortlist
  || model<RecruiterShortlistDocument>('RecruiterShortlist', schema);
export default RecruiterShortlist;
