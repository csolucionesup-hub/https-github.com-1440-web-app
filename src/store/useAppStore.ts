import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "active" | "paused" | "pending" | "completed";

export interface Goal {
  id: string;
  name: string;
  status: Status;
}

export interface Project {
  id: string;
  goalId: string;
  name: string;
  status: Status;
}

export interface Objective {
  id: string;
  projectId: string;
  name: string;
  status: Status;
}

export interface Activity {
  id: string;
  objectiveId: string;
  name: string;
  minutes: number;
  plannedDaysOfWeek: number[];
  status: Status;
}

export interface ActionPlan {
  id: string;
  activityId: string;
  name: string;
  status: Status;
}

export interface WorkSession {
  id: string;
  activityId: string;
  actionPlanIds: string[];
  startTime: number;
  endTime: number;
}

interface AppState {
  goals: Goal[];
  projects: Project[];
  objectives: Objective[];
  activities: Activity[];
  actionPlans: ActionPlan[];
  workSessions: WorkSession[];

  addGoal: (goal: Goal) => void;
  addProject: (project: Project) => void;
  addObjective: (objective: Objective) => void;
  addActivity: (activity: Activity) => void;
  addActionPlan: (plan: ActionPlan) => void;
  addWorkSession: (session: WorkSession) => void;

  deleteGoal: (id: string) => void;
}

const MAX_ACTIVE_GOALS = 3;
const MAX_ACTIVE_PROJECTS = 3;
const MAX_ACTIVE_OBJECTIVES = 6;
const MAX_ACTIVE_ACTIVITIES = 10;
const MAX_ACTIVE_ACTION_PLANS = 15;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      goals: [],
      projects: [],
      objectives: [],
      activities: [],
      actionPlans: [],
      workSessions: [],

      addGoal: (goal) => {
        const active = get().goals.filter(g => g.status === "active").length;

        if (active >= MAX_ACTIVE_GOALS) {
          goal.status = "pending";
        }

        set(state => ({
          goals: [...state.goals, goal]
        }));
      },

      addProject: (project) => {
        const active = get().projects.filter(p => p.status === "active").length;

        if (active >= MAX_ACTIVE_PROJECTS) {
          project.status = "pending";
        }

        set(state => ({
          projects: [...state.projects, project]
        }));
      },

      addObjective: (objective) => {
        const active = get().objectives.filter(o => o.status === "active").length;

        if (active >= MAX_ACTIVE_OBJECTIVES) {
          objective.status = "pending";
        }

        set(state => ({
          objectives: [...state.objectives, objective]
        }));
      },

      addActivity: (activity) => {
        const active = get().activities.filter(a => a.status === "active").length;

        if (active >= MAX_ACTIVE_ACTIVITIES) {
          activity.status = "pending";
        }

        set(state => ({
          activities: [...state.activities, activity]
        }));
      },

      addActionPlan: (plan) => {
        const active = get().actionPlans.filter(p => p.status === "active").length;

        if (active >= MAX_ACTIVE_ACTION_PLANS) {
          plan.status = "pending";
        }

        set(state => ({
          actionPlans: [...state.actionPlans, plan]
        }));
      },

      addWorkSession: (session) => {
        set(state => ({
          workSessions: [...state.workSessions, session]
        }));
      },

      deleteGoal: (id) => {
        const projects = get().projects.filter(p => p.goalId === id).map(p => p.id);
        const objectives = get().objectives.filter(o => projects.includes(o.projectId)).map(o => o.id);
        const activities = get().activities.filter(a => objectives.includes(a.objectiveId)).map(a => a.id);
        const plans = get().actionPlans.filter(p => activities.includes(p.activityId)).map(p => p.id);

        set(state => ({
          goals: state.goals.filter(g => g.id !== id),
          projects: state.projects.filter(p => !projects.includes(p.id)),
          objectives: state.objectives.filter(o => !objectives.includes(o.id)),
          activities: state.activities.filter(a => !activities.includes(a.id)),
          actionPlans: state.actionPlans.filter(p => !plans.includes(p.id)),
          workSessions: state.workSessions.filter(
            w => !activities.includes(w.activityId)
          )
        }));
      }
    }),
    {
      name: "1440-storage",
      version: 2
    }
  )
);
