import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GoalCard } from '../components/goals/GoalCard';
import { SmallGoalCard } from '../components/goals/SmallGoalCard';
import { CreateGoalModal } from '../components/goals/CreateGoalModal';
import { Goal } from '../types';
import { Plus } from 'lucide-react';

export const GoalsView = () => {
    const { goals } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    // Strict visual limit: Only show up to 3 active goals in the focus section.
    const allActiveGoals = goals.filter(g => g.status === 'in_progress');
    const activeGoals = allActiveGoals.slice(0, 3);

    // Any other goal (paused, pending, OR an active goal beyond the 3 limit) goes to the bank.
    const otherGoals = [
        ...allActiveGoals.slice(3), // The overflow active ones
        ...goals.filter(g => g.status !== 'in_progress')
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Tus Metas Principales</h1>
                    <p className="text-slate-400 mt-2">Mantén el enfoque. Máximo 3 metas activas permitidas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Meta
                </button>
            </header>

            {/* Progress or active goals warning */}
            <div className="flex gap-4 items-center bg-slate-900/40 p-4 rounded-xl border border-white/5">
                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${activeGoals.length === 3 ? 'bg-orange-500' : 'bg-sky-400'}`}
                        style={{ width: `${(activeGoals.length / 3) * 100}%` }}
                    />
                </div>
                <span className={`text-sm font-semibold ${activeGoals.length === 3 ? 'text-orange-400' : 'text-slate-300'}`}>
                    {activeGoals.length} de 3 activas
                </span>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    Enfoque Actual (Activas)
                </h2>
                {activeGoals.length === 0 ? (
                    <div className="glass rounded-xl p-8 text-center border-dashed border-2 border-slate-700/50">
                        <p className="text-slate-400 mb-4">No tienes metas en progreso en este momento.</p>
                        <button onClick={() => setIsModalOpen(true)} className="text-sky-400 hover:text-sky-300 font-medium">Crea una meta nueva</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeGoals.map(goal => (
                            <GoalCard key={goal.id} goal={goal} onEdit={() => setEditingGoal(goal)} />
                        ))}
                    </div>
                )}
            </section>

            <section className="pt-8 border-t border-white/5">
                <h2 className="text-xl font-semibold mb-6 text-slate-300">Banco de Metas (Pausadas, Terminadas, Futuras)</h2>
                {otherGoals.length === 0 ? (
                    <div className="glass rounded-xl p-8 text-center border-dashed border-2 border-slate-700/50">
                        <p className="text-slate-400">Tu banco de metas está vacío.</p>
                        <p className="text-sm text-slate-500 mt-2">Las metas que crees cuando hayas alcanzado el límite de 3 se guardarán aquí.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {otherGoals.map(goal => (
                            <SmallGoalCard key={goal.id} goal={goal} onEdit={() => setEditingGoal(goal)} />
                        ))}
                    </div>
                )}
            </section>

            <CreateGoalModal
                isOpen={isModalOpen || !!editingGoal}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingGoal(null);
                }}
                goalToEdit={editingGoal || undefined}
            />
        </div >
    );
};
