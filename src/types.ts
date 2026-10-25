export interface Teacher {
  id: number;
  name: string;
  role: string;
  info: string;
  phone?: string;
  subject?: string;
  avatarBg?: string;
}

export interface Student {
  id: number;
  name: string;
  role: string; // e.g. "الصف السادس"
  info: string; // achievement or note
  likes?: number;
  dateAdded?: string;
}

export interface LearningStrategy {
  id: number;
  name: string;
  iconName: string;
  cat: 'team' | 'thinking' | 'summary' | 'assessment';
  catLabel: string;
  brief: string;
  time: string;
  bestFor: string;
  steps: string[];
  teacherRole: string;
  tip: string;
}

export interface StudentPost {
  id: number;
  author: string;
  grade: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  cat: 'activities' | 'events' | 'classes';
  catLabel: string;
  img: string;
  date?: string;
}

export interface SchoolStats {
  students: number;
  teachers: number;
  classes: number;
  awards: number;
  visitors?: number;
}

export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  onlineNow: number;
  lastVisitDate?: string;
}

export interface UserSession {
  username: string;
  name: string;
  role: 'admin' | 'guest';
}

export interface SyncReport {
  timestamp: string;
  addedCount: number;
  removedCount: number;
  totalStudents: number;
  classesCount: number;
  addedNames: string[];
}

export type EventCategory = 'exam' | 'holiday' | 'activity' | 'meeting';

export interface SchoolEvent {
  id: number;
  title: string;
  category: EventCategory;
  categoryLabel?: string;
  date: string; // YYYY-MM-DD
  hijriDate?: string;
  time?: string;
  location?: string;
  description: string;
  targetAudience?: string;
  isImportant?: boolean;
}
