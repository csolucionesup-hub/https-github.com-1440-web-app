import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Project, Objective, Activity, Task, WorkSession, DailySettings, EntityStatus } from '../types';

interface AppState {
    goals: Goal[];
    projects: Project[];
    objectives: Objective[];
    activities: Activity[];
    tasks: Task[]; // Plan de Acción
    workSessions: WorkSession[];
    dailySettings: DailySettings;

    // Actions
    updateDailySettings: (settings: Partial<DailySettings>) => void;

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

    addWorkSession: (session: Omit<WorkSession, 'id'>) => void;
    updateWorkSession: (id: string, updates: Partial<WorkSession>) => void;
    deleteWorkSession: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const now = () => new Date().toISOString();

// Helper para cascada de estados descendentes
const propagateStatusDown = (
    state: AppState,
    level: 'goal' | 'project' | 'objective' | 'activity',
    id: string,
    newStatus: EntityStatus
): Partial<AppState> => {
    // Si pasamos a un estado de inactividad (pausado, pendiente/banco, archivado), propagamos.
    // Si activamos un padre, NO activamos a los hijos por defecto (el usuario decide cuáles).
    if (newStatus === 'in_progress' || newStatus === 'completed' || newStatus === 'completed_early') return {};

    const ts = now();
    const updates: Partial<AppState> = {};

    if (level === 'goal') {
        const _projects = state.projects.map(p => p.goalId === id && p.status === 'in_progress' ? { ...p, status: newStatus, statusUpdatedAt: ts } : p);
        updates.projects = _projects as Project[];
        const modifiedProjectIds = updates.projects.filter(p => p.goalId === id && state.projects.find(oldP => oldP.id === p.id)?.status === 'in_progress').map(p => p.id);

        const _objectives = state.objectives.map(o => modifiedProjectIds.includes(o.projectId) && o.status === 'in_progress' ? { ...o, status: newStatus, statusUpdatedAt: ts } : o);
        updates.objectives = _objectives as Objective[];
        const modifiedObjIds = updates.objectives.filter(o => modifiedProjectIds.includes(o.projectId) && state.objectives.find(oldO => oldO.id === o.id)?.status === 'in_progress').map(o => o.id);

        const _activities = state.activities.map(a => modifiedObjIds.includes(a.objectiveId) && a.status === 'in_progress' ? { ...a, status: newStatus, statusUpdatedAt: ts } : a);
        updates.activities = _activities as Activity[];
        const modifiedActIds = updates.activities.filter(a => modifiedObjIds.includes(a.objectiveId) && state.activities.find(oldA => oldA.id === a.id)?.status === 'in_progress').map(a => a.id);

        const _tasks = state.tasks.map(t => modifiedActIds.includes(t.activityId) && t.status === 'in_progress' ? { ...t, status: newStatus, statusUpdatedAt: ts } : t);
        updates.tasks = _tasks as Task[];
    }
    else if (level === 'project') {
        const _objectives = state.objectives.map(o => o.projectId === id && o.status === 'in_progress' ? { ...o, status: newStatus, statusUpdatedAt: ts } : o);
        updates.objectives = _objectives as Objective[];
        const modifiedObjIds = updates.objectives.filter(o => o.projectId === id && state.objectives.find(oldO => oldO.id === o.id)?.status === 'in_progress').map(o => o.id);

        const _activities = state.activities.map(a => modifiedObjIds.includes(a.objectiveId) && a.status === 'in_progress' ? { ...a, status: newStatus, statusUpdatedAt: ts } : a);
        updates.activities = _activities as Activity[];
        const modifiedActIds = updates.activities.filter(a => modifiedObjIds.includes(a.objectiveId) && state.activities.find(oldA => oldA.id === a.id)?.status === 'in_progress').map(a => a.id);

        const _tasks = state.tasks.map(t => modifiedActIds.includes(t.activityId) && t.status === 'in_progress' ? { ...t, status: newStatus, statusUpdatedAt: ts } : t);
        updates.tasks = _tasks as Task[];
    }
    else if (level === 'objective') {
        const _activities = state.activities.map(a => a.objectiveId === id && a.status === 'in_progress' ? { ...a, status: newStatus, statusUpdatedAt: ts } : a);
        updates.activities = _activities as Activity[];
        const modifiedActIds = updates.activities.filter(a => a.objectiveId === id && state.activities.find(oldA => oldA.id === a.id)?.status === 'in_progress').map(a => a.id);

        const _tasks = state.tasks.map(t => modifiedActIds.includes(t.activityId) && t.status === 'in_progress' ? { ...t, status: newStatus, statusUpdatedAt: ts } : t);
        updates.tasks = _tasks as Task[];
    }
    else if (level === 'activity') {
        const _tasks = state.tasks.map(t => t.activityId === id && t.status === 'in_progress' ? { ...t, status: newStatus, statusUpdatedAt: ts } : t);
        updates.tasks = _tasks as Task[];
    }

    return updates;
};

// Validaciones de activación hacia arriba ("No se puede activar si su padre no está activo")
const canActivate = (state: AppState, level: 'project' | 'objective' | 'activity' | 'task', parentId: string): boolean => {
    if (level === 'project') return state.goals.some(g => g.id === parentId && g.status === 'in_progress');
    if (level === 'objective') return state.projects.some(p => p.id === parentId && p.status === 'in_progress');
    if (level === 'activity') return state.objectives.some(o => o.id === parentId && o.status === 'in_progress');
    if (level === 'task') return state.activities.some(a => a.id === parentId && a.status === 'in_progress');
    return true;
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            goals: [],
            projects: [],
            objectives: [],
            activities: [],
            tasks: [],
            workSessions: [],
            dailySettings: {
                sleepMinutes: 480, // 8h
                fixedRoutineMinutes: 120, // 2h meals, hygiene, etc.
            },

            updateDailySettings: (settings) => set(state => ({
                dailySettings: { ...state.dailySettings, ...settings }
            })),

            addGoal: (goalData) => set((state) => {
                let finalStatus = goalData.status;
                if (finalStatus === 'in_progress') {
                    const activeCount = state.goals.filter(g => g.status === 'in_progress').length;
                    if (activeCount >= 3) {
                        alert('Límite estricto 1440: Sólo 3 metas activas. Se ha guardado en el Banco (Pendiente).');
                        finalStatus = 'pending';
                    }
                }
                const newGoal: Goal = {
                    ...goalData,
                    status: finalStatus,
                    statusUpdatedAt: now(),
                    id: generateId(),
                    createdAt: now()
                };
                return { goals: [...state.goals, newGoal] };
            }),

            updateGoal: (id, updates) => set((state) => {
                const currentGoal = state.goals.find(g => g.id === id);
                let safeUpdates = { ...updates };

                if (safeUpdates.status === 'in_progress') {
                    const activeCount = state.goals.filter(g => g.status === 'in_progress' && g.id !== id).length;
                    if (activeCount >= 3) {
                        alert('Límite estricto 1440: Sólo 3 metas activas permitidas simultáneamente.');
                        safeUpdates.status = 'pending';
                    }
                }

                if (safeUpdates.status && currentGoal?.status !== safeUpdates.status) {
                    safeUpdates.statusUpdatedAt = now();
                }

                const newState = {
                    goals: state.goals.map((g) => (g.id === id ? { ...g, ...safeUpdates } : g)),
                };

                // Propagar hacia abajo si se pausa/manda al banco
                if (safeUpdates.status && safeUpdates.status !== 'in_progress' && currentGoal?.status === 'in_progress') {
                    const cascadedUpdates = propagateStatusDown({ ...state, ...newState }, 'goal', id, safeUpdates.status);
                    return { ...newState, ...cascadedUpdates };
                }

                return newState;
            }),

            deleteGoal: (id) => set((state) => {
                const projectIds = state.projects.filter(p => p.goalId === id).map(p => p.id);
                const objectiveIds = state.objectives.filter(o => projectIds.includes(o.projectId)).map(o => o.id);
                const activityIds = state.activities.filter(a => objectiveIds.includes(a.objectiveId)).map(a => a.id);

                return {
                    goals: state.goals.filter((g) => g.id !== id),
                    projects: state.projects.filter((p) => p.goalId !== id),
                    objectives: state.objectives.filter(o => !projectIds.includes(o.projectId)),
                    activities: state.activities.filter(a => !objectiveIds.includes(a.objectiveId)),
                    tasks: state.tasks.filter(t => !activityIds.includes(t.activityId)),
                };
            }),

            addProject: (data) => set((state) => {
                let finalStatus = data.status;
                if (finalStatus === 'in_progress') {
                    if (!canActivate(state, 'project', data.goalId)) {
                        alert('La Meta padre no está activa. Guardado en Banco de Proyectos (Pendiente).');
                        finalStatus = 'pending';
                    } else {
                        const activeCount = state.projects.filter(p => p.status === 'in_progress').length;
                        if (activeCount >= 3) {
                            alert('Límite estricto 1440: Sólo 3 proyectos activos en total. Guardado en Banco.');
                            finalStatus = 'pending';
                        }
                    }
                }
                return {
                    projects: [...state.projects, { ...data, status: finalStatus, statusUpdatedAt: now(), id: generateId(), createdAt: now() }]
                };
            }),

            updateProject: (id, updates) => set((state) => {
                const currentEntity = state.projects.find(e => e.id === id);
                if (!currentEntity) return state;
                let safeUpdates = { ...updates };

                if (safeUpdates.status === 'in_progress') {
                    if (!canActivate(state, 'project', currentEntity.goalId)) {
                        alert('No se puede activar el proyecto si su Meta padre no está en progreso.');
                        return state; // REJECT
                    }
                    const activeCount = state.projects.filter(p => p.status === 'in_progress' && p.id !== id).length;
                    if (activeCount >= 3) {
                        alert('Límite estricto 1440: Sólo 3 proyectos activos permitidos simultáneamente.');
                        safeUpdates.status = 'pending';
                    }
                }

                if (safeUpdates.status && currentEntity.status !== safeUpdates.status) {
                    safeUpdates.statusUpdatedAt = now();
                }

                const newState = {
                    projects: state.projects.map((p) => (p.id === id ? { ...p, ...safeUpdates } : p)),
                };

                if (safeUpdates.status && safeUpdates.status !== 'in_progress' && currentEntity.status === 'in_progress') {
                    const cascadedUpdates = propagateStatusDown({ ...state, ...newState }, 'project', id, safeUpdates.status);
                    return { ...newState, ...cascadedUpdates };
                }

                return newState;
            }),

            deleteProject: (id) => set((state) => {
                const objectiveIds = state.objectives.filter(o => o.projectId === id).map(o => o.id);
                const activityIds = state.activities.filter(a => objectiveIds.includes(a.objectiveId)).map(a => a.id);

                return {
                    projects: state.projects.filter((p) => p.id !== id),
                    objectives: state.objectives.filter((o) => o.projectId !== id),
                    activities: state.activities.filter(a => !objectiveIds.includes(a.objectiveId)),
                    tasks: state.tasks.filter(t => !activityIds.includes(t.activityId)),
                };
            }),

            addObjective: (data) => set((state) => {
                let finalStatus = data.status;
                if (finalStatus === 'in_progress') {
                    if (!canActivate(state, 'objective', data.projectId)) {
                        alert('El Proyecto padre no está activo. Guardado en Banco de Objetivos.');
                        finalStatus = 'pending';
                    } else {
                        const activeCount = state.objectives.filter(o => o.status === 'in_progress').length;
                        if (activeCount >= 6) { // Max 6 obj globally
                            alert('Límite estricto 1440: Sólo 6 objetivos activos en total. Guardado en Banco.');
                            finalStatus = 'pending';
                        }
                    }
                }
                return {
                    objectives: [...state.objectives, { ...data, status: finalStatus, statusUpdatedAt: now(), id: generateId(), createdAt: now() }]
                };
            }),

            updateObjective: (id, updates) => set((state) => {
                const currentEntity = state.objectives.find(e => e.id === id);
                if (!currentEntity) return state;
                let safeUpdates = { ...updates };

                if (safeUpdates.status === 'in_progress') {
                    if (!canActivate(state, 'objective', currentEntity.projectId)) {
                        alert('No se puede activar el objetivo si su Proyecto padre no está en progreso.');
                        return state; // REJECT
                    }
                    const activeCount = state.objectives.filter(o => o.status === 'in_progress' && o.id !== id).length;
                    if (activeCount >= 6) {
                        alert('Límite estricto 1440: Sólo 6 objetivos activos permitidos simultáneamente.');
                        safeUpdates.status = 'pending';
                    }
                }

                if (safeUpdates.status && currentEntity.status !== safeUpdates.status) {
                    safeUpdates.statusUpdatedAt = now();
                }

                const newState = {
                    objectives: state.objectives.map((o) => (o.id === id ? { ...o, ...safeUpdates } : o)),
                };

                if (safeUpdates.status && safeUpdates.status !== 'in_progress' && currentEntity.status === 'in_progress') {
                    const cascadedUpdates = propagateStatusDown({ ...state, ...newState }, 'objective', id, safeUpdates.status);
                    return { ...newState, ...cascadedUpdates };
                }

                return newState;
            }),

            deleteObjective: (id) => set((state) => {
                const activityIds = state.activities.filter(a => a.objectiveId === id).map(a => a.id);
                return {
                    objectives: state.objectives.filter((o) => o.id !== id),
                    activities: state.activities.filter((a) => a.objectiveId !== id),
                    tasks: state.tasks.filter(t => !activityIds.includes(t.activityId)),
                };
            }),

            addActivity: (data) => set((state) => {
                let finalStatus = data.status;
                if (finalStatus === 'in_progress') {
                    if (!canActivate(state, 'activity', data.objectiveId)) {
                        alert('El Objetivo padre no está activo. Guardado en Banco de Actividades.');
                        finalStatus = 'pending';
                    } else {
                        const activeCount = state.activities.filter(a => a.status === 'in_progress').length;
                        if (activeCount >= 12) { // Max 12 globally
                            alert('Límite estricto 1440: Sólo 12 actividades activas en total. Guardado en Banco.');
                            finalStatus = 'pending';
                        }
                    }
                }
                return {
                    activities: [...state.activities, { ...data, status: finalStatus, statusUpdatedAt: now(), id: generateId(), createdAt: now() }]
                }
            }),

            updateActivity: (id, updates) => set((state) => {
                const currentEntity = state.activities.find(e => e.id === id);
                if (!currentEntity) return state;
                let safeUpdates = { ...updates };

                if (safeUpdates.status === 'in_progress') {
                    if (!canActivate(state, 'activity', currentEntity.objectiveId)) {
                        alert('No se puede activar la actividad si su Objetivo padre no está en progreso.');
                        return state; // REJECT
                    }
                    const activeCount = state.activities.filter(a => a.status === 'in_progress' && a.id !== id).length;
                    if (activeCount >= 12) {
                        alert('Límite estricto 1440: Sólo 12 actividades activas permitidas simultáneamente.');
                        safeUpdates.status = 'pending';
                    }
                }

                if (safeUpdates.status && currentEntity.status !== safeUpdates.status) {
                    safeUpdates.statusUpdatedAt = now();
                }

                const newState = {
                    activities: state.activities.map((a) => (a.id === id ? { ...a, ...safeUpdates } : a)),
                };

                if (safeUpdates.status && safeUpdates.status !== 'in_progress' && currentEntity.status === 'in_progress') {
                    const cascadedUpdates = propagateStatusDown({ ...state, ...newState }, 'activity', id, safeUpdates.status);
                    return { ...newState, ...cascadedUpdates };
                }

                return newState;
            }),

            deleteActivity: (id) => set((state) => ({
                activities: state.activities.filter((a) => a.id !== id),
                tasks: state.tasks.filter((t) => t.activityId !== id),
            })),

            addTask: (data) => set((state) => {
                let finalStatus = data.status;
                if (finalStatus === 'in_progress') {
                    if (!canActivate(state, 'task', data.activityId)) {
                        alert('La Actividad padre no está activa. Guardado Plan de Acción en estado Pendiente.');
                        finalStatus = 'pending';
                    } else {
                        const activeCount = state.tasks.filter(t => t.status === 'in_progress').length;
                        if (activeCount >= 15) {
                            alert('Límite 1440: Sólo 15 Tareas/Planes de acción en progreso. Relega algo al banco primero.');
                            finalStatus = 'pending';
                        }
                    }
                }
                return {
                    tasks: [...state.tasks, { ...data, status: finalStatus, statusUpdatedAt: now(), id: generateId(), createdAt: now() }]
                }
            }),

            updateTask: (id, updates) => set((state) => {
                const currentEntity = state.tasks.find(e => e.id === id);
                if (!currentEntity) return state;
                let safeUpdates = { ...updates };

                if (safeUpdates.status === 'in_progress') {
                    if (!canActivate(state, 'task', currentEntity.activityId)) {
                        alert('No se puede poner en progreso si la Actividad padre no está activa.');
                        return state; // REJECT
                    }
                    const activeCount = state.tasks.filter(t => t.status === 'in_progress' && t.id !== id).length;
                    if (activeCount >= 15) {
                        alert('Límite estricto 1440: Sólo 15 Tareas en progreso. Trata de limitar tu working en batch.');
                        safeUpdates.status = 'pending';
                    }
                }

                if (safeUpdates.status && currentEntity.status !== safeUpdates.status) {
                    safeUpdates.statusUpdatedAt = now();
                }

                return {
                    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...safeUpdates } : t)),
                };
            }),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),

            addWorkSession: (data) => set((state) => ({
                workSessions: [...state.workSessions, { ...data, id: generateId() }]
            })),

            updateWorkSession: (id, updates) => set((state) => ({
                workSessions: state.workSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
            })),

            deleteWorkSession: (id) => set((state) => ({
                workSessions: state.workSessions.filter((s) => s.id !== id),
            })),
        }),
        {
            name: '1440-storage',
        }
    )
);
