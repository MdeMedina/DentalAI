import React, { useState } from 'react';
import {
    ShieldCheck, AlertTriangle, Clock, User, History,
    Unlock, Lock, RefreshCw, CheckCircle2, Edit3,
    ChevronRight, Database, RotateCcw, Info, XCircle,
    AlertCircle, Eye, EyeOff
} from 'lucide-react';

/* ──────── shared ──────── */
const GlassCard = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.035] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ icon: Icon, iconColor = 'text-cyan-400', title, sub }) => (
    <div className="mb-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Icon size={16} className={iconColor} /> {title}
        </h2>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
);

const Tooltip = ({ text }) => (
    <div className="group relative inline-flex">
        <Info size={12} className="text-slate-600 hover:text-slate-400 cursor-help transition-colors ml-1" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-normal text-center">
            {text}
        </div>
    </div>
);

const SeverityBadge = ({ level }) => {
    const cfg = {
        info: { cls: 'bg-cyan-500/10   border-cyan-500/25   text-cyan-400', label: 'Informativo', dot: 'bg-cyan-400' },
        warn: { cls: 'bg-amber-500/10  border-amber-500/25  text-amber-400', label: 'Advertencia', dot: 'bg-amber-400 animate-pulse' },
        critical: { cls: 'bg-red-500/10    border-red-500/25    text-red-400', label: 'Crítico', dot: 'bg-red-400 animate-pulse' },
        ok: { cls: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', label: 'OK', dot: 'bg-emerald-400' },
    }[level] || {};
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

/* ──────── BLOQUE 2 — Activity Feed ──────── */
const activityFeed = [
    { id: 1, user: 'Dr. Medina', action: 'Modificó información clínica', time: '14:32 · Hoy', type: 'info', icon: Edit3 },
    { id: 2, user: 'Administrador', action: 'Publicó nueva versión del agente (v3)', time: '12:10 · Hoy', type: 'ok', icon: History },
    { id: 3, user: 'Agente de IA', action: 'Conversación derivada a humano', time: '11:47 · Hoy', type: 'warn', icon: ChevronRight },
    { id: 4, user: 'Sistema', action: 'Integración Dentalink reconectada', time: '10:05 · Hoy', type: 'ok', icon: RefreshCw },
    { id: 5, user: 'Sistema', action: 'Error temporal detectado y resuelto', time: '09:22 · Hoy', type: 'warn', icon: AlertTriangle },
    { id: 6, user: 'Recepcionista', action: 'Actualizó mensaje de bienvenida', time: '18:30 · Ayer', type: 'info', icon: Edit3 },
    { id: 7, user: 'Administrador', action: 'Modificó horario de funcionamiento', time: '09:15 · 18 Feb', type: 'info', icon: Clock },
];

const iconColor = { info: 'text-cyan-400', warn: 'text-amber-400', ok: 'text-emerald-400', critical: 'text-red-400' };
const dotColor = { info: 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.7)]', warn: 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.7)]', ok: 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]', critical: 'bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.7)]' };

const ActivityFeed = () => (
    <div className="space-y-0 divide-y divide-slate-800/50">
        {activityFeed.map(ev => {
            const Icon = ev.icon;
            return (
                <div key={ev.id} className="flex items-start gap-4 py-3.5 group hover:bg-white/[0.015] px-2 rounded-lg transition-colors -mx-2">
                    <div className={`w-7 h-7 rounded-lg bg-slate-900/60 border border-slate-700/40 flex items-center justify-center shrink-0 mt-0.5 ${iconColor[ev.type]}`}>
                        <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium leading-snug">{ev.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{ev.user}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-600 whitespace-nowrap">{ev.time}</span>
                        <div className={`w-2 h-2 rounded-full ${dotColor[ev.type]}`} />
                    </div>
                </div>
            );
        })}
    </div>
);

/* ──────── BLOQUE 3 — Version history ──────── */
const versions = [
    { v: 'v3', date: '19 Feb 2026 · 12:10', user: 'Administrador', changes: 'Mensaje de bienvenida, nuevo tratamiento', current: true },
    { v: 'v2', date: '15 Feb 2026 · 10:05', user: 'Dr. Medina', changes: 'Ajuste de tono, política de cancelación', current: false },
    { v: 'v1', date: '10 Feb 2026 · 08:50', user: 'Administrador', changes: 'Configuración inicial', current: false },
];

