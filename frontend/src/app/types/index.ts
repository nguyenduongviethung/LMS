// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum ClassStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum UserClassRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  TEACHER_ASSISTANT = 'TEACHER_ASSISTANT',
}

export enum TuitionStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
}

export enum TaskResultStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
}

export enum ProgramStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum UserProgramRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum ContentRole {
  LECTURE_MATERIAL = 'LECTURE_MATERIAL',
  ASSIGNMENT = 'ASSIGNMENT',
  HOMEWORK = 'HOMEWORK',
  QUIZ = 'QUIZ',
}

export enum ContentFileRole {
  LECTURE_NOTE = 'LECTURE_NOTE',
  ASSIGNMENT = 'ASSIGNMENT',
  SUBMISSION_LINK = 'SUBMISSION_LINK',
}

// Interfaces
export interface User {
  userId: number;
  status: UserStatus;
  role: UserRole;
  name: string;
  birthDate?: string;
  email: string;
  phone?: string;
  password: string;
  studyPlace?: string;
  workPlace?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  classId: number;
  status: ClassStatus;
  name: string;
  description?: string;
  defaultTuition?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserClass {
  userClassId: number;
  userId: number;
  classId: number;
  role: UserClassRole;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  studentId: number;
  reviewerId: number;
  classId: number;
  month: number;
  year: number;
  goodAttitude?: string;
  badAttitude?: string;
  goodSkills?: string;
  badSkills?: string;
  goodKnowledge?: string;
  badKnowledge?: string;
}

export interface Tuition {
  userId: number;
  classId: number;
  status: TuitionStatus;
  month: number;
  year: number;
  amount: number;
}

export interface Schedule {
  scheduleId: number;
  classId: number;
  weekday: number;
  startTime: string;
  duration: number;
}

export interface Session {
  sessionId: number;
  templateSessionId?: number;
  classId: number;
  name: string;
  description?: string;
  content?: string;
  fileUrl?: string;
  startTime?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  userId: number;
  sessionId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface TaskResult {
  userId: number;
  contentId: number;
  status: TaskResultStatus;
  score?: number;
  reviews?: string;
}

export interface Program {
  programId: number;
  name: string;
  description?: string;
  status: ProgramStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgram {
  userProgramId: number;
  userId: number;
  programId: number;
  role: UserProgramRole;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSession {
  templateSessionId: number;
  name: string;
  description?: string;
  content?: string;
  fileUrl?: string;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  contentId: number;
  name: string;
  description?: string;
  contentType: string;
  deadline?: string;
  cutoffScore?: number;
  role: ContentRole;
  createdAt: string;
  updatedAt: string;
}

export interface SessionContent {
  sessionId: number;
  contentId: number;
}

export interface TemplateSessionContent {
  templateSessionId: number;
  contentId: number;
}

export interface File {
  fileId: number;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: number;
  uploadedAt: string;
}

export interface ContentFile {
  contentId: number;
  fileId: number;
  role: ContentFileRole;
}