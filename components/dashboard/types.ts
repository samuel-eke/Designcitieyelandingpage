import { LucideIcon } from "lucide-react";

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  status: string;
  brief: string;
  full: string;
  docs: string;
  officerNotes: string;
  actionLabel: string;
}

export interface ChatMessage {
  sender: "citizen" | "officer";
  text: string;
  time: string;
}

export interface KpiItem {
  id: string;
  label: string;
  completed: boolean;
  points: number;
}

export interface ProfileData {
  bio: string;
  ninVerified: boolean;
  educationalLevel: string;
  occupation: string;
}

export interface MetricsFeedback {
  securityRating: string;
  powerRating: string;
  roadRating: string;
  healthcareRating: string;
  satisfactionText: string;
}

export interface ComplaintItem {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  date: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}
