import mongoose, { Schema, model, models } from 'mongoose';

export interface ProgressDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  completedLessons: string[];   // array of lessonId strings
  lastLessonId?: string;
  lastModuleId?: string;
  progressPercent: number;      // 0–100
  totalLessons: number;
  completedAt?: Date;           // set when progressPercent === 100
  updatedAt: Date;
  createdAt: Date;
}

const progressSchema = new Schema<ProgressDocument>(
  {
    userId:           { type: String, required: true, index: true },
    courseSlug:       { type: String, required: true },
    completedLessons: { type: [String], default: [] },
    lastLessonId:     { type: String, default: '' },
    lastModuleId:     { type: String, default: '' },
    progressPercent:  { type: Number, default: 0, min: 0, max: 100 },
    totalLessons:     { type: Number, default: 0 },
    completedAt:      { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

const Progress = models.Progress || model<ProgressDocument>('Progress', progressSchema);
export default Progress;
