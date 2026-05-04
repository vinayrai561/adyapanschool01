import mongoose, { Schema, model, models } from 'mongoose';

export interface LessonDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  duration: string;       // e.g. "12 min"
  videoUrl?: string;
  description?: string;
  isFree: boolean;
}

export interface ModuleDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  lessons: LessonDocument[];
}

export interface CourseDocument {
  _id: mongoose.Types.ObjectId;
  slug: string;           // matches plan key: 'plan-1', 'plan-4-premium', etc.
  title: string;
  subtitle: string;
  duration: string;       // e.g. "2 Months"
  totalLessons: number;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: ModuleDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<LessonDocument>({
  title:       { type: String, required: true },
  duration:    { type: String, default: '10 min' },
  videoUrl:    { type: String, default: '' },
  description: { type: String, default: '' },
  isFree:      { type: Boolean, default: false },
});

const moduleSchema = new Schema<ModuleDocument>({
  title:   { type: String, required: true },
  lessons: { type: [lessonSchema], default: [] },
});

const courseSchema = new Schema<CourseDocument>(
  {
    slug:         { type: String, required: true, unique: true },
    title:        { type: String, required: true },
    subtitle:     { type: String, default: '' },
    duration:     { type: String, default: '' },
    totalLessons: { type: Number, default: 0 },
    thumbnail:    { type: String, default: '' },
    category:     { type: String, default: '' },
    level:        { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    modules:      { type: [moduleSchema], default: [] },
  },
  { timestamps: true }
);

const Course = models.Course || model<CourseDocument>('Course', courseSchema);
export default Course;
