export type EntityStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'completed_early'
  | 'paused'
  | 'overdue'
  | 'archived';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: EntityStatus;
  period: 'annual' | 'quarterly';
  startDate?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  motto?: string;
  affirmation?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  period: 'semester' | 'quarterly' | 'monthly';
  status: EntityStatus;
  progress: number;
  startDate?: string;
  deadline?: string;
  order: number;
  completedAt?: string;
  createdAt: string;
}

export interface Objective {
  id: string;
  projectId: string; // Belongs to Project
  title: string;
  description?: string;
  period: 'quarterly' | 'monthly' | 'bimonthly';
  status: EntityStatus;
  progress: number;
  startDate?: string;
  deadline?: string;
  order: number;
  completedAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  objectiveId: string; // Belongs to Objective
  title: string;
  description?: string;
  period: 'monthly' | 'bimonthly' | 'weekly';
  status: EntityStatus;
  startDate?: string;
  deadline?: string;
  order: number;
  completedAt?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  activityId: string; // Belongs to Activity
  title: string;
  description?: string;
  period: 'weekly' | 'daily';
  status: EntityStatus;
  startDate?: string;
  deadline?: string;
  order: number;
  completedAt?: string;
  linkedTimeBlockId?: string; // Vinculo con sistema 1440
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  startTime: string; // "HH:mm"
  duration: number; // in minutes
  taskId?: string; // id de la tarea vinculada o nulo para tiempo general
  label: string;
  color?: string;
}
