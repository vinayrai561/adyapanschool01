import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'flat';
  discount: number;          // % or ₹ amount
  maxDiscount?: number;      // cap for percentage coupons
  minPurchase?: number;      // minimum order value
  expiryDate: Date;
  usageLimit: number;        // max total uses
  usedCount: number;         // how many times used so far
  usedBy: string[];          // array of user emails who used it
  active: boolean;
  courseIds?: string[];      // if set, only valid for these plan IDs
  firstUserOnly: boolean;    // only for first-time purchasers
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:          { type: String, enum: ['percentage', 'flat'], required: true },
    discount:      { type: Number, required: true, min: 0 },
    maxDiscount:   { type: Number },
    minPurchase:   { type: Number, default: 0 },
    expiryDate:    { type: Date, required: true },
    usageLimit:    { type: Number, required: true, default: 100 },
    usedCount:     { type: Number, default: 0 },
    usedBy:        [{ type: String }],
    active:        { type: Boolean, default: true },
    courseIds:     [{ type: String }],
    firstUserOnly: { type: Boolean, default: false },
    description:   { type: String },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
