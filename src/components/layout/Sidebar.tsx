import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, CheckCircle, Crosshair, Settings, Clock, Archive } from 'lucide-react';

const navItems = [
    { path: '/', icon: Clock, label: '1440 Minutos' },
    { path: '/goals', icon: Target, label: 'Metas' },
    { path: '/projects', icon: Crosshair, label: 'Proyectos' },
    { path: '/objectives', icon: CheckCircle, label: 'Objetivos' },
    { path: '/activities', icon: LayoutDashboard, label: 'Actividades' },
    { path: '/tasks', icon: CheckCircle, label: 'Plan de Acción' },
    { path: '/bank', icon: Archive, label: 'El Banco' },
    { path: '/settings', icon: Settings, label: 'Ajustes' },
];

export const Sidebar = () => {
    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-white/5 flex flex-col pt-8 pb-4">
            <div className="px-6 mb-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <Clock className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">1440</h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Ecosistema</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-6 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-b from-sky-500/10 to-transparent border border-sky-500/20">
                    <p className="text-xs text-sky-400 font-semibold mb-1">Estado del día</p>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-sky-400 h-full w-[45%]" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">648 mins restantes</p>
                </div>
            </div>
        </aside>
    );
};