const VersionHistory = () => {
    const [restoring, setRestoring] = useState(null);
    const [restored, setRestored] = useState(null);
    const [detailOpen, setDetailOpen] = useState(null);

    const restore = id => {
        setRestoring(id);
        setTimeout(() => { setRestoring(null); setRestored(id); setTimeout(() => setRestored(null), 3000); }, 1200);
    };

    return (
        <div className="space-y-3">
            {versions.map(v => (
                <div key={v.v} className={`rounded-xl border p-4 transition-all duration-300 ${v.current ? 'bg-cyan-500/5 border-cyan-500/25' : 'bg-slate-900/30 border-slate-700/30'}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{v.v}</span>
                            {v.current && <span className="text-xs bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">Actual</span>}
                            {restored === v.v && <span className="text-xs bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Restaurada</span>}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock size={10} /> {v.date}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><User size={10} /> {v.user}</p>

                    {detailOpen === v.v && (
                        <p className="text-xs text-slate-400 mt-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700/30" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                            {v.changes}
                        </p>
                    )}

                    <div className="flex gap-2 mt-3">
                        <button onClick={() => setDetailOpen(detailOpen === v.v ? null : v.v)} className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1">
                            <Eye size={11} /> {detailOpen === v.v ? 'Ocultar' : 'Ver detalles'}
                        </button>
                        {!v.current && (
                            <button onClick={() => restore(v.v)} disabled={!!restoring} className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                                <RotateCcw size={11} className={restoring === v.v ? 'animate-spin' : ''} />
                                {restoring === v.v ? 'Restaurando...' : 'Restaurar'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ──────── BLOQUE 4 — Users & Permissions ──────── */
const users = [
    { name: 'Dr. Medina', role: 'Administrador', last: 'Hoy · 14:32', status: 'active' },
    { name: 'Ana Reyes', role: 'Recepción', last: 'Hoy · 11:15', status: 'active' },
    { name: 'Carlos López', role: 'Supervisor', last: 'Ayer · 18:05', status: 'active' },
    { name: 'Laura Soto', role: 'Recepción', last: '15 Feb · 09:44', status: 'suspended' },
];

const roleStyle = {
    'Administrador': 'bg-violet-500/10 border-violet-500/25 text-violet-400',
    'Recepción': 'bg-slate-700/40  border-slate-600/30   text-slate-300',
    'Supervisor': 'bg-blue-500/10   border-blue-500/25    text-blue-400',
};

const UsersTable = () => {
    const [editing, setEditing] = useState(null);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-800">
                        {['Nombre', 'Rol', 'Último acceso', 'Estado', ''].map(h => (
                            <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4 last:pr-0">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {users.map((u, i) => (
                        <tr key={i} className="group hover:bg-white/[0.015] transition-colors">
                            <td className="py-3.5 pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-semibold text-slate-300 shrink-0">
                                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                    </div>
                                    <span className="font-medium text-white">{u.name}</span>
                                </div>
                            </td>
                            <td className="py-3.5 pr-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-xs font-medium ${roleStyle[u.role]}`}>{u.role}</span>
                            </td>
                            <td className="py-3.5 pr-4 text-xs text-slate-400 whitespace-nowrap">{u.last}</td>
                            <td className="py-3.5 pr-4">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                                    {u.status === 'active' ? 'Activo' : 'Suspendido'}
                                </span>
                            </td>
                            <td className="py-3.5 text-right">
                                <button
                                    onClick={() => setEditing(editing === i ? null : i)}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-auto"
                                >
                                    <Edit3 size={11} /> Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* ──────── BLOQUE 5 — Security events ──────── */
const secEvents = [
    { time: '14:45 · Hoy', level: 'ok', msg: 'Acceso exitoso — Dr. Medina desde dispositivo habitual' },
    { time: '13:02 · Hoy', level: 'warn', msg: 'Intento de acceso fallido — contraseña incorrecta (1/3)' },
    { time: '12:10 · Hoy', level: 'info', msg: 'Cambio de configuración — versión del agente actualizada a v3' },
    { time: '10:55 · Hoy', level: 'ok', msg: 'Agente activado por Administrador' },
    { time: '09:30 · Hoy', level: 'info', msg: 'Reconexión exitosa con sistema de integraciones' },
    { time: '08:00 · Hoy', level: 'warn', msg: 'Acceso desde dispositivo no reconocido — verificado manualmente' },
    { time: '22:14 · Ayer', level: 'critical', msg: 'Agente pausado de forma inesperada — restablecido automáticamente' },
];

const SecurityEvents = () => (
    <div className="space-y-0 divide-y divide-slate-800/50">
        {secEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-4 py-3 group hover:bg-white/[0.015] px-2 rounded-lg transition-colors -mx-2">
                <span className="text-xs text-slate-600 font-mono whitespace-nowrap w-28 shrink-0">{e.time}</span>
                <div className="shrink-0"><SeverityBadge level={e.level} /></div>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{e.msg}</p>
            </div>
        ))}
    </div>
);

/* ──────── BLOQUE 6 — Backup ──────── */
const BackupCard = () => {
    const [backing, setBacking] = useState(false);
    const [done, setDone] = useState(false);

    const run = () => {
        setBacking(true);
        setDone(false);
        setTimeout(() => { setBacking(false); setDone(true); setTimeout(() => setDone(false), 4000); }, 2200);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                        <Database size={15} className="text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Última copia de respaldo</p>
                        <p className="text-xs text-slate-500">19 Feb 2026 · 23:00 — automática</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Estado:</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                        Respaldo completo — sin errores
                    </span>
                </div>
                <p className="text-xs text-slate-600">Los respaldos automáticos se generan cada 24 horas.</p>
            </div>

            {done ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                    <CheckCircle2 size={15} /> Respaldo generado correctamente
                </div>
            ) : (
                <button
                    onClick={run}
                    disabled={backing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 shrink-0"
                >
                    <Database size={15} className={backing ? 'animate-pulse' : ''} />
                    {backing ? 'Generando respaldo...' : 'Generar Respaldo Manual'}
                </button>
            )}
        </div>
    );
};

/* ──────────────── MAIN ──────────────── */
const SecurityLog = () => {
    const hasAnomaly = false; // toggle to true to show warning state

    return (
        <div className="space-y-8">

            {/* BLOQUE 1 — Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Seguridad y Registro
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Trazabilidad y actividad del sistema</p>
                </div>

                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium shrink-0 transition-all duration-500 ${hasAnomaly
                        ? 'border-amber-500/30 bg-amber-500/8 text-amber-400'
                        : 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400'
                    }`}>
                    {hasAnomaly
                        ? <><AlertTriangle size={15} /> Actividad Inusual Detectada</>
                        : <><ShieldCheck size={15} /> Sistema Seguro</>}
                </div>
            </div>

            {/* BLOQUE 2 + 3 — Activity feed + Version history */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <GlassCard className="p-6 h-full">
                        <SectionTitle icon={Clock} title="Actividad Reciente" sub="Acciones registradas por usuarios y el sistema" />
                        <ActivityFeed />
                    </GlassCard>
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <GlassCard className="p-6 h-full">
                        <SectionTitle icon={History} iconColor="text-violet-400" title="Historial de Versiones" sub="Control de cambios del agente" />
                        <VersionHistory />
                    </GlassCard>
                </div>
            </div>

            {/* BLOQUE 4 — Users & Permissions */}
            <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-5">
                    <SectionTitle icon={User} iconColor="text-blue-400" title="Usuarios y Accesos" sub="Personas con acceso al sistema" />
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0">
                        <Edit3 size={12} /> Gestionar usuarios
                    </button>
                </div>
                <UsersTable />
            </GlassCard>

            {/* BLOQUE 5 — Security events */}
            <GlassCard className="p-6">
                <SectionTitle icon={Lock} iconColor="text-amber-400" title="Eventos de Seguridad" sub="Accesos, cambios sensibles y alertas del sistema" />
                <SecurityEvents />
            </GlassCard>

            {/* BLOQUE 6 — Backup */}
            <GlassCard className="p-6">
                <SectionTitle icon={Database} iconColor="text-emerald-400" title="Protección del Sistema" sub="Estado de respaldo y protección de datos" />
                <BackupCard />
            </GlassCard>

            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default SecurityLog;
