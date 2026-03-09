import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Archive, Play, Pause, Target, Crosshair, CheckCircle, LayoutDashboard } from 'lucide-react';

export const BankView = () => {
    const { goals, projects, objectives, activities, updateGoal, updateProject, updateObjective, updateActivity } = useAppStore();

    // Collect all inactive items
    const inactiveGoals = goals.filter(g => ['paused', 'pending', 'archived'].includes(g.status));
    const inactiveProjects = projects.filter(p => ['paused', 'pending', 'archived'].includes(p.status));
    const inactiveObjectives = objectives.filter(o => ['paused', 'pending', 'archived'].includes(o.status));
    const inactiveActivities = activities.filter(a => ['paused', 'pending', 'archived'].includes(a.status));

    const handleReactivate = (type: 'goal' | 'project' | 'objective' | 'activity', id: string) => {
        // En un MVP, solo lo pasamos a in_progress. 
        // Idealmente, aquí se verificarían las reglas de límite (ej: max 3 objetivos activos).
        // Se puede hacer mostrando una alerta si el límite se excede (pendiente para refinar en useAppStore).
        switch (type) {
            case 'goal':
                updateGoal(id, { status: 'in_progress' });
                break;
            case 'project':
                updateProject(id, { status: 'in_progress' });
                break;
            case 'objective':
                updateObjective(id, { status: 'in_progress' });
                break;
            case 'activity':
                updateActivity(id, { status: 'in_progress' });
                break;
        }
    };

    const statusColors: any = {
        pending: 'text-slate-400',
        paused: 'text-amber-400',
        archived: 'text-slate-600',
    };

    const statusLabels: any = {
        pending: 'Pendiente',
        paused: 'Pausado',
        archived: 'Archivado'
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                        El Banco
                    </h1>
                    <p className="text-slate-400 mt-2">Tus iniciativas pausadas o futuras. Reactiva cuando tengas enfoque disponible.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Metas y Proyectos */}
                <div className="space-y-8">
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                            <Target className="w-5 h-5 text-indigo-400" />
                            Metas en Reserva ({inactiveGoals.length})
                        </h2>
                        <div className="space-y-3">
                            {inactiveGoals.length === 0 && <p className="text-sm text-slate-500 italic">No hay metas en reserva.</p>}
                            {inactiveGoals.map(goal => (
                                <div key={goal.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-200">{goal.title}</p>
                                        <p className={`text-xs mt-1 font-bold ${statusColors[goal.status]}`}>{statusLabels[goal.status]}</p>
                                    </div>
                                    <button onClick={() => handleReactivate('goal', goal.id)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors" title="Reactivar">
                                        <Play className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                            <Crosshair className="w-5 h-5 text-indigo-400" />
                            Proyectos en Reserva ({inactiveProjects.length})
                        </h2>
                        <div className="space-y-3">
                            {inactiveProjects.length === 0 && <p className="text-sm text-slate-500 italic">No hay proyectos en reserva.</p>}
                            {inactiveProjects.map(project => (
                                <div key={project.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-200">{project.title}</p>
                                        <p className={`text-xs mt-1 font-bold ${statusColors[project.status]}`}>{statusLabels[project.status]}</p>
                                    </div>
                                    <button onClick={() => handleReactivate('project', project.id)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors" title="Reactivar">
                                        <Play className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Objetivos y Actividades */}
                <div className="space-y-8">
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                            <CheckCircle className="w-5 h-5 text-purple-400" />
                            Objetivos en Reserva ({inactiveObjectives.length})
                        </h2>
                        <div className="space-y-3">
                            {inactiveObjectives.length === 0 && <p className="text-sm text-slate-500 italic">No hay objetivos en reserva.</p>}
                            {inactiveObjectives.map(objective => (
                                <div key={objective.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-200">{objective.title}</p>
                                        <p className={`text-xs mt-1 font-bold ${statusColors[objective.status]}`}>{statusLabels[objective.status]}</p>
                                    </div>
                                    <button onClick={() => handleReactivate('objective', objective.id)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors" title="Reactivar">
                                        <Play className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                            <LayoutDashboard className="w-5 h-5 text-purple-400" />
                            Actividades en Reserva ({inactiveActivities.length})
                        </h2>
                        <div className="space-y-3">
                            {inactiveActivities.length === 0 && <p className="text-sm text-slate-500 italic">No hay actividades en reserva.</p>}
                            {inactiveActivities.map(activity => (
                                <div key={activity.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-200">{activity.title}</p>
                                        <p className={`text-xs mt-1 font-bold ${statusColors[activity.status]}`}>{statusLabels[activity.status]}</p>
                                    </div>
                                    <button onClick={() => handleReactivate('activity', activity.id)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors" title="Reactivar">
                                        <Play className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
