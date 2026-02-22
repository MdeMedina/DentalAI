import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Send, Bot, User, AlertTriangle, Clock,
    CheckCircle2, MessageSquare, ArrowRight,
    UserCheck, Flag, Download, StickyNote,
    Activity, Shield, ThumbsUp, ThumbsDown,
    RotateCcw, Zap, AlertCircle, X, ChevronRight
} from 'lucide-react';

/* ─────────────── CONSTANTS ─────────────── */

// Urgency levels
const URGENCY = {
    1: { label: 'Normal', shortLabel: 'Normal', dot: 'bg-emerald-400', bar: null, ring: 'border-transparent', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    2: { label: 'Prioridad', shortLabel: 'Prioridad', dot: 'bg-amber-400 animate-pulse', bar: 'bg-amber-500/10 border-b border-amber-500/25 text-amber-400', ring: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    3: { label: 'Urgencia', shortLabel: 'Urgencia', dot: 'bg-red-400 animate-pulse shadow-[0_0_6px_rgba(248,113,113,0.8)]', bar: 'bg-red-500/10 border-b border-red-500/30 text-red-400', ring: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500/10 border-red-500/30 text-red-400' },
};

// Derivation types
const DERIVATION = {
    auto: { label: 'Derivada automáticamente', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400', dot: 'bg-amber-400' },
    urgent: { label: 'Urgencia — intervención requerida', cls: 'bg-red-500/10 border-red-500/30 text-red-400', dot: 'bg-red-400 animate-pulse' },
    manual: { label: 'Tomada manualmente', cls: 'bg-blue-500/10  border-blue-500/30  text-blue-400', dot: 'bg-blue-400' },
};

// Attendance modes
const MODE = {
    auto: { label: 'Modo Automático', short: 'IA activa', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', headerBg: '', dot: 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' },
    manual: { label: 'Modo Manual Activo', short: 'Control humano', color: 'bg-red-500/10 border-red-500/30 text-red-400', headerBg: 'bg-red-900/10', dot: 'bg-red-400 animate-pulse shadow-[0_0_6px_rgba(248,113,113,0.8)]' },
};

/* ─────────────── DATA ─────────────── */
const BASE_CONVERSATIONS = [
    {
        id: 1, name: 'María García', initials: 'MG',
        intent: 'Reprogramar cita', urgencyLevel: 1,
        derivation: null, channel: 'WhatsApp',
        time: 'hace 3 min', lastMsg: '¿Es posible cambiar la hora de mañana?',
        attendedBy: null,
        history: [{ time: '14:28', label: 'Agente IA inició la conversación' }],
        messages: [
            { id: 1, from: 'agent', text: 'Hola María, soy el asistente de Clínica Dental Dr. Medina. ¿En qué puedo ayudarte?', time: '14:28' },
            { id: 2, from: 'patient', text: 'Hola, tengo cita mañana a las 14:00 h pero me surgió algo.', time: '14:29' },
            { id: 3, from: 'agent', text: 'Entendido. ¿Qué horario te acomodaría mejor para reprogramar?', time: '14:30' },
            { id: 4, from: 'patient', text: '¿Es posible cambiar la hora de mañana? Preferiría la tarde.', time: '14:32' },
        ],
        context: { phone: '+56 9 8765 4321', reason: 'Reprogramar cita odontológica', treatment: 'Limpieza dental', action: 'Solicitud de cambio de cita', cita: 'Jue 21 Feb · 14:00 h' },
    },
    {
        id: 2, name: 'Carlos Vega', initials: 'CV',
        intent: 'Urgencia dental', urgencyLevel: 3,
        derivation: 'urgent', channel: 'WhatsApp',
        time: 'hace 12 min', lastMsg: 'Me duele mucho desde anoche',
        attendedBy: 'Dr. Medina',
        history: [
            { time: '14:05', label: 'Agente IA inició la conversación' },
            { time: '14:08', label: 'Agente derivó por urgencia detectada' },
            { time: '14:10', label: 'Dr. Medina tomó la conversación' },
        ],
        messages: [
            { id: 1, from: 'agent', text: 'Buen día Carlos. ¿Cuéntame en qué te puedo ayudar?', time: '14:05' },
            { id: 2, from: 'patient', text: 'Tengo un dolor muy fuerte en una muela desde anoche. Me duele mucho.', time: '14:07' },
            { id: 3, from: 'agent', text: 'Entiendo que es urgente. Por tratarse de una urgencia dental, estoy contactando a un profesional de inmediato.', time: '14:08' },
            { id: 4, from: 'human', text: 'Hola Carlos, habla el Dr. Medina. Cuéntame dónde exactamente te duele y si hay inflamación visible.', time: '14:10', label: 'Dr. Medina' },
        ],
        context: { phone: '+56 9 1234 5678', reason: 'Dolor molar agudo', treatment: 'Endodoncia (posible)', action: 'Derivación urgente a profesional', cita: null },
    },
    {
        id: 3, name: 'Ana Restrepo', initials: 'AR',
        intent: 'Consulta de precios', urgencyLevel: 1,
        derivation: null, channel: 'WhatsApp',
        time: 'hace 1 h', lastMsg: 'Muchas gracias, hasta luego.',
        attendedBy: null,
        history: [
            { time: '13:15', label: 'Agente IA inició la conversación' },
            { time: '13:16', label: 'Consulta resuelta por IA' },
        ],
        messages: [
            { id: 1, from: 'patient', text: '¿Cuánto cuesta un blanqueamiento?', time: '13:15' },
            { id: 2, from: 'agent', text: 'El blanqueamiento dental profesional tiene un costo de $120.000. Incluye evaluación previa y kit de mantenimiento.', time: '13:15' },
            { id: 3, from: 'patient', text: 'Muchas gracias, hasta luego.', time: '13:16' },
        ],
        context: { phone: '+56 9 2233 4455', reason: 'Consulta de precios', treatment: 'Blanqueamiento dental', action: 'Información entregada — resuelto por IA', cita: null },
    },
    {
        id: 4, name: 'Luis Morales', initials: 'LM',
        intent: 'Solicitud de cita', urgencyLevel: 2,
        derivation: 'auto', channel: 'WhatsApp',
        time: 'hace 8 min', lastMsg: 'No entiendo qué horarios tienen libre',
        attendedBy: null,
        history: [
            { time: '14:17', label: 'Agente IA inició la conversación' },
            { time: '14:25', label: 'Agente derivó por consulta compleja' },
        ],
        messages: [
            { id: 1, from: 'patient', text: 'Hola, quiero agendar una cita para revisión.', time: '14:17' },
            { id: 2, from: 'agent', text: 'Con gusto te ayudo. ¿Tienes alguna preferencia de horario?', time: '14:17' },
            { id: 3, from: 'patient', text: 'No entiendo qué horarios tienen libre', time: '14:25' },
        ],
        context: { phone: '+56 9 9876 5432', reason: 'Agendar consulta de revisión', treatment: 'Revisión general', action: 'Derivación automática — agendamiento complejo', cita: null },
    },
];

const STATUS_LABEL = (c) => {
    if (c.derivation) return DERIVATION[c.derivation].label;
    if (c.attendedBy) return 'Modo manual activo';
    return 'Automática';
};

const FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Activas' },
    { id: 'attention', label: 'Requieren atención' },
    { id: 'derived', label: 'Derivadas' },
    { id: 'urgent', label: 'Urgencias' },
];

/* ─────────────── SHARED UI ─────────────── */
const Glass = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.03] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, cls }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cls}`}>{children}</span>
);

/* ─────────────── CONFIRM MODAL ─────────────── */
const ConfirmModal = ({ title, body, confirmLabel, confirmCls, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ animation: 'fadeBgIn 0.15s ease-out' }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-[340px] shadow-2xl" style={{ animation: 'slideUpIn 0.2s ease-out' }}>
            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">{body}</p>
            <div className="flex gap-2">
                <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm transition-all">Cancelar</button>
                <button onClick={onConfirm} className={`flex-1 py-2 rounded-xl text-white text-sm font-medium transition-all ${confirmCls}`}>{confirmLabel}</button>
            </div>
        </div>
    </div>
);

/* ─────────────── ZONA 1 — Conversation List ─────────────── */
const ConvList = ({ convs, selected, onSelect }) => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = convs.filter(c => {
        const mf = filter === 'all' ? true
            : filter === 'urgent' ? c.urgencyLevel === 3
                : filter === 'attention' ? (c.urgencyLevel >= 2 || c.derivation)
                    : filter === 'derived' ? !!c.derivation
                        : filter === 'active' ? (!c.derivation && c.urgencyLevel === 1)
                            : true;
        const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.intent.toLowerCase().includes(search.toLowerCase());
        return mf && ms;
    });

    return (
        <Glass className="flex flex-col overflow-hidden h-full">
            <div className="px-4 pt-4 pb-3 border-b border-slate-800/60 shrink-0">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Conversaciones</p>
                <div className="relative mb-3">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Buscar..."
                        className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600 transition-all" />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    {FILTERS.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${filter === f.id ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
                {filtered.map(c => {
                    const U = URGENCY[c.urgencyLevel];
                    const isSelected = selected?.id === c.id;
                    const hasDeriv = !!c.derivation;

                    return (
                        <div key={c.id} onClick={() => onSelect(c)}
                            className={`px-4 py-3.5 cursor-pointer transition-all duration-200 relative border-l-2 ${isSelected ? 'bg-cyan-500/5 border-l-cyan-500' : 'border-l-transparent hover:bg-white/[0.015]'}
                ${c.urgencyLevel === 3 ? 'border-r-2 border-r-red-500/60' : ''}
              `}
                            style={{ animation: 'fadeSlideIn 0.15s ease-out' }}>
                            <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.urgencyLevel === 3 ? 'bg-gradient-to-br from-red-500 to-orange-500' : c.urgencyLevel === 2 ? 'bg-gradient-to-br from-amber-500 to-orange-400' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>{c.initials}</div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${U.dot}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{c.name}</p>
                                        <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMsg}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        <span className="text-[10px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded-md">{c.intent}</span>
                                        {c.urgencyLevel > 1 && <Badge cls={U.badge}><span className={`w-1 h-1 rounded-full ${U.dot.split(' ')[0]}`} />{U.label}</Badge>}
                                        {hasDeriv && <Badge cls={DERIVATION[c.derivation].cls}><span className={`w-1 h-1 rounded-full ${DERIVATION[c.derivation].dot.split(' ')[0]}`} />{c.derivation === 'auto' ? 'Derivada' : c.derivation === 'urgent' ? 'Urgencia' : 'Manual'}</Badge>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Glass>
    );
};

/* ─────────────── ZONA 2 — Chat Zone ─────────────── */
const ChatZone = ({ conv, mode, onTake, onReturn }) => {
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState(conv.messages);
    const endRef = useRef(null);
    const [takingModal, setTakingModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [replyReturn, setReplyReturn] = useState(false); // "Responder y devolver a IA"

    useEffect(() => { setMsgs(conv.messages); setInput(''); }, [conv.id]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    const U = URGENCY[conv.urgencyLevel];
    const isManual = mode === 'manual';

    const sendMsg = (e, returnAfter = false) => {
        e && e.preventDefault();
        if (!input.trim()) return;
        const now = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        setMsgs(m => [...m, { id: Date.now(), from: 'human', text: input, time: now, label: conv.attendedBy || 'Recepción' }]);
        setInput('');
        if (returnAfter) { setTimeout(() => onReturn(), 400); }
    };

    const confirmTake = () => { setTakingModal(false); onTake(); };
    const confirmReturn = () => { setReturnModal(false); onReturn(); };

    return (
        <Glass className="flex flex-col overflow-hidden h-full">
            {/* urgency banner */}
            {conv.urgencyLevel >= 2 && U.bar && (
                <div className={`flex items-center gap-2 px-5 py-2 text-xs font-medium ${U.bar} shrink-0`}>
                    <AlertTriangle size={12} />
                    {conv.urgencyLevel === 3 ? 'Posible urgencia detectada — este paciente requiere atención inmediata' : 'Caso de prioridad elevada'}
                </div>
            )}

            {/* context bar */}
            <div className={`px-5 py-3.5 border-b border-slate-800/60 shrink-0 transition-colors duration-500 ${isManual ? 'bg-red-900/10' : 'bg-slate-900/30'}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${conv.urgencyLevel === 3 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>
                            {conv.initials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{conv.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><MessageSquare size={10} /> {conv.channel}</span>
                                <span className={`text-xs font-medium ${U.text}`}>{U.label}</span>
                                {conv.derivation && <Badge cls={DERIVATION[conv.derivation].cls}><span className={`w-1 h-1 rounded-full ${DERIVATION[conv.derivation].dot.split(' ')[0]}`} />{DERIVATION[conv.derivation].label}</Badge>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {isManual ? (
                            <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                    <span className="text-xs font-semibold text-red-400">Modo Manual — {conv.attendedBy || 'Recepción'}</span>
                                </div>
                                <button onClick={() => setReturnModal(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200">
                                    <RotateCcw size={13} /> Reactivar Agente
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setTakingModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/15 transition-all">
                                <UserCheck size={12} /> Tomar conversación
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* intent bar */}
            <div className="px-5 py-1.5 border-b border-slate-800/40 shrink-0 flex items-center gap-3 text-xs text-slate-500">
                <Activity size={10} className="text-cyan-400" /><span>Intención:</span>
                <span className="font-medium text-slate-300">{conv.intent}</span>
                <span className="ml-auto text-slate-700">#{conv.id.toString().padStart(4, '0')}</span>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-slate-950/50">
                {msgs.map(m => {
                    const isPatient = m.from === 'patient';
                    const isHuman = m.from === 'human';
                    const isAgent = m.from === 'agent';
                    return (
                        <div key={m.id} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                            <div className={`flex gap-2.5 max-w-[78%] ${isPatient ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${isAgent ? 'bg-slate-800 border border-cyan-500/40' : isHuman ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-slate-700'}`}>
                                    {isAgent ? <Bot size={13} className="text-cyan-400" />
                                        : isHuman ? <UserCheck size={12} className="text-emerald-400" />
                                            : <User size={12} className="text-slate-300" />}
                                </div>
                                <div>
                                    {(isAgent || isHuman) && (
                                        <p className={`text-xs mb-1 font-medium ${isHuman ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                            {isHuman ? (m.label || 'Recepción') : 'Agente de IA'}
                                        </p>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isPatient ? 'bg-cyan-500/25 border border-cyan-400/35 text-white rounded-tr-sm'
                                        : isHuman ? 'bg-emerald-500/18 border border-emerald-400/30 text-slate-100 rounded-tl-sm'
                                            : 'bg-slate-800 border border-slate-600/50 text-slate-200 rounded-tl-sm'
                                        }`}>
                                        {m.text}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                        <span className="text-[10px] text-slate-600">{m.time}</span>
                                        {isHuman && <span className="text-[10px] text-emerald-600 bg-emerald-500/8 px-1.5 py-0.5 rounded-full border border-emerald-500/15">Enviado por {m.label || 'Recepción'}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {/* input */}
            {isManual ? (
                <div className="px-5 py-4 border-t border-red-500/15 bg-red-900/5 shrink-0">
                    <form onSubmit={sendMsg} className="relative">
                        <input type="text" value={input} onChange={e => setInput(e.target.value)}
                            className="w-full bg-slate-900/70 border border-red-500/25 rounded-xl pl-4 pr-28 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Escribir como equipo clínico..." />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button type="button" onClick={(e) => sendMsg(e, true)} title="Responder y devolver a IA"
                                className="px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-1">
                                <RotateCcw size={11} /><span className="hidden sm:inline">y devolver</span>
                            </button>
                            <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all">
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                    <p className="text-[10px] text-red-400/60 mt-2 text-center">El agente no responderá mientras el modo manual esté activo</p>
                </div>
            ) : (
                <div className="px-5 py-3.5 border-t border-slate-800/60 bg-slate-900/20 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                        <Bot size={12} className="text-cyan-400" />
                        <span>El agente está gestionando esta conversación. Haz clic en <strong className="text-slate-400">"Tomar conversación"</strong> para intervenir.</span>
                    </div>
                </div>
            )}

            {/* modals */}
            {takingModal && (
                <ConfirmModal
                    title="¿Tomar esta conversación?"
                    body="El agente dejará de responder automáticamente en esta conversación. Podrás reactivarlo en cualquier momento. El agente seguirá activo en todas las demás conversaciones."
                    confirmLabel="Confirmar"
                    confirmCls="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                    onConfirm={confirmTake}
                    onCancel={() => setTakingModal(false)}
                />
            )}
            {returnModal && (
                <ConfirmModal
                    title="¿Reactivar el Agente?"
                    body="El agente retomará esta conversación automáticamente. Podrás volver a tomar control en cualquier momento."
                    confirmLabel="Reactivar Agente"
                    confirmCls="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                    onConfirm={confirmReturn}
                    onCancel={() => setReturnModal(false)}
                />
            )}
        </Glass>
    );
};

/* ─────────────── ZONA 3 — Context Panel ─────────────── */
const ContextPanel = ({ conv, mode }) => {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    useEffect(() => { setRating(null); setComment(''); }, [conv.id]);

    const U = URGENCY[conv.urgencyLevel];

    return (
        <div className="flex flex-col gap-3 h-full overflow-y-auto scrollbar-none">
            {/* datos capturados */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Datos capturados</p>
                <div className="space-y-2.5">
                    {[['Nombre', conv.name], ['Teléfono', conv.context.phone], ['Motivo', conv.context.reason], ['Tratamiento', conv.context.treatment || 'No detectado']].map(([l, v]) => (
                        <div key={l}>
                            <p className="text-[10px] text-slate-600">{l}</p>
                            <p className="text-xs font-medium text-slate-300 mt-0.5">{v}</p>
                        </div>
                    ))}
                </div>
            </Glass>

            {/* nivel de urgencia */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Nivel de urgencia</p>
                <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3].map(lvl => (
                        <div key={lvl} className={`flex-1 h-1.5 rounded-full transition-all ${conv.urgencyLevel >= lvl ? (lvl === 3 ? 'bg-red-400' : lvl === 2 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-800'}`} />
                    ))}
                </div>
                <p className={`text-xs font-semibold ${U.text}`}>{U.label}</p>
                {conv.urgencyLevel === 3 && <p className="text-xs text-slate-500 mt-1">Motivo: {conv.context.reason}</p>}
            </Glass>

            {/* estado de atención */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Estado de atención</p>
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-3 transition-all ${mode === 'manual' ? 'bg-red-500/8 border-red-500/25' : 'bg-emerald-500/8 border-emerald-500/25'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${mode === 'manual' ? 'bg-red-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]'}`} />
                    <div>
                        <p className={`text-xs font-semibold ${mode === 'manual' ? 'text-red-400' : 'text-emerald-400'}`}>{mode === 'manual' ? 'Modo Manual' : 'Modo Automático'}</p>
                        {mode === 'manual' && conv.attendedBy && <p className="text-[10px] text-slate-500">Atendida por: {conv.attendedBy}</p>}
                    </div>
                </div>

                {/* derivation info */}
                {conv.derivation && (
                    <Badge cls={DERIVATION[conv.derivation].cls}>
                        <span className={`w-1 h-1 rounded-full ${DERIVATION[conv.derivation].dot.split(' ')[0]}`} />
                        {DERIVATION[conv.derivation].label}
                    </Badge>
                )}
            </Glass>

            {/* acción ejecutada */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Acción ejecutada</p>
                <div className="space-y-1.5">
                    <div className="flex items-start gap-2 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                        <ArrowRight size={11} className="text-cyan-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300">{conv.context.action}</p>
                    </div>
                    {conv.context.cita && (
                        <div className="flex items-center gap-2 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                            <Clock size={11} className="text-amber-400 shrink-0" />
                            <p className="text-xs text-slate-300">Cita: {conv.context.cita}</p>
                        </div>
                    )}
                </div>
            </Glass>

            {/* historial */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Historial</p>
                <div className="space-y-2">
                    {conv.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <div className="flex flex-col items-center shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                {i < conv.history.length - 1 && <div className="w-px h-4 bg-slate-800 mt-0.5" />}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">{h.label}</p>
                                <p className="text-[10px] text-slate-600">{h.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Glass>

            {/* evaluación */}
            <Glass className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Evaluación del agente</p>
                <div className="flex gap-2 mb-3">
                    <button onClick={() => setRating('ok')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${rating === 'ok' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-slate-700/30 text-slate-500 hover:text-slate-300'}`}>
                        <ThumbsUp size={11} /> Adecuada
                    </button>
                    <button onClick={() => setRating('improve')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${rating === 'improve' ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-slate-700/30 text-slate-500 hover:text-slate-300'}`}>
                        <ThumbsDown size={11} /> Mejorar
                    </button>
                </div>
                {rating && (
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
                        className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600 resize-none transition-all"
                        placeholder="Comentario interno (opcional)..." style={{ animation: 'fadeSlideIn 0.2s ease-out' }} />
                )}
            </Glass>
        </div>
    );
};

/* ─────────────── Supervisor Bar ─────────────── */
const SupervisorBar = ({ conv }) => {
    const [note, setNote] = useState('');
    const [noteOpen, setNoteOpen] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [escalating, setEscalating] = useState(false);
    useEffect(() => { setNote(''); setNoteOpen(false); setResolved(false); }, [conv.id]);

    return (
        <div className="shrink-0 pt-2">
            <Glass className="px-5 py-3.5 flex items-center gap-3 flex-wrap">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mr-1">Supervisor:</p>
                <button onClick={() => setResolved(true)} disabled={resolved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${resolved ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/50'}`}>
                    <CheckCircle2 size={12} /> {resolved ? 'Resuelta' : 'Marcar resuelta'}
                </button>
                <button onClick={() => { setEscalating(true); setTimeout(() => setEscalating(false), 1500); }} disabled={escalating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-60">
                    <Flag size={12} className={escalating ? 'animate-bounce' : ''} /> {escalating ? 'Escalando...' : 'Escalar'}
                </button>
                <button onClick={() => setNoteOpen(o => !o)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${noteOpen ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-slate-700/40 text-slate-400 hover:text-white'}`}>
                    <StickyNote size={12} /> Nota interna
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700/40 text-slate-400 hover:text-white transition-all ml-auto">
                    <Download size={12} /> Exportar
                </button>
            </Glass>
            {noteOpen && (
                <div className="mt-2" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                    <Glass className="px-5 py-3 flex gap-3">
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                            className="flex-1 bg-slate-900/60 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder:text-slate-600 resize-none"
                            placeholder="Nota interna visible solo para el equipo..." />
                        <button className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all self-start">Guardar</button>
                    </Glass>
                </div>
            )}
        </div>
    );
};

/* ─────────────── MAIN ─────────────── */
const Conversations = () => {
    const [convs, setConvs] = useState(BASE_CONVERSATIONS);
    const [selected, setSelected] = useState(BASE_CONVERSATIONS[0]);
    const [modes, setModes] = useState({}); // { convId: 'auto' | 'manual' }

    const currentMode = modes[selected?.id] || 'auto';

    const handleSelect = c => setSelected(c);

    const handleTake = () => {
        const now = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        setModes(m => ({ ...m, [selected.id]: 'manual' }));
        setConvs(cs => cs.map(c => c.id === selected.id ? {
            ...c,
            attendedBy: 'Recepción',
            derivation: c.derivation || 'manual',
            history: [...c.history, { time: now, label: 'Recepción tomó conversación manualmente' }],
        } : c));
        setSelected(prev => ({
            ...prev,
            attendedBy: 'Recepción',
            derivation: prev.derivation || 'manual',
            history: [...prev.history, { time: now, label: 'Recepción tomó conversación manualmente' }],
        }));
    };

    const handleReturn = () => {
        const now = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        setModes(m => ({ ...m, [selected.id]: 'auto' }));
        setConvs(cs => cs.map(c => c.id === selected.id ? {
            ...c,
            attendedBy: null,
            history: [...c.history, { time: now, label: 'Agente IA retomó la conversación' }],
        } : c));
        setSelected(prev => ({
            ...prev,
            attendedBy: null,
            history: [...prev.history, { time: now, label: 'Agente IA retomó la conversación' }],
        }));
    };

    const urgentCount = convs.filter(c => c.urgencyLevel === 3).length;
    const activeCount = convs.filter(c => !c.derivation || c.derivation === 'manual').length;

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] gap-3">
            {/* header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Consola de Supervisión
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Sistema de atención híbrida — IA + supervisión humana</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" /> Agente activo
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 text-xs">
                        <Activity size={11} className="text-cyan-400" /> {activeCount} en curso
                    </span>
                    {urgentCount > 0 && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-pulse">
                            <AlertTriangle size={11} /> {urgentCount} urgencia{urgentCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* 3-zone */}
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
                <div className="col-span-3 min-h-0 overflow-hidden flex flex-col">
                    <ConvList convs={convs} selected={selected} onSelect={handleSelect} />
                </div>
                <div className="col-span-6 flex flex-col gap-3 min-h-0">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        {selected
                            ? <ChatZone conv={selected} mode={currentMode} onTake={handleTake} onReturn={handleReturn} />
                            : <div className="h-full flex items-center justify-center text-slate-600 text-sm">Selecciona una conversación</div>
                        }
                    </div>
                    {selected && <SupervisorBar conv={selected} />}
                </div>
                <div className="col-span-3 min-h-0 overflow-y-auto scrollbar-none">
                    {selected ? <ContextPanel conv={selected} mode={currentMode} /> : null}
                </div>
            </div>

            <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeBgIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUpIn   { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .scrollbar-none::-webkit-scrollbar { display:none; }
        .scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
        </div>
    );
};

export default Conversations;
