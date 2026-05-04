import mongoose, { Schema, model, models } from "mongoose";

export type AuthUserRole = "STUDENT" | "COMPANY";

export interface AuthUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthUserRole;
  phone?: string;
  avatar?: string;
  companyName?: string;
  selectedProgram?: string;
  selectedAmount?: number;
  purchasedCourses: string[];
  wishlist: string[];
  // Login tracking
  lastLoginAt?: Date;
  loginCount: number;
  lastLoginIp?: string;
  lastUserAgent?: string;
  // Signup metadata
  signupIp?: string;
  userAgent?: string;
  signupAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authUserSchema = new Schema<AuthUserDocument>(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:    { type: String, required: true },
    role:            { type: String, enum: ["STUDENT", "COMPANY"], required: true },
    phone:           { type: String, trim: true, default: "" },
    avatar:          { type: String, trim: true, default: "" },
    companyName:     { type: String, trim: true, default: "" },
    selectedProgram: { type: String, trim: true },
    selectedAmount:  { type: Number, min: 0 },
    purchasedCourses:{ type: [String], default: [] },
    wishlist:        { type: [String], default: [] },
    // Login tracking
    lastLoginAt:     { type: Date },
    loginCount:      { type: Number, default: 0 },
    lastLoginIp:     { type: String, default: "" },
    lastUserAgent:   { type: String, default: "" },
    // Signup metadata
    signupIp:        { type: String, default: "" },
    userAgent:       { type: String, default: "" },
    signupAt:        { type: Date },
  },
  { timestamps: true }
);

const AuthUser = models.AuthUser || model<AuthUserDocument>("AuthUser", authUserSchema);
export default AuthUser;
