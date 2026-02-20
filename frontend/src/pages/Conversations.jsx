import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Send, Bot, User, AlertTriangle, Clock,
    CheckCircle2, Phone, MessageSquare, ArrowRight,
    UserCheck, Flag, Download, StickyNote, X,
    ChevronDown, Zap, Star, ThumbsUp, ThumbsDown,
    Activity, Shield, Filter, MoreHorizontal
} from 'lucide-react';

/* ─────────────── data ─────────────── */
const CONVERSATIONS = [
    {
        id: 1, name: 'María García', initials: 'MG',
        intent: 'Reprogramar cita', urgency: 'normal',
        status: 'active', channel: 'WhatsApp',
        time: 'hace 3 min',
        lastMsg: '¿Es posible cambiar la hora de mañana?',
        messages: [
            { id: 1, from: 'agent', text: 'Hola María, soy el asistente de Clínica Dental Dr. Medina. ¿En qué puedo ayudarte?', time: '14:28' },
            { id: 2, from: 'patient', text: 'Hola, tengo cita mañana a las 14:00 h pero me surgió algo.', time: '14:29' },
            { id: 3, from: 'agent', text: 'Entendido. ¿Qué horario te acomodaría mejor para reprogramar?', time: '14:30' },
            { id: 4, from: 'patient', text: '¿Es posible cambiar la hora de mañana? Preferiría la tarde.', time: '14:32' },
        ],
        context: {
            phone: '+56 9 8765 4321',
            reason: 'Reprogramar cita odontológica',
            treatment: 'Limpieza dental',
            action: 'Solicitud de cambio de cita',
            cita: 'Jue 21 Feb · 14:00 h',
        }
    },
    {
        id: 2, name: 'Carlos Vega', initials: 'CV',
        intent: 'Urgencia dental', urgency: 'urgent',
        status: 'derived', channel: 'WhatsApp',
        time: 'hace 12 min',
        lastMsg: 'Me duele mucho desde anoche',
        messages: [
            { id: 1, from: 'agent', text: 'Buen día Carlos. ¿Cuéntame en qué te puedo ayudar?', time: '14:05' },
            { id: 2, from: 'patient', text: 'Tengo un dolor muy fuerte en una muela desde anoche. Me duele mucho desde anoche.', time: '14:07' },
            { id: 3, from: 'agent', text: 'Entiendo. Por tratarse de una urgencia, estoy transfiriendo tu caso a un profesional.', time: '14:08' },
            { id: 4, from: 'human', text: 'Hola Carlos, habla el Dr. Medina. Cuéntame dónde exactamente te duele.', time: '14:10', label: 'Dr. Medina' },
        ],
        context: {
            phone: '+56 9 1234 5678',
            reason: 'Dolor molar agudo',
            treatment: 'Endodoncia (posible)',
            action: 'Derivación a profesional',
            cita: null,
        }
    },
    {
        id: 3, name: 'Ana Restrepo', initials: 'AR',
        intent: 'Consulta de precios', urgency: 'normal',
        status: 'resolved', channel: 'WhatsApp',
        time: 'hace 1 h',
        lastMsg: 'Muchas gracias, hasta luego.',
        messages: [
            { id: 1, from: 'patient', text: '¿Cuánto cuesta un blanqueamiento?', time: '13:15' },
            { id: 2, from: 'agent', text: 'El blanqueamiento dental profesional tiene un costo de $120.000. Incluye evaluación previa y kit de mantenimiento.', time: '13:15' },
            { id: 3, from: 'patient', text: 'Muchas gracias, hasta luego.', time: '13:16' },
        ],
        context: {
            phone: '+56 9 2233 4455',
            reason: 'Consulta de precios',
            treatment: 'Blanqueamiento dental',
            action: 'Información entregada',
            cita: null,
        }
    },
    {
        id: 4, name: 'Luis Morales', initials: 'LM',
        intent: 'Solicitud de cita', urgency: 'normal',
        status: 'attention', channel: 'WhatsApp',
        time: 'hace 8 min',
        lastMsg: 'No entiendo qué horarios tienen libre',
        messages: [
            { id: 1, from: 'patient', text: 'Hola, quiero agendar una cita para revisión.', time: '14:17' },
            { id: 2, from: 'agent', text: 'Con gusto te ayudo. ¿Tienes alguna preferencia de horario?', time: '14:17' },
            { id: 3, from: 'patient', text: 'No entiendo qué horarios tienen libre', time: '14:25' },
        ],
        context: {
            phone: '+56 9 9876 5432',
            reason: 'Agendar consulta de revisión',
            treatment: 'Revisión general',
            action: 'Agendamiento en proceso',
            cita: null,
        }
    },
    {
        id: 5, name: 'Sofía Díaz', initials: 'SD',
        intent: 'Consulta fuera de horario', urgency: 'normal',
        status: 'active', channel: 'WhatsApp',
        time: 'hace 22 h',
        lastMsg: '¿Están abiertos los sábados?',
        messages: [
            { id: 1, from: 'patient', text: '¿Están abiertos los sábados?', time: '20:15 ayer' },
            { id: 2, from: 'agent', text: 'Hola Sofía. Atendemos sábados de 10:00 a 14:00 h. ¿Te puedo ayudar con algo más?', time: '20:15 ayer' },
        ],
        context: {
            phone: '+56 9 5566 7788',
            reason: 'Consulta de horarios',
            treatment: null,
            action: 'Información entregada',
            cita: null,
        }
    },
];

