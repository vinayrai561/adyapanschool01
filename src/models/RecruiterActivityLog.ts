/**
 * RecruiterActivityLog — tracks all recruiter actions
 * Collection: recruiteractivitylogs
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type RecruiterActivityType = 
  | 'profile_view'
  | 'cv_download'
  | 'shortlist_add'
  | 'shortlist_remove'
  | 'job_post'
  | 'search'
  | 'filter_apply';

export interface RecruiterActivityLogDocument {
  _id: mongoose.Types.ObjectId;
  recruiterId: string;
  recruiterEmail: string;
  activityType: RecruiterActivityType;
  targetStudentId?: string;
  targetStudentName?: string;
  targetJobId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const schema = new Schema<RecruiterActivityLogDocument>(
  {
    recruiterId:       { type: String, required: true, index: true },
    recruiterEmail:    { type: String, required: true, lowercase: true, trim: true },
    activityType:      { 
      type: String, 
      required: true,
      enum: ['profile_view', 'cv_download', 'shortlist_add', 'shortlist_remove', 'job_post', 'search', 'filter_apply'],
      index: true 
    },
    targetStudentId:   { type: String, default: '', index: true },
    targetStudentName: { type: String, default: '' },
    targetJobId:       { type: String, default: '' },
    metadata:          { type: Schema.Types.Mixed, default: {} },
    ipAddress:         { type: String, default: '' },
    userAgent:         { type: String, default: '' },
  },
  { timestamps: true, collection: 'recruiteractivitylogs' }
);

schema.index({ recruiterId: 1, createdAt: -1 });
schema.index({ activityType: 1, createdAt: -1 });
schema.index({ recruiterId: 1, activityType: 1 });

const RecruiterActivityLog = models.RecruiterActivityLog
  || model<RecruiterActivityLogDocument>('RecruiterActivityLog', schema);
export default RecruiterActivityLog;
