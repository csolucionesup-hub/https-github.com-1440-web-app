import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskCard } from '../components/tasks/TaskCard';
import { Task } from '../types';
import { Plus, Target, Crosshair, ListTodo } from 'lucide-react';

export const HierarchicalView = () => {
    const { goals, projects, objectives, activities, tasks } = useAppStore();

    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const availableProjects = projects.filter(p => p.goalId === selectedGoalId);
    const availableObjectives = objectives.filter(o => o.projectId === selectedProjectId);
    const availableActivities = activities.filter(a => a.objectiveId === selectedObjectiveId);

    // Auto-select first active goal
    useEffect(() => {
        if (!selectedGoalId && activeGoals.length > 0) {
            setSelectedGoalId(activeGoals[0].id);
        }
    }, [activeGoals, selectedGoalId]);

    // Auto-select first project
    useEffect(() => {
        if (selectedGoalId) {
            const relatedProjs = projects.filter(p => p.goalId === selectedGoalId);
            if (relatedProjs.length > 0 && (!selectedProjectId || !relatedProjs.find(p => p.id === selectedProjectId))) {
                setSelectedProjectId(relatedProjs[0].id);
            } else if (relatedProjs.length === 0) {
                setSelectedProjectId(null);
            }
        }
    }, [selectedGoalId, projects]);

    // Auto-select first objective
    useEffect(() => {
        if (selectedProjectId) {
            const relatedObjs = objectives.filter(o => o.projectId === selectedProjectId);
            if (relatedObjs.length > 0 && (!selectedObjectiveId || !relatedObjs.find(o => o.id === selectedObjectiveId))) {
                setSelectedObjectiveId(relatedObjs[0].id);
            } else if (relatedObjs.length === 0) {
                setSelectedObjectiveId(null);
            }
        } else {
            setSelectedObjectiveId(null);
        }
    }, [selectedProjectId, objectives]);

    // Auto-select first activity
    useEffect(() => {
        if (selectedObjectiveId) {
            const relatedActs = activities.filter(a => a.objectiveId === selectedObjectiveId);
            if (relatedActs.length > 0 && (!selectedActivityId || !relatedActs.find(a => a.id === selectedActivityId))) {
                setSelectedActivityId(relatedActs[0].id);
            } else if (relatedActs.length === 0) {
                setSelectedActivityId(null);
            }
        } else {
            setSelectedActivityId(null);
        }
    }, [selectedObjectiveId, activities]);

    const activeActivity = activities.find(a => a.id === selectedActivityId);
    const relatedTasks = tasks.filter(t => t.activityId === selectedActivityId);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Plan de Acción (Tareas)</h1>
                    <p className="text-slate-400 mt-2">La ejecución diaria y semanal de tus actividades.</p>
                </div>
                {selectedActivityId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Tarea
                    </button>
                )}
            </header>

            {/* Selectors Area */}
            <div className="glass rounded-xl p-5 border border-white/5 space-y-5 mb-8">
                {/* Level 1: Goal Selector */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Meta Activa</span>
                    </div>
                    {activeGoals.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {activeGoals.map(goal => (
                                <button
                                    key={goal.id}
                                    onClick={() => setSelectedGoalId(goal.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${selectedGoalId === goal.id
                                        ? 'bg-sky-500/20 text-white border-sky-500/50'
                                        : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: goal.color }} />
                                    {goal.title}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-amber-400">No hay metas activas.</p>
                    )}
                </div>

                {/* Level 2: Project Selector */}
                {selectedGoalId && (
                    <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Proyecto</span>
                        </div>
                        {availableProjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availableProjects.map(proj => (
                                    <button
                                        key={proj.id}
                                        onClick={() => setSelectedProjectId(proj.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${selectedProjectId === proj.id
                                            ? 'bg-indigo-500/30 text-white border-indigo-500/50'
                                            : 'bg-slate-800/30 text-slate-400 border-white/5 hover:bg-slate-800'
                                            }`}
                                    >
                                        <Target className={`w-3.5 h-3.5 ${selectedProjectId === proj.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                                        {proj.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">Esta meta no tiene proyectos.</p>
                        )}
                    </div>
                )}

                {/* Level 3: Objective Selector */}
                {selectedProjectId && (
                    <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Objetivo</span>
                        </div>
                        {availableObjectives.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availableObjectives.map(obj => (
                                    <button
                                        key={obj.id}
                                        onClick={() => setSelectedObjectiveId(obj.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${selectedObjectiveId === obj.id
                                            ? 'bg-purple-500/30 text-white border-purple-500/50'
                                            : 'bg-slate-800/30 text-slate-400 border-white/5 hover:bg-slate-800'
                                            }`}
                                    >
                                        <Crosshair className={`w-3.5 h-3.5 ${selectedObjectiveId === obj.id ? 'text-purple-400' : 'text-slate-500'}`} />
                                        {obj.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">Este proyecto no tiene objetivos.</p>
                        )}
                    </div>
                )}

                {/* Level 4: Activity Selector */}
                {selectedObjectiveId && (
                    <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Actividad</span>
                        </div>
                        {availableActivities.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availableActivities.map(act => (
                                    <button
                                        key={act.id}
                                        onClick={() => setSelectedActivityId(act.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${selectedActivityId === act.id
                                            ? 'bg-sky-500/30 text-white border-sky-500/50'
                                            : 'bg-slate-800/30 text-slate-400 border-white/5 hover:bg-slate-800'
                                            }`}
                                    >
                                        <ListTodo className={`w-3.5 h-3.5 ${selectedActivityId === act.id ? 'text-sky-400' : 'text-slate-500'}`} />
                                        {act.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">Este objetivo no tiene actividades.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Level 5: Tasks Area */}
            {activeActivity && (
                <div className="pt-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-500/20 rounded-xl">
                            <Target className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sky-400 text-sm font-medium mb-0.5">
                                <span>Actividad:</span>
                            </div>
                            <h2 className="text-xl font-bold text-white leading-tight">
                                {activeActivity.title}
                            </h2>
                        </div>
                    </div>

                    {relatedTasks.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-slate-700/50">
                            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium text-lg mb-2">No tienes tareas para esta actividad aún.</p>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Define pasos claros de ejecución. Agrega tareas diarias o semanales.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Crear mi primera tarea
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedTasks.map(task => (
                                <TaskCard key={task.id} task={task} onEdit={() => setEditingTask(task)} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CreateTaskModal
                isOpen={isModalOpen || !!editingTask}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }}
                activityId={editingTask?.activityId || selectedActivityId || ''}
                taskToEdit={editingTask || undefined}
            />
        </div>
    );
};