const STATUS_CFG = {
    active: { label: 'Activa', dotCls: 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]', badgeCls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    derived: { label: 'Derivada', dotCls: 'bg-violet-400  shadow-[0_0_5px_rgba(167,139,250,0.8)]', badgeCls: 'bg-violet-500/10 border-violet-500/30 text-violet-400' },
    resolved: { label: 'Resuelta', dotCls: 'bg-slate-500', badgeCls: 'bg-slate-700/40 border-slate-600/30 text-slate-400' },
    attention: { label: 'Requiere atención', dotCls: 'bg-amber-400   animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)]', badgeCls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
};

const URGENCY_CFG = {
    normal: { label: 'Normal', cls: 'text-slate-400' },
    urgent: { label: '⚡ Urgente', cls: 'text-red-400 font-semibold' },
};

const FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Activas' },
    { id: 'attention', label: 'Requieren atención' },
    { id: 'derived', label: 'Derivadas' },
    { id: 'urgent', label: 'Urgencias' },
];

/* ─────────────── helpers ─────────────── */
const GlassPanel = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.03] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, cls }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cls}`}>{children}</span>
);

/* ─────────────── ZONA 1 — Conversation List ─────────────── */
const ConvList = ({ selected, onSelect }) => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = CONVERSATIONS.filter(c => {
        const matchFilter = filter === 'all' ? true : filter === 'urgent' ? c.urgency === 'urgent' : c.status === filter;
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.intent.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <GlassPanel className="flex flex-col overflow-hidden h-full">
            {/* header */}
            <div className="px-4 pt-5 pb-3 border-b border-slate-800/60 shrink-0">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Conversaciones</p>
                <div className="relative mb-3">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        type="text" placeholder="Buscar por nombre o intención..."
                        className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600 transition-all"
                    />
                </div>
                {/* filter pills — scrollable row */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    {FILTERS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${filter === f.id
                                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
                {filtered.length === 0 && (
                    <p className="text-xs text-slate-600 text-center py-10">Sin resultados</p>
                )}
                {filtered.map(c => {
                    const sCfg = STATUS_CFG[c.status];
                    const isSelected = selected?.id === c.id;
                    return (
                        <div
                            key={c.id}
                            onClick={() => onSelect(c)}
                            className={`px-4 py-3.5 cursor-pointer transition-all duration-200 relative ${isSelected ? 'bg-cyan-500/8 border-l-2 border-l-cyan-500' : 'border-l-2 border-l-transparent hover:bg-white/[0.02]'
                                } ${c.urgency === 'urgent' ? 'border-r-2 border-r-red-500/60' : ''}`}
                            style={{ animation: 'fadeSlideIn 0.15s ease-out' }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.urgency === 'urgent' ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-slate-600 to-slate-700'
                                        }`}>
                                        {c.initials}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-800/80 ${sCfg.dotCls}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{c.name}</p>
                                        <span className="text-xs text-slate-600 whitespace-nowrap shrink-0">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMsg}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        <span className="text-xs text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded-md">{c.intent}</span>
                                        <Badge cls={sCfg.badgeCls}><span className={`w-1 h-1 rounded-full ${sCfg.dotCls.split(' ')[0]}`} />{sCfg.label}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassPanel>
    );
};

