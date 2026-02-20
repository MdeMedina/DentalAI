import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Bot, MessageSquare, Calendar, Link, Settings, LogOut, Users } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
       ${isActive
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`
        }
    >
        <Icon size={20} className="transition-transform group-hover:scale-110" />
        <span className="font-medium tracking-wide">{label}</span>
    </NavLink>
);

const Layout = () => {
    return (
        <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 overflow-hidden relative">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <aside className="w-64 z-10 hidden md:flex flex-col h-full glass border-r border-slate-800/50 p-4">
                <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                        <Bot className="text-white" size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Deviaty Hub
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Centro de control" />
                    <SidebarItem to="/agents" icon={Bot} label="Agentes" />
                    <SidebarItem to="/conversations" icon={MessageSquare} label="Conversaciones" />
                    <SidebarItem to="/calendar" icon={Calendar} label="Calendario" />
                    <SidebarItem to="/patients" icon={Users} label="CRM y Pacientes" />
                    <SidebarItem to="/integrations" icon={Link} label="Integraciones" />
                </nav>

                <div className="mt-auto space-y-2 pt-4 border-t border-slate-800/50">
                    <SidebarItem to="/settings" icon={Settings} label="Configuración" />
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
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
