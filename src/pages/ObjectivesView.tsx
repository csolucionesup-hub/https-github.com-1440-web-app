import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CreateObjectiveModal } from '../components/objectives/CreateObjectiveModal';
import { ObjectiveCard } from '../components/objectives/ObjectiveCard';
import { Objective } from '../types';
import { Plus, Target, Crosshair } from 'lucide-react';

export const ObjectivesView = () => {
    const { goals, projects, objectives } = useAppStore();
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const availableProjects = projects.filter(p => p.goalId === selectedGoalId);

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

    const activeProject = projects.find(p => p.id === selectedProjectId);
    const relatedObjectives = objectives.filter(o => o.projectId === selectedProjectId);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Objetivos</h1>
                    <p className="text-slate-400 mt-2">Los pilares que sostienen tus proyectos.</p>
                </div>
                {selectedProjectId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Objetivo
                    </button>
                )}
            </header>

            {/* Level 1: Goal Selector */}
            <section className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">1. Selecciona una Meta Activa</h3>
                {activeGoals.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {activeGoals.map(goal => (
                            <button
                                key={goal.id}
                                onClick={() => setSelectedGoalId(goal.id)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${selectedGoalId === goal.id
                                    ? 'bg-sky-500/20 text-white border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                                    : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-300'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
                                {goal.title}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="glass rounded-xl p-4 text-center text-slate-400 border border-amber-500/20 bg-amber-500/5">
                        <p className="text-amber-400 text-sm font-medium">No tienes metas activas para filtrar.</p>
                    </div>
                )}
            </section>

            {/* Level 2: Project Selector */}
            {selectedGoalId && (
                <section className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">2. Selecciona un Proyecto</h3>
                    {availableProjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {availableProjects.map(proj => (
                                <button
                                    key={proj.id}
                                    onClick={() => setSelectedProjectId(proj.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${selectedProjectId === proj.id
                                        ? 'bg-indigo-500/30 text-white border-indigo-500/50'
                                        : 'bg-slate-800/30 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-300'
                                        }`}
                                >
                                    <Target className={`w-4 h-4 ${selectedProjectId === proj.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    {proj.title}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-xl p-4 text-slate-400 border border-white/5">
                            <p className="text-sm">Esta meta no tiene proyectos todavía. Crea uno en la pestaña Proyectos.</p>
                        </div>
                    )}
                </section>
            )}

            {/* Level 3: Objectives Area */}
            {activeProject && (
                <div className="pt-4 border-t border-white/5 mt-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Crosshair className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white">
                            Objetivos del proyecto: <span className="text-indigo-400">{activeProject.title}</span>
                        </h2>
                    </div>

                    {relatedObjectives.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-slate-700/50">
                            <Crosshair className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium text-lg mb-2">No hay objetivos en este proyecto.</p>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Crea objetivos para definir los hitos necesarios que completarán tu proyecto.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                            >
                                + Crear el primer objetivo
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedObjectives.map(obj => (
                                <ObjectiveCard key={obj.id} objective={obj} onEdit={() => setEditingObjective(obj)} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CreateObjectiveModal
                isOpen={isModalOpen || !!editingObjective}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingObjective(null);
                }}
                projectId={editingObjective?.projectId || selectedProjectId || ''}
                objectiveToEdit={editingObjective || undefined}
            />
        </div>
    );
};
