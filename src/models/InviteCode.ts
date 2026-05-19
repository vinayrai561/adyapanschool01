import mongoose, { Schema, model, models } from 'mongoose';

export type InviteRole = 'COMPANY' | 'ADMIN';

export interface InviteCodeDocument {
  _id: mongoose.Types.ObjectId;
  code: string;                  // e.g. "ADYP-ORG-X7K2M9"
  role: InviteRole;              // which role this code grants
  emailAllowed?: string;         // if set, only this email can use it
  used: boolean;
  usedBy?: string;               // userId who used it
  usedAt?: Date;
  expiresAt: Date;
  createdBy: string;             // adminId who created it
  createdByEmail: string;
  note?: string;                 // optional label e.g. "For Acme Corp"
  createdAt: Date;
  updatedAt: Date;
}

const inviteCodeSchema = new Schema<InviteCodeDocument>(
  {
    code:           { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    role:           { type: String, enum: ['COMPANY', 'ADMIN'], required: true },
    emailAllowed:   { type: String, lowercase: true, trim: true, default: '' },
    used:           { type: Boolean, default: false, index: true },
    usedBy:         { type: String, default: '' },
    usedAt:         { type: Date },
    expiresAt:      { type: Date, required: true, index: true },
    createdBy:      { type: String, required: true },
    createdByEmail: { type: String, required: true, lowercase: true, trim: true },
    note:           { type: String, default: '' },
  },
  { timestamps: true }
);

inviteCodeSchema.index({ used: 1, expiresAt: 1 });
inviteCodeSchema.index({ createdBy: 1 });

const InviteCode = models.InviteCode || model<InviteCodeDocument>('InviteCode', inviteCodeSchema);
export default InviteCode;
