import mongoose, { Schema, model, models } from 'mongoose';

export interface PlanDocument {
  _id: mongoose.Types.ObjectId;
  planId: string;           // 'plan-1', 'plan-2', 'plan-3', 'plan-4-premium'
  planName: string;         // 'Plan 1', 'Plan 2', 'Plan 3', 'Plan 4'
  displayName: string;      // 'Adyapan Starter', 'Adyapan Career Pro', etc.
  price: number;            // base price in INR
  originalPrice: number;    // crossed-out price
  discountPercent: number;
  duration: string;         // '2 Months', '4 Months'
  totalDays: number;
  benefits: string[];
  features: string[];
  isPopular: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<PlanDocument>(
  {
    planId:          { type: String, required: true, unique: true, trim: true },
    planName:        { type: String, required: true, trim: true },
    displayName:     { type: String, required: true, trim: true },
    price:           { type: Number, required: true, min: 0 },
    originalPrice:   { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    duration:        { type: String, default: '' },
    totalDays:       { type: Number, default: 0 },
    benefits:        { type: [String], default: [] },
    features:        { type: [String], default: [] },
    isPopular:       { type: Boolean, default: false },
    status:          { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

planSchema.index({ planId: 1 });
planSchema.index({ status: 1 });

const Plan = models.Plan || model<PlanDocument>('Plan', planSchema);
export default Plan;
