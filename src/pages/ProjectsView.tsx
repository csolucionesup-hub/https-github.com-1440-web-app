import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Project } from '../types';
import { Plus, Target } from 'lucide-react';

export const ProjectsView = () => {
    const { goals, projects } = useAppStore();
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const bankGoals = goals.filter(g => g.status !== 'in_progress');
    const bankGoalsWithProjects = bankGoals.filter(goal =>
        projects.some(p => p.goalId === goal.id)
    );

    // Auto-select first active goal if none selected
    useEffect(() => {
        if (!selectedGoalId && activeGoals.length > 0) {
            setSelectedGoalId(activeGoals[0].id);
        }
    }, [activeGoals, selectedGoalId]);

    const activeGoal = goals.find(g => g.id === selectedGoalId);
    const relatedProjects = projects.filter(p => p.goalId === selectedGoalId);
    const activeRelatedProjects = relatedProjects.filter(p => p.status === 'in_progress');
    const bankedRelatedProjects = relatedProjects.filter(p => p.status !== 'in_progress');

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Proyectos</h1>
                    <p className="text-slate-400 mt-2">Divide tus metas en proyectos a mediano o corto plazo (semestral, trimestral, mensual).</p>
                </div>
                {selectedGoalId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Proyecto
                    </button>
                )}
            </header>

            {/* Goal Selector */}
            {activeGoals.length > 0 ? (
                <div className="flex flex-wrap gap-3 pb-2">
                    {activeGoals.map(goal => (
                        <button
                            key={goal.id}
                            onClick={() => setSelectedGoalId(goal.id)}
                            className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 border ${selectedGoalId === goal.id
                                ? 'bg-sky-500/20 text-white border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                                : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-300'
                                }`}
                            title="Meta Activa"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: goal.color }}
                            />
                            {goal.title}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-xl p-8 text-center text-slate-400 border border-amber-500/20 bg-amber-500/5">
                    <p className="text-amber-400 font-semibold mb-2">No tienes metas creadas</p>
                    <p>Ve a la sección de Metas y crea al menos una meta para poder asignarle proyectos.</p>
                </div>
            )}

            {/* Projects Area */}
            {activeGoal && (
                <section className="pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
                        <div>
                            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-3">
                                Proyectos de <span style={{ color: activeGoal.color }}>{activeGoal.title}</span>
                            </h2>
                            <p className="text-slate-400 mt-1 text-sm">
                                {activeRelatedProjects.length} de 6 proyectos activos permitidos
                            </p>
                        </div>
                    </div>

                    {relatedProjects.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-slate-700/50">
                            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium text-lg mb-2">Aún no has definido proyectos para esta meta.</p>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto">Dividir las metas grandes en proyectos pequeños te ayuda a mantener la motivación y el rumbo claro.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                            >
                                + Crear el primer proyecto
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Active Projects */}
                            <div>
                                <h3 className="text-lg font-semibold text-sky-400 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                    Proyectos Activos
                                </h3>
                                {activeRelatedProjects.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic glass px-4 py-3 rounded-xl border border-white/5">
                                        No tienes proyectos activos en curso actualmente.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeRelatedProjects.map(proj => (
                                            <ProjectCard key={proj.id} project={proj} onEdit={() => setEditingProject(proj)} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Banked Projects for this specific Goal */}
                            {bankedRelatedProjects.length > 0 && (
                                <div className="pt-6 border-t border-slate-800/50">
                                    <h3 className="text-lg font-semibold text-slate-400 mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4 opacity-50" />
                                        Banco de Proyectos (De esta Meta)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-300">
                                        {bankedRelatedProjects.map(proj => (
                                            <ProjectCard key={proj.id} project={proj} onEdit={() => setEditingProject(proj)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Banco de Proyectos de Metas Inactivas */}
            {bankGoalsWithProjects.length > 0 && (
                <section className="pt-12 border-t border-white/5 mt-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-400">
                        <Target className="w-5 h-5" />
                        Banco de Proyectos (De Metas Inactivas)
                    </h2>
                    <div className="space-y-8">
                        {bankGoalsWithProjects.map(goal => (
                            <div key={goal.id} className="bg-slate-900/20 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
                                    {goal.title}
                                    <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-md">Meta Inactiva</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.filter(p => p.goalId === goal.id).map(proj => (
                                        <ProjectCard key={proj.id} project={proj} onEdit={() => setEditingProject(proj)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <CreateProjectModal
                isOpen={isModalOpen || !!editingProject}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                }}
                goalId={editingProject?.goalId || selectedGoalId || ''}
                projectToEdit={editingProject || undefined}
            />
        </div>
    );
};
