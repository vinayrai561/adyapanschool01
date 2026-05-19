/**
 * OrganizationUser Model
 *
 * Separate MongoDB collection: "organizationusers"
 * Only pre-approved organization accounts are stored here.
 * No public signup — accounts are created only via seed script.
 */

import mongoose, { Schema, model, models } from 'mongoose';

export interface OrganizationUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'organization';
  isApproved: boolean;
  accountStatus: 'active' | 'suspended';
  // Login tracking
  lastLoginAt?: Date;
  loginCount: number;
  lastLoginIp?: string;
  // Account lockout
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orgUserSchema = new Schema<OrganizationUserDocument>(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:  { type: String, required: true },
    role:          { type: String, default: 'organization', immutable: true },
    isApproved:    { type: Boolean, default: true },
    accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active', index: true },
    // Login tracking
    lastLoginAt:   { type: Date },
    loginCount:    { type: Number, default: 0 },
    lastLoginIp:   { type: String, default: '' },
    // Account lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil:         { type: Date },
  },
  {
    timestamps:  true,
    collection:  'organizationusers', // explicit collection name
  }
);

const OrganizationUser = models.OrganizationUser
  || model<OrganizationUserDocument>('OrganizationUser', orgUserSchema);

export default OrganizationUser;
