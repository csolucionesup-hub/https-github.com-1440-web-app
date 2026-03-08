import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Clock, CheckCircle } from 'lucide-react';

export const Daily1440View = () => {
    const { tasks, timeBlocks, addTimeBlock, updateTimeBlock, deleteTask } = useAppStore();
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    // Time grid generation (simplified 1440 mins representation for MVP)
    // Let's create blocks of 1 hour (60 mins) for visual simplicity, 24 slots.
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
        setDraggedTaskId(taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, hour: number) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            addTimeBlock({
                startTime: `${hour.toString().padStart(2, '0')}:00`,
                duration: 60,
                taskId: task.id,
                label: task.title,
                color: '#0ea5e9' // sky-500
            });
        }
        setDraggedTaskId(null);
    };

    const pendingTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'completed_early');

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">
                        Tu Día en 1440 Minutos
                    </h1>
                    <p className="text-slate-400 mt-2">Vincúla tu plan de acción a bloques reales de tiempo. Arrastra y suelta.</p>
                </div>
                <div className="glass px-6 py-3 rounded-xl border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.15)] flex items-center gap-3">
                    <Clock className="text-sky-400 w-5 h-5 animate-pulse" />
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Restantes hoy</p>
                        <p className="text-xl font-bold text-white font-heading">648 mins</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

                {/* Tareas Disponibles (Draggable) */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <CheckCircle className="text-sky-400 w-5 h-5" />
                        Tareas Pendientes
                    </h2>
                    <div className="glass rounded-2xl p-4 border border-white/5 max-h-[600px] overflow-y-auto space-y-3">
                        {pendingTasks.length === 0 ? (
                            <p className="text-slate-500 text-sm italic text-center py-4">No hay tareas pendientes en tu Plan de Acción.</p>
                        ) : (
                            pendingTasks.map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onDragEnd={() => setDraggedTaskId(null)}
                                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-3 cursor-grab hover:border-sky-500/50 hover:bg-sky-500/5 transition-all w-full text-left active:cursor-grabbing ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                                >
                                    <p className="font-medium text-sm text-slate-200">{task.title}</p>
                                    <p className="text-xs text-sky-400 mt-1 capitalize">{task.period}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 1440 Timeline Widget */}
                <div className="lg:col-span-3 glass rounded-2xl p-6 border border-sky-500/10 relative overflow-hidden">
                    <h2 className="font-semibold text-lg mb-6">Bloques de Tiempo Reales</h2>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {hours.map(hour => {
                            // Find blocks starting at this hour
                            const hourString = `${hour.toString().padStart(2, '0')}:00`;
                            const blocksInHour = timeBlocks.filter(b => b.startTime === hourString);

                            return (
                                <div
                                    key={hour}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, hour)}
                                    className={`flex gap-4 p-2 rounded-xl transition-colors min-h-[60px] border border-dashed ${blocksInHour.length > 0 ? 'border-transparent bg-white/[0.02]' : 'border-white/5 hover:border-sky-500/30 hover:bg-sky-500/5'}`}
                                >
                                    <div className="w-16 text-right pt-2 text-xs font-semibold text-slate-500">
                                        {hourString}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {blocksInHour.map(block => (
                                            <div
                                                key={block.id}
                                                className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-3 flex justify-between items-center group/block"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-sky-300">{block.label}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{block.duration} minutos invertidos</p>
                                                </div>
                                            </div>
                                        ))}
                                        {blocksInHour.length === 0 && (
                                            <div className="h-full flex items-center px-4 text-xs text-slate-600">
                                                Arrastra una tarea aquí
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
