import mongoose, { Schema, model, models } from 'mongoose';

export interface ProgressDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  completedLessons: string[];
  lastAccessedLesson?: string;
  lastModuleId?: string;
  progressPercent: number;      // 0–100
  totalLessons: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

const progressSchema = new Schema<ProgressDocument>(
  {
    userId:              { type: String, required: true, index: true },
    courseSlug:          { type: String, required: true, index: true },
    completedLessons:    { type: [String], default: [] },
    lastAccessedLesson:  { type: String, default: '' },
    lastModuleId:        { type: String, default: '' },
    progressPercent:     { type: Number, default: 0, min: 0, max: 100 },
    totalLessons:        { type: Number, default: 0 },
    isCompleted:         { type: Boolean, default: false, index: true },
    completedAt:         { type: Date },
    lastAccessedAt:      { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });
progressSchema.index({ userId: 1, isCompleted: 1 });
progressSchema.index({ courseSlug: 1, isCompleted: 1 });

const Progress = models.Progress || model<ProgressDocument>('Progress', progressSchema);
export default Progress;
