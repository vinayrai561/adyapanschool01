/**
 * Placement — tracks student placements
 * Collection: placements
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface PlacementDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  studentName: string;
  studentEmail: string;
  companyName: string;
  jobTitle: string;
  packageAmount: number;        // Annual package in INR
  packageCurrency: string;
  joiningDate: Date;
  placementType: 'full-time' | 'part-time' | 'internship' | 'contract';
  courseSlug?: string;
  courseName?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<PlacementDocument>(
  {
    userId:          { type: String, required: true, index: true },
    studentName:     { type: String, required: true, trim: true },
    studentEmail:    { type: String, required: true, lowercase: true, trim: true },
    companyName:     { type: String, required: true, trim: true, index: true },
    jobTitle:        { type: String, required: true, trim: true },
    packageAmount:   { type: Number, required: true, min: 0 },
    packageCurrency: { type: String, default: 'INR' },
    joiningDate:     { type: Date, required: true },
    placementType:   { 
      type: String, 
      enum: ['full-time', 'part-time', 'internship', 'contract'], 
      default: 'full-time',
      index: true 
    },
    courseSlug:      { type: String, default: '' },
    courseName:      { type: String, default: '' },
    isVerified:      { type: Boolean, default: false, index: true },
    verifiedBy:      { type: String, default: '' },
    verifiedAt:      { type: Date },
  },
  { timestamps: true, collection: 'placements' }
);

schema.index({ userId: 1, createdAt: -1 });
schema.index({ companyName: 1 });
schema.index({ isVerified: 1, createdAt: -1 });
schema.index({ joiningDate: -1 });

const Placement = models.Placement
  || model<PlacementDocument>('Placement', schema);
export default Placement;
