import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2, XCircle, AlertTriangle, RefreshCw, Wifi,
    Plus, ChevronRight, Clock, Activity, ServerCrash,
    WifiOff, ShieldCheck, Zap, X, Calendar, Stethoscope
} from 'lucide-react';

/* ─── design tokens ─── */
const GlassCard = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.035] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

/* ─── status badge ─── */
const StatusBadge = ({ status }) => {
    const cfg = {
        connected: { label: 'Conectado', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse' },
        disconnected: { label: 'Desconectado', cls: 'bg-slate-700/40  border-slate-600/40   text-slate-400', dot: 'bg-slate-500' },
        error: { label: 'Error', cls: 'bg-red-500/10    border-red-500/30     text-red-400', dot: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]' },
        syncing: { label: 'Sincronizando', cls: 'bg-amber-500/10  border-amber-500/30   text-amber-400', dot: 'bg-amber-400 animate-pulse' },
    }[status] || {};
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

/* ─── WhatsApp SVG logo ─── */
const WhatsAppLogo = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <circle cx="24" cy="24" r="24" fill="#25D366" />
        <path d="M34.5 13.5C32 11 28.5 9.5 24.5 9.5C16.5 9.5 10 16 10 24C10 26.5 10.7 29 12 31L10 38L17.3 36C19.2 37.1 21.3 37.7 23.5 37.7C31.5 37.7 38 31.2 38 23.2C38 19.2 36.9 15.9 34.5 13.5ZM24.5 35.3C22.4 35.3 20.4 34.7 18.7 33.7L18.2 33.4L13.5 34.7L14.8 30.2L14.5 29.7C13.4 27.9 12.8 25.8 12.8 23.6C12.8 17.2 18 12.1 24.5 12.1C27.6 12.1 30.5 13.3 32.7 15.5C34.9 17.7 36.1 20.6 36.1 23.7C36.1 30.2 31 35.3 24.5 35.3ZM30.9 26.6C30.5 26.4 28.5 25.4 28.1 25.3C27.7 25.1 27.4 25.1 27.2 25.5C27 25.9 26.2 26.7 26 27C25.8 27.3 25.6 27.3 25.2 27.1C23.5 26.3 22.3 25.5 21.1 23.7C20.7 23.1 21.5 23.1 22.2 21.8C22.3 21.5 22.2 21.3 22.1 21.1C22 20.9 21.2 18.9 20.8 18.1C20.5 17.3 20.1 17.4 19.8 17.4C19.6 17.4 19.3 17.4 19 17.4C18.7 17.4 18.2 17.5 17.8 17.9C17.4 18.3 16.3 19.3 16.3 21.3C16.3 23.3 17.8 25.2 18 25.5C18.2 25.7 21.1 30.1 25.5 31.8C28.4 32.9 29.5 33 30.9 32.8C31.8 32.7 33.6 31.8 34 30.8C34.4 29.8 34.4 28.9 34.3 28.7C34.1 28.5 33.2 28.4 30.9 26.6Z" fill="white" />
    </svg>
);

const CalendarLogo = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <rect width="48" height="48" rx="10" fill="#fff" />
        <rect x="6" y="10" width="36" height="32" rx="4" fill="#1a73e8" />
        <rect x="6" y="10" width="36" height="12" rx="4" fill="#1a73e8" />
        <rect x="6" y="18" width="36" height="4" fill="#1558b0" />
        <text x="24" y="36" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">20</text>
        <rect x="15" y="7" width="4" height="7" rx="2" fill="#5f6368" />
        <rect x="29" y="7" width="4" height="7" rx="2" fill="#5f6368" />
    </svg>
);

const DentalinkLogo = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <rect width="48" height="48" rx="10" fill="#0ea5e9" />
        <path d="M14 34 C14 34 10 28 10 22 C10 15 17 10 24 10 C31 10 38 15 38 22 C38 28 34 34 34 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="24" cy="26" rx="6" ry="8" fill="white" fillOpacity="0.9" />
        <path d="M18 24 Q24 20 30 24" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);

