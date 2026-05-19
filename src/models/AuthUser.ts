import mongoose, { Schema, model, models } from 'mongoose';

export type AuthUserRole = 'STUDENT' | 'COMPANY' | 'ADMIN' | 'SUPERADMIN';
export type AccountStatus = 'pending' | 'approved' | 'blocked';

export interface AuthUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthUserRole;
  accountStatus: AccountStatus;
  phone?: string;
  avatar?: string;
  companyName?: string;
  authProvider: string;
  selectedProgram?: string;
  selectedAmount?: number;
  purchasedCourses: string[];
  enrolledCourses: string[];
  wishlist: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  // Invite / approval tracking
  inviteCodeUsed?: string;
  invitedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  // Login tracking
  lastLoginAt?: Date;
  loginCount: number;
  lastLoginIp?: string;
  lastUserAgent?: string;
  // Account lockout (brute-force protection)
  failedLoginAttempts: number;
  lockedUntil?: Date;
  // Signup metadata
  signupIp?: string;
  userAgent?: string;
  signupAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authUserSchema = new Schema<AuthUserDocument>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:     { type: String, required: true },
    role:             { type: String, enum: ['STUDENT', 'COMPANY', 'ADMIN', 'SUPERADMIN'], required: true, index: true },
    accountStatus:    { type: String, enum: ['pending', 'approved', 'blocked'], default: 'approved', index: true },
    phone:            { type: String, trim: true, default: '' },
    avatar:           { type: String, trim: true, default: '' },
    companyName:      { type: String, trim: true, default: '' },
    authProvider:     { type: String, default: 'local' },
    selectedProgram:  { type: String, trim: true },
    selectedAmount:   { type: Number, min: 0 },
    purchasedCourses: { type: [String], default: [] },
    enrolledCourses:  { type: [String], default: [] },
    wishlist:         { type: [String], default: [] },
    isActive:         { type: Boolean, default: true, index: true },
    isEmailVerified:  { type: Boolean, default: false },
    // Invite / approval
    inviteCodeUsed:   { type: String, default: '' },
    invitedBy:        { type: String, default: '' },
    approvedAt:       { type: Date },
    approvedBy:       { type: String, default: '' },
    // Login tracking
    lastLoginAt:      { type: Date },
    loginCount:       { type: Number, default: 0 },
    lastLoginIp:      { type: String, default: '' },
    lastUserAgent:    { type: String, default: '' },
    // Account lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil:         { type: Date },
    // Signup metadata
    signupIp:         { type: String, default: '' },
    userAgent:        { type: String, default: '' },
    signupAt:         { type: Date },
  },
  { timestamps: true }
);

authUserSchema.index({ role: 1, accountStatus: 1 });
authUserSchema.index({ role: 1, createdAt: -1 });
authUserSchema.index({ email: 1, role: 1 });
authUserSchema.index(
  { phone: 1 },
  { partialFilterExpression: { phone: { $type: 'string', $gt: '' } } }
);
authUserSchema.index({ createdAt: -1 });

const AuthUser = models.AuthUser || model<AuthUserDocument>('AuthUser', authUserSchema);
export default AuthUser;
