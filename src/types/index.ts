export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  companyName?: string | null;
  selectedProgram?: string | null;
  selectedAmount?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  education: Education[] | null;
  experience: Experience[] | null;
  careerGoals: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string | null;
  size: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  escoCode: string | null;
  description: string | null;
  createdAt: Date;
}

export interface SkillAssessment {
  id: string;
  userId: string;
  skillId: string;
  score: number;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  assessedAt: Date;
}

export interface Credential {
  id: string;
  userId: string;
  type: 'COURSE_COMPLETION' | 'PROJECT_COMPLETION' | 'SKILL_ASSESSMENT' | 'MICRO_CREDENTIAL' | 'BADGE';
  title: string;
  issuer: string;
  description: string | null;
  skills: string[];
  blockchainTxHash: string | null;
  issuedAt: Date;
  expiresAt: Date | null;
}

export interface Task {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: number | null;
  duration: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskApplication {
  id: string;
  taskId: string;
  studentId: string;
  coverLetter: string | null;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: Date;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  studentId: string;
  submission: any;
  rating: number | null;
  feedback: string | null;
  completedAt: Date;
}

export interface CareerPathway {
  id: string;
  title: string;
  description: string;
  industry: string;
  skills: string[];
  createdAt: Date;
}

export interface LaborMarketData {
  id: string;
  skillId: string;
  demandScore: number;
  avgSalary: number | null;
  jobCount: number | null;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface CareerGPSRecommendation {
  skillId: string;
  skillName: string;
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  targetLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  resources: {
    type: 'COURSE' | 'PROJECT' | 'EXTERNAL';
    title: string;
    url: string;
    estimatedTime: number; // in hours
  }[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}