import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Project, Objective, Activity, Task, TimeBlock, EntityStatus } from '../types';

interface AppState {
    goals: Goal[];
    projects: Project[];
    objectives: Objective[];
    activities: Activity[];
    tasks: Task[];
    timeBlocks: TimeBlock[];

    // Actions
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    addObjective: (objective: Omit<Objective, 'id' | 'createdAt'>) => void;
    updateObjective: (id: string, updates: Partial<Objective>) => void;
    deleteObjective: (id: string) => void;

    addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;

    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;

    addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
    updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
    deleteTimeBlock: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            goals: [],
            projects: [],
            objectives: [],
            activities: [],
            tasks: [],
            timeBlocks: [],

            addGoal: (goalData) => set((state) => {
                if (goalData.status === 'in_progress') {
                    const activeCount = state.goals.filter(g => g.status === 'in_progress').length;
                    if (activeCount >= 3) {
                        alert('Límite alcanzado: Sólo puedes tener 3 metas activas al mismo tiempo.');
                        return state;
                    }
                }
                const newGoal: Goal = {
                    ...goalData,
                    id: generateId(),
                    createdAt: new Date().toISOString()
                };
                return { goals: [...state.goals, newGoal] };
            }),

            updateGoal: (id, updates) => set((state) => {
                if (updates.status === 'in_progress') {
                    const activeCount = state.goals.filter(g => g.status === 'in_progress' && g.id !== id).length;
                    if (activeCount >= 3) {
                        alert('Límite alcanzado: Sólo puedes tener 3 metas activas al mismo tiempo.');
                        return state;
                    }
                }
                return {
                    goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
                };
            }),

            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter((g) => g.id !== id),
                projects: state.projects.filter((p) => p.goalId !== id),
            })),

            addProject: (data) => set((state) => {
                let finalStatus = data.status;
                if (finalStatus === 'in_progress') {
                    const activeCount = state.projects.filter(p => p.goalId === data.goalId && p.status === 'in_progress').length;
                    if (activeCount >= 6) {
                        alert('Límite de 6 proyectos activos alcanzado para esta meta. El proyecto se ha guardado en el Banco de Proyectos como Pendiente.');
                        finalStatus = 'pending';
                    }
                }
                return {
                    projects: [...state.projects, { ...data, status: finalStatus, id: generateId(), createdAt: new Date().toISOString() }]
                };
            }),

            updateProject: (id, updates) => set((state) => {
                if (updates.status === 'in_progress') {
                    const projectToUpdate = state.projects.find(p => p.id === id);
                    if (projectToUpdate) {
                        const activeCount = state.projects.filter(p => p.goalId === projectToUpdate.goalId && p.status === 'in_progress' && p.id !== id).length;
                        if (activeCount >= 6) {
                            alert('Límite alcanzado: Sólo puedes tener 6 proyectos activos al mismo tiempo para esta meta.');
                            return state;
                        }
                    }
                }
                return {
                    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                };
            }),

            deleteProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
                objectives: state.objectives.filter((o) => o.projectId !== id),
            })),

            addObjective: (data) => set((state) => ({
                objectives: [...state.objectives, { ...data, id: generateId(), createdAt: new Date().toISOString() }]
            })),

            updateObjective: (id, updates) => set((state) => ({
                objectives: state.objectives.map((o) => (o.id === id ? { ...o, ...updates } : o)),
            })),

            deleteObjective: (id) => set((state) => ({
                objectives: state.objectives.filter((o) => o.id !== id),
                activities: state.activities.filter((a) => a.objectiveId !== id),
            })),

            addActivity: (data) => set((state) => ({
                activities: [...state.activities, { ...data, id: generateId(), createdAt: new Date().toISOString() }]
            })),

            updateActivity: (id, updates) => set((state) => ({
                activities: state.activities.map((a) => (a.id === id ? { ...a, ...updates } : a)),
            })),

            deleteActivity: (id) => set((state) => ({
                activities: state.activities.filter((a) => a.id !== id),
                tasks: state.tasks.filter((t) => t.activityId !== id),
            })),

            addTask: (data) => set((state) => ({
                tasks: [...state.tasks, { ...data, id: generateId(), createdAt: new Date().toISOString() }]
            })),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),

            addTimeBlock: (data) => set((state) => ({
                timeBlocks: [...state.timeBlocks, { ...data, id: generateId() }]
            })),

            updateTimeBlock: (id, updates) => set((state) => ({
                timeBlocks: state.timeBlocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
            })),

            deleteTimeBlock: (id) => set((state) => ({
                timeBlocks: state.timeBlocks.filter((b) => b.id !== id),
            })),
        }),
        {
            name: '1440-storage',
        }
    )
);
