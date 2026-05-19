/**
 * OfflineInternshipLead Model
 * Stores enrollment enquiries from the /offline-services page.
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface OfflineInternshipLeadDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  college: string;
  courseInterest: string;
  preferredBatch: string;
  city: string;
  status: 'new' | 'contacted' | 'enrolled' | 'converted' | 'rejected' | 'not_interested';
  source: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<OfflineInternshipLeadDocument>(
  {
    name:           { type: String, required: true, trim: true },
    phone:          { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    college:        { type: String, default: '', trim: true },
    courseInterest: { type: String, default: '' },
    preferredBatch: { type: String, default: '' },
    city:           { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'enrolled', 'converted', 'rejected', 'not_interested'],
      default: 'new',
      index: true,
    },
    source: { type: String, default: 'offline_services_page' },
    notes:  { type: String, default: '' },
  },
  { timestamps: true, collection: 'OfflineInternshipLeads' }
);

schema.index({ email: 1 });
schema.index({ phone: 1 });
schema.index({ createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });

const OfflineInternshipLead = models.OfflineInternshipLead
  || model<OfflineInternshipLeadDocument>('OfflineInternshipLead', schema);
export default OfflineInternshipLead;
