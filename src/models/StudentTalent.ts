/**
 * StudentTalent Model — Adyapan
 *
 * Stores talent profiles for the "Find & Hire Top Talent" page.
 * Separate from AuthUser — this is a curated talent showcase collection.
 * Collection: studenttalents
 */
import mongoose, { Schema, model, models } from 'mongoose';

export type TalentStatus = 'available' | 'shortlisted' | 'hired' | 'placed';

export interface ExperienceEntry {
  company:   string;
  role:      string;
  duration:  string;
  location:  string;
  points:    string[];
}

export interface ProjectEntry {
  name:        string;
  type?:       string;
  tools:       string[];
  description: string;
}

export interface StudentTalentDocument {
  _id:                mongoose.Types.ObjectId;
  name:               string;
  company:            string;
  role:               string;
  status:             TalentStatus;
  placed:             boolean;
  availability:       string;
  packageExpectation: string;
  skills:             string[];
  education:          string;
  course:             string;
  experienceLevel:    string;
  projectsCount:      number;
  certificatesCount:  number;
  rating:             number;
  portfolio:          string;
  github:             string;
  linkedin:           string;
  email:              string;
  phone:              string;
  location:           string;
  resumeUrl:          string;
  profileSummary:     string;
  objective:          string;
  experience:         ExperienceEntry[];
  projects:           ProjectEntry[];
  certifications:     string[];
  createdAt:          Date;
  updatedAt:          Date;
}

const experienceSchema = new Schema<ExperienceEntry>(
  {
    company:  { type: String, default: '' },
    role:     { type: String, default: '' },
    duration: { type: String, default: '' },
    location: { type: String, default: '' },
    points:   { type: [String], default: [] },
  },
  { _id: false }
);

const projectSchema = new Schema<ProjectEntry>(
  {
    name:        { type: String, default: '' },
    type:        { type: String, default: '' },
    tools:       { type: [String], default: [] },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const studentTalentSchema = new Schema<StudentTalentDocument>(
  {
    name:               { type: String, required: true, trim: true },
    company:            { type: String, default: '', trim: true },
    role:               { type: String, default: '', trim: true },
    status: {
      type:    String,
      enum:    ['available', 'shortlisted', 'hired', 'placed'],
      default: 'available',
      index:   true,
    },
    placed:             { type: Boolean, default: false, index: true },
    availability:       { type: String, default: '' },
    packageExpectation: { type: String, default: '' },
    skills:             { type: [String], default: [], index: true },
    education:          { type: String, default: '' },
    course:             { type: String, default: '', index: true },
    experienceLevel:    { type: String, default: '' },
    projectsCount:      { type: Number, default: 0, min: 0 },
    certificatesCount:  { type: Number, default: 0, min: 0 },
    rating:             { type: Number, default: 0, min: 0, max: 5 },
    portfolio:          { type: String, default: '' },
    github:             { type: String, default: '' },
    linkedin:           { type: String, default: '' },
    email:              { type: String, default: '', lowercase: true, trim: true, index: true },
    phone:              { type: String, default: '', trim: true, index: true },
    location:           { type: String, default: '' },
    resumeUrl:          { type: String, default: '' },
    profileSummary:     { type: String, default: '' },
    objective:          { type: String, default: '' },
    experience:         { type: [experienceSchema], default: [] },
    projects:           { type: [projectSchema], default: [] },
    certifications:     { type: [String], default: [] },
  },
  {
    timestamps:  true,
    collection:  'studenttalents',
  }
);

// Indexes for fast filtering
studentTalentSchema.index({ status: 1, createdAt: -1 });
studentTalentSchema.index({ placed: 1 });
studentTalentSchema.index({ course: 1, status: 1 });
studentTalentSchema.index({ experienceLevel: 1 });
studentTalentSchema.index({ name: 'text', role: 'text', skills: 'text', education: 'text', course: 'text' });

const StudentTalent = models.StudentTalent
  || model<StudentTalentDocument>('StudentTalent', studentTalentSchema);

export default StudentTalent;