/* ─── INTEGRATION CARD ─── */
const IntegrationCard = ({ integration, onAction }) => {
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null); // null | 'ok' | 'fail'

    const handleTest = () => {
        setTesting(true);
        setTestResult(null);
        setTimeout(() => {
            setTesting(false);
            setTestResult(integration.status === 'error' ? 'fail' : 'ok');
            setTimeout(() => setTestResult(null), 3000);
        }, 1800);
    };

    const isError = integration.status === 'error';
    const isConnected = integration.status === 'connected';

    return (
        <GlassCard className={`p-6 flex flex-col gap-5 transition-all duration-300 hover:border-white/[0.12] ${isError ? 'border-red-500/20' : ''}`}>
            {/* top row */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-center shadow-inner">
                        {integration.logo}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-base leading-tight">{integration.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{integration.category}</p>
                    </div>
                </div>
                <StatusBadge status={integration.status} />
            </div>

            {/* meta */}
            <div className="space-y-2">
                {integration.meta.map((m, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{m.label}</span>
                        <span className="text-xs text-slate-300 font-medium">{m.value}</span>
                    </div>
                ))}
            </div>

            {/* error alert */}
            {isError && (
                <div className="flex items-start gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2.5">
                    <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 leading-relaxed">{integration.errorMsg}</p>
                </div>
            )}

            {/* test feedback */}
            {testResult && (
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${testResult === 'ok'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {testResult === 'ok' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {testResult === 'ok' ? 'Conexión verificada correctamente' : 'No se pudo establecer conexión'}
                </div>
            )}

            {/* actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={handleTest}
                    disabled={testing}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all disabled:opacity-50"
                >
                    <RefreshCw size={12} className={testing ? 'animate-spin' : ''} />
                    {testing ? 'Probando...' : isConnected ? 'Probar conexión' : 'Probar integración'}
                </button>
                <button
                    onClick={() => onAction(integration.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isError || !isConnected
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                            : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white'
                        }`}
                >
                    {isError || !isConnected ? (
                        <><Wifi size={12} /> Reconectar</>
                    ) : (
                        <><ChevronRight size={12} /> Ver detalles</>
                    )}
                </button>
            </div>
        </GlassCard>
    );
};

/* ─── SYSTEM DIAGNOSTIC ─── */
const DiagRow = ({ name, status, delay }) => {
    const [state, setState] = useState('pending'); // pending | checking | ok | fail
    useEffect(() => {
        const t1 = setTimeout(() => setState('checking'), delay);
        const t2 = setTimeout(() => setState(status === 'error' ? 'fail' : 'ok'), delay + 900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [delay, status]);

    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${state === 'ok' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' :
                        state === 'fail' ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]' :
                            state === 'checking' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                    }`} />
                <span className="text-sm text-slate-300 font-medium">{name}</span>
            </div>
            <span className={`text-xs font-semibold transition-all duration-300 ${state === 'ok' ? 'text-emerald-400' :
                    state === 'fail' ? 'text-red-400' :
                        state === 'checking' ? 'text-amber-400' : 'text-slate-600'
                }`}>
                {state === 'pending' ? '—' : state === 'checking' ? 'Verificando...' : state === 'ok' ? '✓ Operativo' : '✗ Con errores'}
            </span>
        </div>
    );
};

/* ─── ADD INTEGRATION MODAL ─── */
const availableIntegrations = [
    { name: 'Instagram Direct', icon: '📸', desc: 'Responde mensajes directos automáticamente' },
    { name: 'Gmail', icon: '📧', desc: 'Envía seguimientos y confirmaciones por correo' },
    { name: 'Telegram', icon: '✈️', desc: 'Canal alternativo para pacientes' },
    { name: 'Zapier', icon: '⚡', desc: 'Automatiza flujos entre herramientas' },
    { name: 'Slack', icon: '💬', desc: 'Notificaciones internas al equipo' },
];

const AddModal = ({ onClose }) => (
    <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
    >
        <div
            className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modalIn 0.2s ease-out' }}
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div>
                    <h3 className="font-semibold text-white">Agregar integración</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Selecciona un canal para conectar</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
                    <X size={16} />
                </button>
            </div>
            <div className="p-4 space-y-1.5 max-h-80 overflow-y-auto">
                {availableIntegrations.map(a => (
                    <button
                        key={a.name}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-left transition-all group"
                    >
                        <span className="text-xl">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{a.name}</p>
                            <p className="text-xs text-slate-500 truncate">{a.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                    </button>
                ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-800">
                <p className="text-xs text-slate-600 text-center">¿No encuentras tu herramienta? Contáctanos para integraciones personalizadas.</p>
            </div>
        </div>
    </div>
);

/* ──────────────────── MAIN ──────────────────── */
const Integrations = () => {
    const [integrations, setIntegrations] = useState([
        {
            id: 'wa',
            name: 'WhatsApp Business',
            category: 'Mensajería principal',
            logo: <WhatsAppLogo />,
            status: 'connected',
            meta: [
                { label: 'Número vinculado', value: '+56 9 8765 4321' },
                { label: 'Última sincronización', value: 'Hace 2 minutos' },
                { label: 'Mensajes procesados hoy', value: '47' },
            ],
            errorMsg: null,
        },
        {
            id: 'cal',
            name: 'Google Calendar',
            category: 'Calendario y agendamiento',
            logo: <CalendarLogo />,
            status: 'connected',
            meta: [
                { label: 'Tipo de acceso', value: 'Lectura y escritura' },
                { label: 'Última sincronización', value: 'Hace 8 minutos' },
                { label: 'Calendario activo', value: 'Clínica Medina' },
            ],
            errorMsg: null,
        },
        {
            id: 'dnk',
            name: 'Dentalink',
            category: 'Sistema clínico',
            logo: <DentalinkLogo />,
            status: 'error',
            meta: [
                { label: 'Datos sincronizados', value: 'Citas, disponibilidad' },
                { label: 'Última sincronización', value: 'Hace 3 horas' },
                { label: 'Pacientes activos', value: '—' },
            ],
            errorMsg: 'No se pudo conectar al sistema clínico. Verifica que el servicio esté disponible.',
        },
    ]);

    const events = [
        { id: 1, time: '14:12', type: 'error', msg: 'Fallo de conexión con Dentalink — reintentando automáticamente' },
        { id: 2, time: '13:58', type: 'success', msg: 'Reconexión exitosa con WhatsApp Business API' },
        { id: 3, time: '12:30', type: 'info', msg: 'Actualización automática de sincronización — Google Calendar' },
        { id: 4, time: '11:44', type: 'warn', msg: 'Latencia elevada detectada en Dentalink (>3s)' },
        { id: 5, time: '10:15', type: 'success', msg: 'Todos los sistemas operativos — revisión de rutina completada' },
    ];

    const eventStyle = {
        error: { dot: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]', text: 'text-red-400', label: 'Error' },
        success: { dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]', text: 'text-emerald-400', label: 'OK' },
        info: { dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)]', text: 'text-cyan-400', label: 'Info' },
        warn: { dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]', text: 'text-amber-400', label: 'Aviso' },
    };

    const systemOk = integrations.every(i => i.status !== 'error');
    const hasError = integrations.some(i => i.status === 'error');

    const [diagKey, setDiagKey] = useState(0);
    const [diagRunning, setDiagRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const runDiag = () => {
        setDiagKey(k => k + 1);
        setDiagRunning(true);
        setTimeout(() => setDiagRunning(false), 3500);
    };

    const handleCardAction = (id) => {
        setIntegrations(prev => prev.map(i => {
            if (i.id !== id) return i;
            if (i.status === 'error' || i.status === 'disconnected') {
                return { ...i, status: 'syncing' };
            }
            return i;
        }));
        setTimeout(() => {
            setIntegrations(prev => prev.map(i => {
                if (i.id !== id) return i;
                if (i.status === 'syncing') return { ...i, status: 'connected', meta: i.meta.map((m, idx) => idx === 1 ? { ...m, value: 'Hace un momento' } : m) };
                return i;
            }));
        }, 2000);
    };

    return (
        <div className="space-y-8">

            {/* BLOQUE 1 — Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Integraciones
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Conexiones activas del Agente de Atención</p>
                </div>

                {/* system health indicator */}
                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium shrink-0 transition-all duration-500 ${hasError
                        ? 'border-amber-500/30 bg-amber-500/8 text-amber-400'
                        : 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400'
                    }`}>
                    {hasError ? (
                        <><AlertTriangle size={15} /> <span>Incidencias Detectadas</span></>
                    ) : (
                        <><ShieldCheck size={15} /> <span>Sistema Operativo</span></>
                    )}
                </div>
            </div>

            {/* BLOQUE 2 — Integration cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {integrations.map(i => (
                    <IntegrationCard key={i.id} integration={i} onAction={handleCardAction} />
                ))}
            </div>

            {/* BLOQUE 3 — Event log */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <Activity size={16} className="text-cyan-400" /> Eventos Recientes
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Actividad del sistema en las últimas 4 horas</p>
                    </div>
                </div>
                <div className="space-y-0 divide-y divide-slate-800/60">
                    {events.map(ev => {
                        const s = eventStyle[ev.type];
                        return (
                            <div key={ev.id} className="flex items-center gap-4 py-3 group hover:bg-white/[0.015] rounded-lg px-2 transition-colors">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                                <span className="text-xs text-slate-600 font-mono shrink-0 w-10">{ev.time}</span>
                                <span className={`text-xs font-semibold shrink-0 w-14 ${s.text}`}>{s.label}</span>
                                <p className="text-xs text-slate-400 leading-relaxed">{ev.msg}</p>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>

            {/* BLOQUE 4 — System diagnostic */}
            <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <Zap size={16} className="text-violet-400" /> Prueba de Integraciones
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Verifica el estado de todas las conexiones simultáneamente</p>
                    </div>
                    <button
                        onClick={runDiag}
                        disabled={diagRunning}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/20 disabled:opacity-60 shrink-0"
                    >
                        <RefreshCw size={14} className={diagRunning ? 'animate-spin' : ''} />
                        {diagRunning ? 'Ejecutando...' : 'Ejecutar Prueba General del Sistema'}
                    </button>
                </div>

                {diagRunning && (
                    <div key={diagKey} className="mt-5 bg-slate-900/50 rounded-xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden" style={{ animation: 'fadeSlideIn 0.25s ease-out' }}>
                        <DiagRow name="WhatsApp Business" status={integrations.find(i => i.id === 'wa')?.status} delay={200} />
                        <DiagRow name="Google Calendar" status={integrations.find(i => i.id === 'cal')?.status} delay={800} />
                        <DiagRow name="Dentalink" status={integrations.find(i => i.id === 'dnk')?.status} delay={1400} />
                    </div>
                )}
            </GlassCard>

            {/* BLOQUE 5 — Add integration */}
            <div className="flex items-center justify-between px-1">
                <p className="text-xs text-slate-600">3 de 8 integraciones disponibles activas</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/70 text-slate-300 hover:text-white text-sm font-medium transition-all"
                >
                    <Plus size={15} /> Agregar integración
                </button>
            </div>

            {/* Modal */}
            {showModal && <AddModal onClose={() => setShowModal(false)} />}

            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Integrations;