/* ─────────────── ZONA 2 — Active Conversation ─────────────── */
const ChatZone = ({ conv, onManualToggle, manualMode }) => {
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState(conv.messages);
    const endRef = useRef(null);

    useEffect(() => { setMsgs(conv.messages); }, [conv.id]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    const send = e => {
        e.preventDefault();
        if (!input.trim()) return;
        setMsgs(m => [...m, { id: Date.now(), from: 'human', text: input, time: '15:06', label: 'Supervisor' }]);
        setInput('');
    };

    const sCfg = STATUS_CFG[conv.status];

    return (
        <GlassPanel className="flex flex-col overflow-hidden h-full">
            {/* context bar */}
            <div className="px-5 py-3.5 border-b border-slate-800/60 shrink-0 bg-slate-900/30">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${conv.urgency === 'urgent' ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                            }`}>
                            {conv.initials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{conv.name}</p>
                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><MessageSquare size={10} /> {conv.channel}</span>
                                <span className={`text-xs ${URGENCY_CFG[conv.urgency].cls}`}>{URGENCY_CFG[conv.urgency].label}</span>
                                <Badge cls={sCfg.badgeCls}><span className={`w-1 h-1 rounded-full ${sCfg.dotCls.split(' ')[0]}`} />{sCfg.label}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {manualMode ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 animate-pulse">
                                <UserCheck size={13} className="text-violet-400" />
                                <span className="text-xs font-semibold text-violet-400">Modo Manual Activo</span>
                            </div>
                        ) : null}
                        <button
                            onClick={() => onManualToggle(!manualMode)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${manualMode
                                    ? 'bg-slate-700/60 text-slate-400 hover:text-white'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/15'
                                }`}
                        >
                            <UserCheck size={13} /> {manualMode ? 'Regresar a IA' : 'Tomar conversación'}
                        </button>
                    </div>
                </div>
            </div>

            {/* intent banner */}
            <div className="px-5 py-2 border-b border-slate-800/40 bg-slate-900/20 shrink-0 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Activity size={11} className="text-cyan-400" /> Intención detectada:</span>
                <span className="font-medium text-slate-300">{conv.intent}</span>
                <span className="ml-auto">#{conv.id.toString().padStart(4, '0')}</span>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {msgs.map((m, i) => {
                    const isAgent = m.from === 'agent';
                    const isPatient = m.from === 'patient';
                    const isHuman = m.from === 'human';

                    return (
                        <div key={m.id} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                            <div className={`flex gap-2.5 max-w-[78%] ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* avatar */}
                                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${isAgent ? 'bg-slate-800 border border-cyan-500/40' :
                                        isHuman ? 'bg-violet-500/15 border border-violet-500/40' :
                                            'bg-slate-700'
                                    }`}>
                                    {isAgent ? <Bot size={13} className="text-cyan-400" /> :
                                        isHuman ? <UserCheck size={12} className="text-violet-400" /> :
                                            <User size={12} className="text-slate-300" />}
                                </div>

                                {/* bubble */}
                                <div>
                                    {(isAgent || isHuman) && (
                                        <p className={`text-xs mb-1 font-medium ${isHuman ? 'text-violet-400' : 'text-cyan-400'}`}>
                                            {isHuman ? (m.label || 'Supervisor') : 'Agente de IA'}
                                        </p>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isPatient ? 'bg-cyan-600/20 border border-cyan-500/20 text-slate-200 rounded-tr-sm' :
                                            isHuman ? 'bg-violet-500/10 border border-violet-500/20 text-slate-200 rounded-tl-sm' :
                                                'bg-slate-800/70 border border-slate-700/40 text-slate-300 rounded-tl-sm'
                                        }`}>
                                        {m.text}
                                    </div>
                                    <p className="text-[10px] text-slate-600 mt-1 px-1">{m.time}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {/* input */}
            {manualMode ? (
                <div className="px-5 py-4 border-t border-violet-500/15 bg-violet-500/5 shrink-0">
                    <form onSubmit={send} className="relative">
                        <input
                            type="text" value={input} onChange={e => setInput(e.target.value)}
                            className="w-full bg-slate-900/70 border border-violet-500/30 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 placeholder:text-slate-600 transition-all"
                            placeholder="Escribir como supervisor (modo manual activo)..."
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all">
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="px-5 py-4 border-t border-slate-800/60 bg-slate-900/20 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-600 justify-center py-1">
                        <Bot size={12} className="text-cyan-400" />
                        El agente está gestionando esta conversación. Haz clic en <strong className="text-slate-400">"Tomar conversación"</strong> para intervenir.
                    </div>
                </div>
            )}
        </GlassPanel>
    );
};

/* ─────────────── ZONA 3 — Context Panel ─────────────── */
const ContextPanel = ({ conv }) => {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [commentOpen, setCommentOpen] = useState(false);

    useEffect(() => { setRating(null); setComment(''); setCommentOpen(false); }, [conv.id]);

    const rows = [
        { label: 'Nombre', val: conv.name },
        { label: 'Teléfono', val: conv.context.phone },
        { label: 'Motivo', val: conv.context.reason },
        { label: 'Tratamiento', val: conv.context.treatment || 'No detectado' },
    ];

    const sCfg = STATUS_CFG[conv.status];

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
            {/* datos capturados */}
            <GlassPanel className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Datos capturados</p>
                <div className="space-y-2.5">
                    {rows.map(r => (
                        <div key={r.label}>
                            <p className="text-xs text-slate-600">{r.label}</p>
                            <p className="text-xs font-medium text-slate-300 mt-0.5">{r.val}</p>
                        </div>
                    ))}
                </div>
            </GlassPanel>

            {/* acción ejecutada */}
            <GlassPanel className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Acción ejecutada</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                        <ArrowRight size={12} className="text-cyan-400 shrink-0" />
                        <p className="text-xs text-slate-300">{conv.context.action}</p>
                    </div>
                    {conv.context.cita && (
                        <div className="flex items-center gap-2 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                            <Clock size={12} className="text-amber-400 shrink-0" />
                            <p className="text-xs text-slate-300">Cita: {conv.context.cita}</p>
                        </div>
                    )}
                    <div className="flex items-center gap-2 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                        <Activity size={12} className="text-slate-500 shrink-0" />
                        <p className="text-xs text-slate-400">Intención: {conv.intent}</p>
                    </div>
                </div>
            </GlassPanel>

            {/* evaluación */}
            <GlassPanel className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Evaluación del agente</p>
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => { setRating('ok'); setCommentOpen(false); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${rating === 'ok'
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                : 'border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600/50'
                            }`}
                    >
                        <ThumbsUp size={12} /> Adecuada
                    </button>
                    <button
                        onClick={() => { setRating('improve'); setCommentOpen(true); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${rating === 'improve'
                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                                : 'border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600/50'
                            }`}
                    >
                        <ThumbsDown size={12} /> Mejorar
                    </button>
                </div>
                {(commentOpen || rating === 'ok') && (
                    <div style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                        <textarea
                            value={comment} onChange={e => setComment(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600 resize-none transition-all"
                            placeholder="Comentario interno (opcional)..."
                        />
                    </div>
                )}
            </GlassPanel>

            {/* estado */}
            <GlassPanel className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Estado</p>
                <Badge cls={sCfg.badgeCls}><span className={`w-1.5 h-1.5 rounded-full ${sCfg.dotCls.split(' ')[0]}`} />{sCfg.label}</Badge>
                {conv.urgency === 'urgent' && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                        <AlertTriangle size={11} /> Caso urgente — derivado
                    </div>
                )}
            </GlassPanel>
        </div>
    );
};

/* ─────────────── Supervisor Actions bar ─────────────── */
const SupervisorBar = ({ conv }) => {
    const [note, setNote] = useState('');
    const [noteOpen, setNoteOpen] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [escalating, setEscalating] = useState(false);

    useEffect(() => { setNote(''); setNoteOpen(false); setResolved(false); }, [conv.id]);

    const resolve = () => { setResolved(true); };
    const escalate = () => { setEscalating(true); setTimeout(() => setEscalating(false), 1500); };

    return (
        <div className="shrink-0 pt-2">
            <GlassPanel className="px-5 py-3.5 flex items-center gap-3 flex-wrap">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mr-1">Supervisor:</p>

                <button
                    onClick={resolve}
                    disabled={resolved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${resolved
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/50'
                        }`}
                >
                    <CheckCircle2 size={12} className={resolved ? 'text-emerald-400' : ''} />
                    {resolved ? 'Resuelta' : 'Marcar resuelta'}
                </button>

                <button
                    onClick={escalate}
                    disabled={escalating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-60"
                >
                    <Flag size={12} className={escalating ? 'animate-bounce' : ''} />
                    {escalating ? 'Escalando...' : 'Escalar'}
                </button>

                <button
                    onClick={() => setNoteOpen(o => !o)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${noteOpen ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/50'
                        }`}
                >
                    <StickyNote size={12} /> Nota interna
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all ml-auto">
                    <Download size={12} /> Exportar
                </button>
            </GlassPanel>

            {noteOpen && (
                <div className="mt-2" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                    <GlassPanel className="px-5 py-3 flex gap-3">
                        <textarea
                            value={note} onChange={e => setNote(e.target.value)}
                            rows={2}
                            className="flex-1 bg-slate-900/60 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/40 placeholder:text-slate-600 resize-none transition-all"
                            placeholder="Nota interna visible solo para el equipo..."
                        />
                        <button className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all self-start">
                            Guardar
                        </button>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};

/* ─────────────── MAIN ─────────────── */
const Conversations = () => {
    const [selected, setSelected] = useState(CONVERSATIONS[0]);
    const [manual, setManual] = useState(false);

    const handleSelect = conv => {
        setSelected(conv);
        setManual(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
            {/* page header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Consola de Supervisión
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Monitoreo y control de conversaciones del Agente</p>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                        Agente activo
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400">
                        <Activity size={11} className="text-cyan-400" />
                        {CONVERSATIONS.filter(c => c.status === 'active' || c.status === 'attention').length} conversaciones en curso
                    </span>
                </div>
            </div>

            {/* 3-zone layout */}
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
                {/* ZONA 1 — left list */}
                <div className="col-span-3 min-h-0 overflow-hidden flex flex-col">
                    <ConvList selected={selected} onSelect={handleSelect} />
                </div>

                {/* ZONA 2 + bottom actions — center */}
                <div className="col-span-6 flex flex-col gap-3 min-h-0">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        {selected
                            ? <ChatZone conv={selected} manualMode={manual} onManualToggle={setManual} />
                            : <div className="h-full flex items-center justify-center text-slate-600 text-sm">Selecciona una conversación</div>
                        }
                    </div>
                    {selected && <SupervisorBar conv={selected} />}
                </div>

                {/* ZONA 3 — right context */}
                <div className="col-span-3 min-h-0 overflow-y-auto">
                    {selected
                        ? <ContextPanel conv={selected} />
                        : <div className="text-center text-slate-600 text-xs pt-10">Sin selección</div>
                    }
                </div>
            </div>

            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
};

export default Conversations;
