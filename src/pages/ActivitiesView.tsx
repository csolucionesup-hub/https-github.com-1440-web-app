import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CreateActivityModal } from '../components/activities/CreateActivityModal';
import { ActivityCard } from '../components/activities/ActivityCard';
import { Activity } from '../types';
import { Plus, ListTodo, Target, Crosshair } from 'lucide-react';

export const ActivitiesView = () => {
    const { goals, projects, objectives, activities } = useAppStore();
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const availableProjects = projects.filter(p => p.goalId === selectedGoalId);
    const availableObjectives = objectives.filter(o => o.projectId === selectedProjectId);

    // Auto-select first active goal if none selected
    useEffect(() => {
        if (!selectedGoalId && activeGoals.length > 0) {
            setSelectedGoalId(activeGoals[0].id);
        }
    }, [activeGoals, selectedGoalId]);

    // Auto-select first project when goal changes
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

    // Auto-select first objective when project changes
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

    const activeObjective = objectives.find(o => o.id === selectedObjectiveId);
    const relatedActivities = activities.filter(a => a.objectiveId === selectedObjectiveId);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Actividades</h1>
                    <p className="text-slate-400 mt-2">Las acciones recurrentes y semanales que impulsan tus objetivos.</p>
                </div>
                {selectedObjectiveId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Actividad
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
            </div>

            {/* Level 4: Activities Area */}
            {activeObjective && (
                <div className="pt-2">
                    <div className="flex items-center gap-3 mb-6">
                        <ListTodo className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">
                            Actividades para: <span className="text-purple-400">{activeObjective.title}</span>
                        </h2>
                    </div>

                    {relatedActivities.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-slate-700/50">
                            <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium text-lg mb-2">No hay actividades en este objetivo.</p>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Crea actividades recurrentes que debas realizar para alcanzar este objetivo.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                            >
                                + Crear la primera actividad
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedActivities.map(act => (
                                <ActivityCard key={act.id} activity={act} onEdit={() => setEditingActivity(act)} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CreateActivityModal
                isOpen={isModalOpen || !!editingActivity}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                }}
                objectiveId={editingActivity?.objectiveId || selectedObjectiveId || ''}
                activityToEdit={editingActivity || undefined}
            />
        </div>
    );
};
