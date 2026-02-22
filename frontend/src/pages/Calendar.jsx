import React, { useState } from 'react';
import {
    ChevronLeft, ChevronRight, RefreshCw, Calendar,
    Clock, User, Bot, MessageSquare, RotateCcw,
    X, CheckCircle2, AlertCircle, Activity, ArrowRight
} from 'lucide-react';

/* ─────────────── CONSTANTS ─────────────── */
const TODAY = new Date(2026, 1, 22); // Feb 22 2026

const APPOINTMENT_STATUS = {
    confirmed: { label: 'Confirmada', dot: 'bg-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', bar: 'bg-emerald-500/80 border-l-2 border-emerald-400' },
    pending: { label: 'Pendiente', dot: 'bg-amber-400', badge: 'bg-amber-500/10   border-amber-500/25   text-amber-400', bar: 'bg-amber-500/70  border-l-2 border-amber-400' },
    rescheduled: { label: 'Reprogramada', dot: 'bg-blue-400', badge: 'bg-blue-500/10    border-blue-500/25    text-blue-400', bar: 'bg-blue-500/70   border-l-2 border-blue-400' },
    cancelled: { label: 'Cancelada', dot: 'bg-slate-500', badge: 'bg-slate-700/40   border-slate-600/30   text-slate-400', bar: 'bg-slate-700/50  border-l-2 border-slate-500' },
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 to 18

const APPOINTMENTS = [
    {
        id: 1, patient: 'María García', treatment: 'Limpieza dental',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 22, month: 1, year: 2026, hour: 9, duration: 1,
        status: 'confirmed',
        history: [
            { time: '20 Feb · 18:42', label: 'Cita creada por el Agente vía WhatsApp' },
            { time: '21 Feb · 09:00', label: 'Confirmación enviada al paciente' },
        ],
    },
    {
        id: 2, patient: 'Carlos Vega', treatment: 'Consulta urgente',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 22, month: 1, year: 2026, hour: 11, duration: 1,
        status: 'confirmed',
        history: [
            { time: '22 Feb · 10:05', label: 'Cita creada por el Agente — urgencia detectada' },
        ],
    },
    {
        id: 3, patient: 'Luis Morales', treatment: 'Revisión general',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 23, month: 1, year: 2026, hour: 10, duration: 1,
        status: 'pending',
        history: [
            { time: '22 Feb · 14:25', label: 'Cita creada por el Agente — pendiente de confirmar' },
        ],
    },
    {
        id: 4, patient: 'Ana Restrepo', treatment: 'Blanqueamiento',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 24, month: 1, year: 2026, hour: 15, duration: 2,
        status: 'rescheduled',
        history: [
            { time: '18 Feb · 11:00', label: 'Cita creada por el Agente' },
            { time: '21 Feb · 16:30', label: 'Paciente solicitó reprogramar — Agente gestionó cambio' },
        ],
    },
    {
        id: 5, patient: 'Sofía Díaz', treatment: 'Ortodoncia — control',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 25, month: 1, year: 2026, hour: 9, duration: 1,
        status: 'cancelled',
        history: [
            { time: '19 Feb · 10:00', label: 'Cita creada por el Agente' },
            { time: '22 Feb · 08:15', label: 'Paciente canceló — Agente registró motivo' },
        ],
    },
    {
        id: 6, patient: 'Roberto Fuentes', treatment: 'Extracción simple',
        doctor: 'Dr. Medina', channel: 'WhatsApp',
        day: 26, month: 1, year: 2026, hour: 14, duration: 1,
        status: 'confirmed',
        history: [
            { time: '21 Feb · 20:10', label: 'Cita creada por el Agente — fuera de horario' },
        ],
    },
];

/* ─────────────── HELPERS ─────────────── */
const Glass = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.03] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, cls }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cls}`}>{children}</span>
);

// Get monday of the week containing `date`
const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const apptDate = a => new Date(a.year, a.month, a.day);

/* ─────────────── WEEK VIEW ─────────────── */
const WeekView = ({ weekStart, onSelect, selected }) => {
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    return (
        <div className="flex-1 overflow-auto">
            {/* day headers */}
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-slate-800/60 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-10">
                <div className="py-3" />
                {days.map((d, i) => {
                    const isToday = sameDay(d, TODAY);
                    return (
                        <div key={i} className={`py-3 text-center border-l border-slate-800/40 ${isToday ? 'bg-cyan-500/5' : ''}`}>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{WEEK_DAYS[i]}</p>
                            <div className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isToday ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-300'}`}>
                                {d.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* time grid */}
            <div className="grid grid-cols-[56px_repeat(7,1fr)]">
                {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                        {/* hour label */}
                        <div className="border-t border-slate-800/40 h-16 flex items-start justify-end pr-2 pt-1">
                            <span className="text-[10px] text-slate-600 font-medium">{hour}:00</span>
                        </div>
                        {/* day columns */}
                        {days.map((d, di) => {
                            const dayAppts = APPOINTMENTS.filter(a =>
                                sameDay(apptDate(a), d) && a.hour === hour
                            );
                            const isToday = sameDay(d, TODAY);
                            return (
                                <div key={di} className={`border-t border-l border-slate-800/40 h-16 relative ${isToday ? 'bg-cyan-500/[0.02]' : ''}`}>
                                    {dayAppts.map(a => {
                                        const cfg = APPOINTMENT_STATUS[a.status];
                                        const isSelected = selected?.id === a.id;
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => onSelect(a)}
                                                style={{ height: `${a.duration * 64}px` }}
                                                className={`absolute inset-x-0.5 top-0.5 rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-150 ${cfg.bar} ${isSelected ? 'ring-1 ring-white/30 brightness-125' : 'hover:brightness-110'
                                                    }`}
                                            >
                                                <p className="text-xs font-semibold text-white truncate leading-tight">{a.patient}</p>
                                                <p className="text-[10px] text-white/70 truncate">{a.treatment}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

/* ─────────────── MONTH VIEW ─────────────── */
const MonthView = ({ currentDate, onSelect, selected }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // shift to Mon-start

    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-7 border-b border-slate-800/60">
                {WEEK_DAYS.map(d => (
                    <div key={d} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                    if (!day) return <div key={`e${i}`} className="h-28 border-t border-l border-slate-800/30 bg-slate-900/10" />;
                    const cellDate = new Date(year, month, day);
                    const dayAppts = APPOINTMENTS.filter(a => sameDay(apptDate(a), cellDate));
                    const isToday = sameDay(cellDate, TODAY);
                    return (
                        <div key={day} className={`h-28 border-t border-l border-slate-800/30 p-1.5 relative hover:bg-white/[0.015] transition-all ${isToday ? 'bg-cyan-500/5' : ''}`}>
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}>{day}</span>
                            <div className="mt-1 space-y-0.5">
                                {dayAppts.slice(0, 3).map(a => {
                                    const cfg = APPOINTMENT_STATUS[a.status];
                                    return (
                                        <div key={a.id} onClick={() => onSelect(a)}
                                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md cursor-pointer text-[10px] text-white font-medium truncate ${cfg.bar} hover:brightness-110 transition-all`}>
                                            <span className="truncate">{a.patient}</span>
                                        </div>
                                    );
                                })}
                                {dayAppts.length > 3 && <p className="text-[10px] text-slate-600 px-1">+{dayAppts.length - 3} más</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─────────────── DAY VIEW ─────────────── */
const DayView = ({ date, onSelect, selected }) => {
    const dayAppts = APPOINTMENTS.filter(a => sameDay(apptDate(a), date)).sort((a, b) => a.hour - b.hour);
    return (
        <div className="flex-1 overflow-auto px-2 py-4 space-y-3">
            {HOURS.map(hour => {
                const appts = dayAppts.filter(a => a.hour === hour);
                return (
                    <div key={hour} className="grid grid-cols-[56px_1fr] gap-2 items-start">
                        <span className="text-xs text-slate-600 font-medium text-right pt-1">{hour}:00</span>
                        <div className={`min-h-[3rem] rounded-xl border border-slate-800/40 ${appts.length ? '' : 'bg-slate-900/20'} space-y-1.5 p-1.5`}>
                            {appts.map(a => {
                                const cfg = APPOINTMENT_STATUS[a.status];
                                return (
                                    <div key={a.id} onClick={() => onSelect(a)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${cfg.bar} ${selected?.id === a.id ? 'ring-1 ring-white/30 brightness-125' : 'hover:brightness-110'}`}>
                                        <div>
                                            <p className="text-xs font-semibold text-white">{a.patient}</p>
                                            <p className="text-[10px] text-white/70">{a.treatment} · {a.hour}:00–{a.hour + a.duration}:00 h</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ─────────────── DETAIL PANEL ─────────────── */
const DetailPanel = ({ appt, onClose }) => {
    if (!appt) {
        return (
            <Glass className="h-full flex flex-col items-center justify-center gap-3 p-6">
                <Calendar size={28} className="text-slate-700" />
                <p className="text-xs text-slate-600 text-center">Selecciona una cita<br />para ver el detalle</p>
            </Glass>
        );
    }

    const cfg = APPOINTMENT_STATUS[appt.status];

    return (
        <Glass className="h-full flex flex-col overflow-hidden">
            {/* panel header */}
            <div className="px-5 py-4 border-b border-slate-800/60 flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Detalle de cita</p>
                    <p className="text-base font-bold text-white">{appt.patient}</p>
                    <Badge cls={cfg.badge}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}</Badge>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
                    <X size={15} />
                </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* key info */}
                <div className="space-y-2.5">
                    {[
                        ['Tratamiento', appt.treatment],
                        ['Hora', `${appt.hour}:00 – ${appt.hour + appt.duration}:00 h (${appt.duration}h)`],
                        ['Doctor', appt.doctor],
                        ['Canal origen', appt.channel],
                        ['Creada por', 'Agente de IA'],
                    ].map(([l, v]) => (
                        <div key={l} className="flex items-start justify-between gap-2">
                            <p className="text-xs text-slate-500 shrink-0">{l}</p>
                            <p className="text-xs font-medium text-slate-200 text-right">{v}</p>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-slate-800/60" />

                {/* actions */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Acciones</p>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/50 text-xs font-medium transition-all">
                        <RotateCcw size={12} /> Reprogramar
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/8 text-xs font-medium transition-all">
                        <X size={12} /> Cancelar cita
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 text-cyan-400 hover:border-cyan-500/35 text-xs font-medium transition-all">
                        <MessageSquare size={12} /> Ir a conversación
                    </button>
                </div>

                <div className="h-px bg-slate-800/60" />

                {/* history */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Historial</p>
                    {appt.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <div className="flex flex-col items-center shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                {i < appt.history.length - 1 && <div className="w-px h-5 bg-slate-800 mt-0.5" />}
                            </div>
                            <div>
                                <p className="text-xs text-slate-300 leading-snug">{h.label}</p>
                                <p className="text-[10px] text-slate-600 mt-0.5">{h.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Glass>
    );
};

/* ─────────────── MAIN ─────────────── */
const CalendarPage = () => {
    const [view, setView] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date(TODAY));
    const [weekStart, setWeekStart] = useState(getWeekStart(TODAY));
    const [selected, setSelected] = useState(null);
    const [syncing, setSyncing] = useState(false);

    const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const navPrev = () => {
        if (view === 'week') {
            const d = new Date(weekStart);
            d.setDate(d.getDate() - 7);
            setWeekStart(d);
        } else if (view === 'month') {
            setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
        } else {
            setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
        }
    };

    const navNext = () => {
        if (view === 'week') {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + 7);
            setWeekStart(d);
        } else if (view === 'month') {
            setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
        } else {
            setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
        }
    };

    const navLabel = view === 'week'
        ? (() => {
            const end = new Date(weekStart); end.setDate(weekStart.getDate() + 6);
            return `${weekStart.getDate()} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`;
        })()
        : view === 'month'
            ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            : currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    const handleSync = () => {
        setSyncing(true);
        setTimeout(() => setSyncing(false), 2000);
    };

    // status legend counts
    const counts = Object.keys(APPOINTMENT_STATUS).reduce((acc, k) => {
        acc[k] = APPOINTMENTS.filter(a => a.status === k).length;
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] gap-4">

            {/* BLOQUE 1 — Header */}
            <div className="flex items-start justify-between gap-4 shrink-0 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Agenda del Agente
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Citas creadas y gestionadas por el Agente de Atención</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* sync status */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                        <span className="text-slate-400">Sincronización activa</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-600">última: 15:01</span>
                    </div>
                    <button onClick={handleSync} disabled={syncing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/60 transition-all disabled:opacity-60">
                        <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Sincronizando...' : 'Sincronizar ahora'}
                    </button>

                    {/* view selector */}
                    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-slate-900/60 border border-slate-700/40">
                        {['day', 'week', 'month'].map(v => (
                            <button key={v} onClick={() => setView(v)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* BLOQUE 2+3 — Calendar + Detail */}
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

                {/* Calendar area — 8 cols */}
                <Glass className="col-span-8 flex flex-col overflow-hidden">
                    {/* nav bar */}
                    <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <button onClick={navPrev} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-semibold text-white capitalize min-w-[200px] text-center">{navLabel}</span>
                            <button onClick={navNext} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* legend */}
                        <div className="flex items-center gap-3">
                            {Object.entries(APPOINTMENT_STATUS).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${v.dot}`} />
                                    <span className="text-[10px] text-slate-500">{v.label}</span>
                                    <span className="text-[10px] text-slate-700">({counts[k]})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* view */}
                    {view === 'week' && <WeekView weekStart={weekStart} onSelect={setSelected} selected={selected} />}
                    {view === 'month' && <MonthView currentDate={currentDate} onSelect={setSelected} selected={selected} />}
                    {view === 'day' && <DayView date={currentDate} onSelect={setSelected} selected={selected} />}
                </Glass>

                {/* Detail Panel — 4 cols */}
                <div className="col-span-4 min-h-0">
                    <DetailPanel appt={selected} onClose={() => setSelected(null)} />
                </div>
            </div>

            <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 99px; }
      `}</style>
        </div>
    );
};

export default CalendarPage;
