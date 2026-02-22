import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Bot, MessageSquare, Calendar,
    Link, Settings, LogOut, ShieldCheck, BrainCircuit,
    ChevronLeft, ChevronRight
} from 'lucide-react';

/* ── Sidebar item ── */
const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
    <NavLink
        to={to}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden
       ${isActive
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`
        }
    >
        <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />

        {/* label — fades + collapses horizontally */}
        <span
            className={`font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
                }`}
        >
            {label}
        </span>

        {/* tooltip when collapsed */}
        {collapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-xl">
                {label}
            </span>
        )}
    </NavLink>
);

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 overflow-hidden relative">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <aside
                className={`relative z-10 hidden md:flex flex-col h-full glass border-r border-slate-800/50 p-3 transition-all duration-300 ease-in-out ${collapsed ? 'w-[64px]' : 'w-64'
                    }`}
            >
                {/* Logo / Brand */}
                <div className={`flex items-center mb-8 mt-2 overflow-hidden ${collapsed ? 'justify-center px-0' : 'gap-3 px-1'}`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
                        <Bot className="text-white" size={22} />
                    </div>
                    <h1 className={`text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                        }`}>
                        Deviaty Hub
                    </h1>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Centro de control" collapsed={collapsed} />
                    <SidebarItem to="/agents" icon={Bot} label="Agentes" collapsed={collapsed} />
                    <SidebarItem to="/intelligence" icon={BrainCircuit} label="Inteligencia" collapsed={collapsed} />
                    <SidebarItem to="/conversations" icon={MessageSquare} label="Conversaciones" collapsed={collapsed} />
                    <SidebarItem to="/calendar" icon={Calendar} label="Agenda del Agente" collapsed={collapsed} />
                    <SidebarItem to="/security" icon={ShieldCheck} label="Seguridad y Registro" collapsed={collapsed} />
                    <SidebarItem to="/integrations" icon={Link} label="Integraciones" collapsed={collapsed} />
                </nav>

                {/* Bottom */}
                <div className="mt-auto space-y-1 pt-3 border-t border-slate-800/50">
                    <SidebarItem to="/settings" icon={Settings} label="Configuración" collapsed={collapsed} />
                    <button
                        title={collapsed ? 'Cerrar Sesión' : undefined}
                        className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group overflow-hidden ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'}`}>
                            Cerrar Sesión
                        </span>
                        {collapsed && (
                            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-xl">
                                Cerrar Sesión
                            </span>
                        )}
                    </button>
                </div>

                {/* Toggle button — sits on the right edge */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-cyan-500/40 transition-all duration-200 shadow-lg z-20"
                    title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                >
                    {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 z-10 overflow-y-auto relative">
                <div className="p-8 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
