import mongoose, { Schema, model, models } from 'mongoose';

export type CertificateTemplateType =
  | 'best_performance'
  | 'course_completion'
  | 'internship_completion'
  | 'project_completion';

export interface CertificateTemplateDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: CertificateTemplateType;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const certificateTemplateSchema = new Schema<CertificateTemplateDocument>(
  {
    title:    { type: String, required: true, trim: true },
    type:     {
      type: String,
      enum: ['best_performance', 'course_completion', 'internship_completion', 'project_completion'],
      required: true,
      unique: true,
    },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CertificateTemplate =
  models.CertificateTemplate ||
  model<CertificateTemplateDocument>('CertificateTemplate', certificateTemplateSchema);

export default CertificateTemplate;
