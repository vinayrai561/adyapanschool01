/**
 * ManualLead Model
 * Stores student leads manually entered by admins from the admin panel.
 * source is always "manual-admin-entry".
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type EnrollmentType = 'Online' | 'Offline Form' | 'Office Visit' | 'Phone Call';
export type PaymentStatus  = 'Paid' | 'Pending' | 'Failed' | 'Partial';

export interface ManualLeadDocument {
  _id: mongoose.Types.ObjectId;
  // Student info
  name:           string;
  phone:          string;
  email:          string;
  college:        string;
  city:           string;
  courseInterest: string;
  preferredBatch: string;
  // Entry metadata
  enrollmentType: EnrollmentType;
  paymentStatus:  PaymentStatus;
  amountPaid:     number;
  notes:          string;
  addedByAdmin:   string;   // admin name / email
  source:         'manual-admin-entry';
  createdAt:      Date;
  updatedAt:      Date;
}

const schema = new Schema<ManualLeadDocument>(
  {
    name:           { type: String, required: true, trim: true },
    phone:          { type: String, required: true, trim: true, index: true },
    email:          { type: String, required: true, lowercase: true, trim: true, index: true },
    college:        { type: String, default: '', trim: true },
    city:           { type: String, default: '', trim: true },
    courseInterest: { type: String, default: '' },
    preferredBatch: { type: String, default: '' },
    enrollmentType: {
      type: String,
      enum: ['Online', 'Offline Form', 'Office Visit', 'Phone Call'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Partial'],
      default: 'Pending',
    },
    amountPaid:   { type: Number, default: 0, min: 0 },
    notes:        { type: String, default: '', maxlength: 2000 },
    addedByAdmin: { type: String, default: '', trim: true },
    source:       { type: String, default: 'manual-admin-entry', immutable: true },
  },
  { timestamps: true, collection: 'ManualLeads' }
);

schema.index({ createdAt: -1 });
schema.index({ enrollmentType: 1, createdAt: -1 });
schema.index({ paymentStatus: 1 });

const ManualLead = models.ManualLead || model<ManualLeadDocument>('ManualLead', schema);
export default ManualLead;
