// ---------- Shared domain types ----------
// These mirror the shape the future Spring Boot REST API is expected to return.

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  id: number;
  name: string;
  category: "Backend" | "Database" | "Frontend" | "Tools" | string;
  icon: string; // icon key, resolved by <SkillIcon />
  level: SkillLevel;
  yearsOfExperience?: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  date: string; // ISO date
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null; // null = present
  description: string[];
  technologies: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  description?: string;
  achievements?: string[];
}

export interface ProfileStat {
  id: number;
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  email: string;
  location: string;
  availability: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  stats: ProfileStat[];
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: {
    github: string;
    linkedin: string;
  };
  availableLanguages: string[];
  resumeUrl: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export type Locale = "en" | "ur";

export interface TranslationEntry {
  key: string;
  en: string;
  ur: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin";
}

// ---------- Generic API envelope ----------
export interface ApiError {
  message: string;
  status?: number;
}

export type RequestState = "idle" | "loading" | "success" | "empty" | "error";
