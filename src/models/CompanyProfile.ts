/**
 * CompanyProfile Model
 * Extended profile for organization/company users.
 * Collection: companyprofiles
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface CompanyProfileDocument {
  _id: mongoose.Types.ObjectId;
  organizationUserId: string;
  companyName: string;
  companyEmail: string;
  mobileNumber: string;
  website: string;
  logoUrl: string;
  industry: string;
  companySize: string;
  gstOrCin: string;
  address: string;
  city: string;
  state: string;
  country: string;
  verificationStatus: VerificationStatus;
  verifiedBy: string;
  verifiedAt: Date | null;
  rejectionReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<CompanyProfileDocument>(
  {
    organizationUserId: { type: String, required: true, unique: true, index: true },
    companyName:        { type: String, required: true, trim: true },
    companyEmail:       { type: String, required: true, lowercase: true, trim: true },
    mobileNumber:       { type: String, default: '' },
    website:            { type: String, default: '' },
    logoUrl:            { type: String, default: '' },
    industry:           { type: String, default: '' },
    companySize:        { type: String, default: '' },
    gstOrCin:           { type: String, default: '' },
    address:            { type: String, default: '' },
    city:               { type: String, default: '' },
    state:              { type: String, default: '' },
    country:            { type: String, default: 'India' },
    verificationStatus: { type: String, enum: ['pending','verified','rejected'], default: 'pending', index: true },
    verifiedBy:         { type: String, default: '' },
    verifiedAt:         { type: Date, default: null },
    rejectionReason:    { type: String, default: '' },
  },
  { timestamps: true, collection: 'companyprofiles' }
);

const CompanyProfile = models.CompanyProfile || model<CompanyProfileDocument>('CompanyProfile', schema);
export default CompanyProfile;
