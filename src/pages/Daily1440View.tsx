import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getDailyTimeStats } from '../utils/timeCalculations';

export const Daily1440View = () => {
    const { activities, workSessions, addWorkSession, dailySettings } = useAppStore();
    const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);

    // Using today as the default date
    const today = new Date().toISOString().split('T')[0];
    const stats = getDailyTimeStats(today, dailySettings, workSessions);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const handleDragStart = (e: React.DragEvent, activityId: string) => {
        e.dataTransfer.setData('activityId', activityId);
        setDraggedActivityId(activityId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, hour: number) => {
        e.preventDefault();
        const activityId = e.dataTransfer.getData('activityId');
        const activity = activities.find(a => a.id === activityId);

        if (activity) {
            const requestedMinutes = activity.plannedMinutesPerSession || 60;
            // Validamos superposición y saturación
            if (stats.remainingActionable < requestedMinutes) {
                alert(`¡Alerta 1440! No tienes suficientes minutos libres hoy. Necesitas ${requestedMinutes}m pero solo quedan ${stats.remainingActionable}m.`);
                setDraggedActivityId(null);
                return;
            }

            addWorkSession({
                activityId: activity.id,
                date: today,
                startTime: `${hour.toString().padStart(2, '0')}:00`,
                plannedMinutes: requestedMinutes,
                actualMinutes: 0, // Inicia en 0 hasta completarla
                status: 'planned'
            });
        }
        setDraggedActivityId(null);
    };

    const actionableActivities = activities.filter(a => a.status === 'in_progress');

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Configuración Diaria 1440
                    </h1>
                    <p className="text-slate-400 mt-2">Asigna tus actividades clave a bloques de tiempo formales.</p>
                </div>
                <div className={`glass px-6 py-3 rounded-xl border shadow-lg flex items-center gap-4 ${stats.isSaturated ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]'}`}>
                    {stats.isSaturated ? (
                        <AlertTriangle className="text-red-400 w-6 h-6 animate-pulse" />
                    ) : (
                        <Clock className="text-purple-400 w-6 h-6 animate-pulse" />
                    )}
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Libres / Fijo</p>
                        <p className="text-xl font-bold text-white font-heading">{stats.remainingActionable} / {stats.fixed} <span className="text-sm text-slate-400 font-normal">mins</span></p>
                    </div>
                </div>
            </header>

            {stats.isSaturated && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm text-red-200">
                        <strong>¡Saturación Crítica!</strong> Has planeado más minutos de trabajo ({stats.plannedWork}m) de los que tienes disponibles hoy ({stats.available}m) después de dormir y rutinas fijas. Delega o pospón actividades.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                {/* Available Activities (Draggable) */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <CheckCircle className="text-purple-400 w-5 h-5" />
                        Actividades Activas
                    </h2>
                    <div className="glass rounded-2xl p-4 border border-white/5 max-h-[600px] overflow-y-auto space-y-3 custom-scrollbar">
                        {actionableActivities.length === 0 ? (
                            <p className="text-slate-500 text-sm italic text-center py-4">No hay actividades 'En Progreso' para agendar hoy.</p>
                        ) : (
                            actionableActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, activity.id)}
                                    onDragEnd={() => setDraggedActivityId(null)}
                                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-3 cursor-grab hover:border-purple-500/50 hover:bg-purple-500/5 transition-all w-full text-left active:cursor-grabbing ${draggedActivityId === activity.id ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-semibold text-sm text-slate-200">{activity.title}</p>
                                        <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">{activity.plannedMinutesPerSession || 60}m</span>
                                    </div>
                                    <p className="text-[10px] text-purple-400 uppercase tracking-wide font-bold">{activity.priority || 'media'}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 1440 Timeline Widget */}
                <div className="lg:col-span-3 glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <h2 className="font-semibold text-lg mb-6 flex items-center justify-between">
                        <span>Línea de Tiempo - Sesiones</span>
                        <span className="text-xs font-normal text-slate-400">Total Planeado Hoy: <strong className="text-white">{stats.plannedWork}m</strong></span>
                    </h2>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {hours.map(hour => {
                            const hourString = `${hour.toString().padStart(2, '0')}:00`;
                            const sessionsInHour = workSessions.filter(ws => ws.date === today && ws.startTime === hourString);

                            return (
                                <div
                                    key={hour}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, hour)}
                                    className={`flex gap-4 p-2 rounded-xl transition-all min-h-[60px] border border-dashed ${sessionsInHour.length > 0 ? 'border-transparent bg-white/[0.02]' : 'border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5'}`}
                                >
                                    <div className="w-16 text-right pt-2 text-xs font-semibold text-slate-500">
                                        {hourString}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {sessionsInHour.map(session => {
                                            const parentActivity = activities.find(a => a.id === session.activityId);
                                            return (
                                                <div
                                                    key={session.id}
                                                    className={`border rounded-lg p-3 flex flex-col justify-center relative overflow-hidden group/block ${session.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}
                                                >
                                                    <div className="flex justify-between items-center z-10 relative">
                                                        <p className={`text-sm font-semibold ${session.status === 'completed' ? 'text-emerald-300' : 'text-purple-300'}`}>
                                                            {parentActivity?.title || 'Actividad Desconocida'}
                                                        </p>
                                                        <span className="text-xs font-bold text-white/50">{session.plannedMinutes}m</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1 z-10 relative">
                                                        <p className="text-[10px] text-slate-400 capitalize">Estado: {session.status}</p>
                                                        {session.status === 'completed' && <span className="text-[10px] text-emerald-400 font-bold">Hecho: {session.actualMinutes}m</span>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {sessionsInHour.length === 0 && (
                                            <div className="h-full flex items-center px-4 text-xs font-medium text-slate-600 border border-transparent border-dashed group-hover:block transition-all ${draggedActivityId ? 'bg-white/5 border-white/10' : ''}">
                                                Arrastra una actividad aquí
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
