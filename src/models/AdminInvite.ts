/**
 * AdminInvite Model
 *
 * Stores secure invite tokens for admin/organization account creation.
 * Only superadmin (ADMIN role) can create these invites.
 * Token is a 64-byte hex string generated via crypto.randomBytes.
 */

import mongoose, { Schema, model, models } from 'mongoose';

export type AdminInviteRole = 'ADMIN' | 'ORGANIZATION' | 'SUPERADMIN';

export interface AdminInviteDocument {
  _id: mongoose.Types.ObjectId;
  email: string;                 // email the invite is locked to
  mobileNumber: string;          // mobile number the invite is locked to
  token: string;                 // 64-byte hex secure random token
  role: AdminInviteRole;         // role granted on signup
  used: boolean;
  usedBy?: string;               // userId who used it
  usedAt?: Date;
  expiresAt: Date;
  invitedBy: string;             // superadmin userId who created it
  invitedByEmail: string;        // superadmin email (for audit)
  note?: string;                 // optional label
  revokedAt?: Date;              // if revoked before use
  revokedBy?: string;            // superadmin who revoked
  // Failed attempt tracking
  failedAttempts: number;
  lastFailedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminInviteSchema = new Schema<AdminInviteDocument>(
  {
    email:          { type: String, required: true, lowercase: true, trim: true, index: true },
    mobileNumber:   { type: String, required: true, trim: true },
    token:          { type: String, required: true, unique: true, index: true },
    role:           { type: String, enum: ['ADMIN', 'ORGANIZATION', 'SUPERADMIN'], required: true },
    used:           { type: Boolean, default: false, index: true },
    usedBy:         { type: String, default: '' },
    usedAt:         { type: Date },
    expiresAt:      { type: Date, required: true, index: true },
    invitedBy:      { type: String, required: true },
    invitedByEmail: { type: String, required: true, lowercase: true, trim: true },
    note:           { type: String, default: '' },
    revokedAt:      { type: Date },
    revokedBy:      { type: String, default: '' },
    failedAttempts: { type: Number, default: 0 },
    lastFailedAt:   { type: Date },
  },
  { timestamps: true }
);

adminInviteSchema.index({ used: 1, expiresAt: 1 });
adminInviteSchema.index({ invitedBy: 1, createdAt: -1 });
adminInviteSchema.index({ email: 1, used: 1 });

const AdminInvite = models.AdminInvite || model<AdminInviteDocument>('AdminInvite', adminInviteSchema);
export default AdminInvite;
