/**
 * JobPost Model
 * Stores job/internship/vacancy postings by verified companies.
 * Collection: jobposts
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'freelance' | 'project-based' | 'work-from-home';
export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type JobStatus = 'draft' | 'active' | 'closed' | 'rejected';

export interface JobPostDocument {
  _id: mongoose.Types.ObjectId;
  companyId: string;           // OrganizationUser._id
  organizationUserId: string;  // alias
  companyName: string;
  companyEmail: string;
  companyLogoUrl: string;
  companyWebsite: string;
  companyIndustry: string;
  companyCity: string;
  companyVerified: boolean;
  jobTitle: string;
  category: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  educationRequirement: string;
  experienceLevel: string;
  openings: number;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  salaryOrStipend: string;
  deadline: Date;
  status: JobStatus;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<JobPostDocument>(
  {
    companyId:           { type: String, required: true, index: true },
    organizationUserId:  { type: String, required: true, index: true },
    companyName:         { type: String, required: true, trim: true },
    companyEmail:        { type: String, required: true, lowercase: true, trim: true },
    companyLogoUrl:      { type: String, default: '' },
    companyWebsite:      { type: String, default: '' },
    companyIndustry:     { type: String, default: '' },
    companyCity:         { type: String, default: '' },
    companyVerified:     { type: Boolean, default: false },
    jobTitle:            { type: String, required: true, trim: true },
    category:            { type: String, required: true, trim: true },
    description:         { type: String, required: true },
    responsibilities:    { type: [String], default: [] },
    requiredSkills:      { type: [String], default: [], index: true },
    educationRequirement:{ type: String, default: '' },
    experienceLevel:     { type: String, default: 'Fresher' },
    openings:            { type: Number, default: 1, min: 1 },
    employmentType:      { type: String, enum: ['full-time','part-time','internship','freelance','project-based','work-from-home'], default: 'internship', index: true },
    workMode:            { type: String, enum: ['remote','hybrid','onsite'], default: 'onsite' },
    location:            { type: String, default: '', index: true },
    salaryOrStipend:     { type: String, default: '' },
    deadline:            { type: Date, required: true },
    status:              { type: String, enum: ['draft','active','closed','rejected'], default: 'draft', index: true },
    applicantsCount:     { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'jobposts' }
);

schema.index({ companyId: 1, createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });
schema.index({ employmentType: 1, status: 1 });
schema.index({ location: 1, status: 1 });
schema.index({ requiredSkills: 1, status: 1 });
schema.index({ category: 1, status: 1 });

const JobPost = models.JobPost || model<JobPostDocument>('JobPost', schema);
export default JobPost;
