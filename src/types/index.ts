// ── Resume Types ──────────────────────────────────────────────────────────────

export interface PersonalInfo {
  image: string | File;
  full_name: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current: boolean;
}

export interface ProjectEntry {
  name: string;
  type: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
  gpa: string;
}

export interface VersionEntry {
  savedAt: string;
  label: string;
  snapshot: Partial<ResumeData>;
}

export interface ResumeData {
  _id?: string;
  title: string;
  isPublic?: boolean;
  public?: boolean;
  template: string;
  accent_color: string;
  professional_summary: string;
  skills: string[];
  personal_info: Partial<PersonalInfo>;
  experience: ExperienceEntry[];
  project: ProjectEntry[];
  education: EducationEntry[];
  views?: number;
  downloads?: number;
  versions?: VersionEntry[];
  createdAt?: string;
  updatedAt?: string;
}

// ── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface ResumeListItem {
  _id: string;
  title: string;
  isPublic: boolean;
  template: string;
  accent_color: string;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  personal_info?: Partial<PersonalInfo>;
}

// ── Auth Types ────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  isVerified: boolean;
  googleId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  success: boolean;
  statusCode: number | null;
  message: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
}

export interface SigninPayload {
  emailId: string;
  password: string;
}

// ── AI Types ──────────────────────────────────────────────────────────────────

export interface ATSAnalysis {
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface ATSAnalysisPayload {
  resumeData: ResumeData;
  jobDescription: string;
}

export interface CoverLetterPayload {
  resumeId: string;
  jobDescription: string;
}

export interface UploadResumePayload {
  resumeText: string;
  title: string;
}

export interface ImportLinkedInPayload {
  linkedInText: string;
  title: string;
}

// ── Redux Store ───────────────────────────────────────────────────────────────

export interface RootState {
  auth: AuthState;
}

// ── Completeness Types ────────────────────────────────────────────────────────

export interface CompletenessTip {
  key: string;
  label: string;
  points: number;
  tip: string;
  done: boolean;
}

export interface CompletenessResult {
  score: number;
  tips: CompletenessTip[];
  completedSections: CompletenessTip[];
  totalSections: number;
  allSections: CompletenessTip[];
}

// ── Update Resume Payload ─────────────────────────────────────────────────────

export interface UpdateResumePayload {
  resumeId: string;
  resumeData: ResumeData;
  image?: File | null;
  removeBackground?: boolean;
}
