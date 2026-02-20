import React, { useState, useRef, useEffect } from 'react';
import {
    Power, PowerOff, Settings, MessageSquare, Stethoscope,
    FlaskConical, History, Clock, User, ChevronRight,
    Plus, Trash2, Save, Send, RotateCcw, CheckCircle2,
    AlertCircle, Smile, Frown, Zap, ShieldCheck, FileText,
    ChevronDown, X, Edit3
} from 'lucide-react';

/* ─────────────────────────── helpers ─────────────────────────── */
const GlassCard = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`rounded-2xl border border-white/10 backdrop-blur-sm bg-white/[0.04] shadow-xl shadow-black/20 ${className}`}
        style={{ transition: 'border-color 0.25s, box-shadow 0.25s' }}
    >
        {children}
    </div>
);

const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <div
                className="w-11 h-6 rounded-full transition-colors duration-300"
                style={{ background: checked ? '#06b6d4' : '#334155' }}
            />
            <div
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
            />
        </div>
        {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
);

const SliderToggle = ({ options, value, onChange }) => (
    <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl">
        {options.map(opt => (
            <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${value === opt.value
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                    }`}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

const SectionLabel = ({ children }) => (
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{children}</p>
);

const FormInput = ({ label, value, onChange, placeholder, multiline = false, rows = 3 }) => (
    <div className="space-y-2">
        {label && <label className="text-sm text-slate-400">{label}</label>}
        {multiline ? (
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none placeholder:text-slate-600"
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
            />
        )}
    </div>
);

const MiniChatPreview = ({ message }) => (
    <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/40">
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <MessageSquare size={11} /> Vista previa
        </p>
        <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">A</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/60 rounded-xl rounded-tl-none px-3 py-2 max-w-xs">
                {message || <span className="text-slate-600 italic">Escribe un mensaje para ver la vista previa...</span>}
            </p>
        </div>
    </div>
);

/* ─────────────────────────── TAB 1 ─────────────────────────── */
const TabGeneral = () => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const [activeDays, setActiveDays] = useState(['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');
    const [offHours, setOffHours] = useState(false);
    const [welcome, setWelcome] = useState('¡Hola! Bienvenido/a a la clínica. ¿En qué puedo ayudarte hoy?');
    const [offMsg, setOffMsg] = useState('Gracias por escribir. Actualmente estamos fuera de horario. Te responderemos a la brevedad.');
    const [responsible, setResponsible] = useState('Dr. Medina');
    const [deriveMsg, setDeriveMsg] = useState('Te estoy conectando con un especialista que podrá ayudarte mejor.');
    const [saved, setSaved] = useState(false);

    const toggleDay = d => setActiveDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Horario */}
                <GlassCard className="p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-cyan-400" />
                        <h3 className="text-base font-semibold text-white">Horario de Funcionamiento</h3>
                    </div>
                    <div>
                        <SectionLabel>Días activos</SectionLabel>
                        <div className="flex gap-2 flex-wrap">
                            {days.map(d => (
                                <button
                                    key={d}
                                    onClick={() => toggleDay(d)}
                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${activeDays.includes(d)
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Apertura</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/70 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Cierre</label>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/70 transition-all" />
                        </div>
                    </div>
                    <Toggle checked={offHours} onChange={() => setOffHours(!offHours)} label="Responder fuera de horario" />
                </GlassCard>

                {/* Mensaje de Bienvenida */}
                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <MessageSquare size={16} className="text-cyan-400" />
                        <h3 className="text-base font-semibold text-white">Mensaje de Bienvenida</h3>
                    </div>
                    <FormInput value={welcome} onChange={setWelcome} placeholder="Escribe el mensaje..." multiline rows={3} />
                    <MiniChatPreview message={welcome} />
                </GlassCard>

                {/* Mensaje Fuera de Horario */}
                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-amber-400" />
                        <h3 className="text-base font-semibold text-white">Mensaje Fuera de Horario</h3>
                    </div>
                    <FormInput value={offMsg} onChange={setOffMsg} placeholder="Mensaje cuando no hay atención..." multiline rows={3} />
                    <MiniChatPreview message={offMsg} />
                </GlassCard>

                {/* Derivación Humana */}
                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-purple-400" />
                        <h3 className="text-base font-semibold text-white">Derivación Humana</h3>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Responsable</label>
                        <select
                            value={responsible}
                            onChange={e => setResponsible(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/70 transition-all appearance-none"
                        >
                            <option>Dr. Medina</option>
                            <option>Recepción</option>
                            <option>Administración</option>
                        </select>
                    </div>
                    <FormInput label="Mensaje automático al derivar" value={deriveMsg} onChange={setDeriveMsg} placeholder="Ej: Te estoy conectando con un especialista..." multiline rows={2} />
                </GlassCard>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${saved
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                        }`}
                >
                    {saved ? <><CheckCircle2 size={16} /> Guardado</> : <><Save size={16} /> Guardar cambios</>}
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────── TAB 2 ─────────────────────────── */
const TabComportamiento = () => {
    const [tone, setTone] = useState('cercano');
    const [detail, setDetail] = useState('breve');
    const [emojis, setEmojis] = useState(true);
    const [urgencyDetect, setUrgencyDetect] = useState(true);
    const [urgencyDerive, setUrgencyDerive] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <GlassCard className="p-6 space-y-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <MessageSquare size={16} className="text-cyan-400" /> Estilo de comunicación
                </h3>

                <div className="space-y-3">
                    <SectionLabel>Tono del agente</SectionLabel>
                    <SliderToggle
                        options={[{ label: 'Formal', value: 'formal' }, { label: 'Equilibrado', value: 'equilibrado' }, { label: 'Cercano', value: 'cercano' }]}
                        value={tone}
                        onChange={setTone}
                    />
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {tone === 'formal' && 'El agente usa un lenguaje respetuoso y estructurado, ideal para contextos muy profesionales.'}
                        {tone === 'equilibrado' && 'El agente combina profesionalismo con calidez, adaptándose al paciente.'}
                        {tone === 'cercano' && 'El agente se expresa de manera amigable y empática, generando confianza.'}
                    </p>
                </div>

                <div className="w-full h-px bg-slate-700/40" />

                <div className="space-y-3">
                    <SectionLabel>Nivel de detalle en las respuestas</SectionLabel>
                    <SliderToggle
                        options={[{ label: 'Breves', value: 'breve' }, { label: 'Equilibradas', value: 'equilibrado' }, { label: 'Detalladas', value: 'detallado' }]}
                        value={detail}
                        onChange={setDetail}
                    />
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {detail === 'breve' && 'Respuestas cortas y al punto. Ideal para consultas rápidas.'}
                        {detail === 'equilibrado' && 'Detalle moderado con la información justa y necesaria.'}
                        {detail === 'detallado' && 'Respuestas completas con contexto, pasos y alternativas.'}
                    </p>
                </div>

                <div className="w-full h-px bg-slate-700/40" />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white flex items-center gap-2"><Smile size={15} className="text-yellow-400" /> Uso de emojis</p>
                        <p className="text-xs text-slate-500 mt-1">El agente podrá usar emojis para hacer la conversación más amigable</p>
                    </div>
                    <Toggle checked={emojis} onChange={() => setEmojis(!emojis)} />
                </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-5">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Zap size={16} className="text-red-400" /> Manejo de urgencias
                </h3>

                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white">Detectar palabras de urgencia</p>
                            <p className="text-xs text-slate-500 mt-1">El agente reconoce situaciones urgentes (dolor intenso, emergencia, accidente dental)</p>
                        </div>
                        <Toggle checked={urgencyDetect} onChange={() => setUrgencyDetect(!urgencyDetect)} />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white">Derivar automáticamente en urgencias</p>
                            <p className="text-xs text-slate-500 mt-1">Cuando se detecta una urgencia, el agente notifica al responsable inmediatamente</p>
                        </div>
                        <Toggle checked={urgencyDerive} onChange={() => setUrgencyDerive(!urgencyDerive)} />
                    </div>
                </div>
            </GlassCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${saved
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                        }`}
                >
                    {saved ? <><CheckCircle2 size={16} /> Guardado</> : <><Save size={16} /> Guardar cambios</>}
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────── TAB 3 ─────────────────────────── */
const TabClinica = () => {
    const [treatments, setTreatments] = useState([
        { id: 1, name: 'Ortodoncia', desc: 'Corrección de la alineación dental', duration: '18-24 meses', price: 'Desde $800.000' },
        { id: 2, name: 'Blanqueamiento', desc: 'Aclaramiento estético del esmalte dental', duration: '1 sesión', price: 'Desde $120.000' },
        { id: 3, name: 'Limpieza Profunda', desc: 'Eliminación de sarro y placa bacteriana', duration: '45-60 min', price: 'Desde $45.000' },
    ]);
    const [faqs, setFaqs] = useState([
        { id: 1, q: '¿Cuánto dura una consulta inicial?', a: 'La consulta inicial tiene una duración aproximada de 30 a 45 minutos.' },
        { id: 2, q: '¿Aceptan convenios de salud?', a: 'Sí, trabajamos con Fonasa e Isapres.' },
    ]);
    const [policies, setPolicies] = useState({
        cancel: 'Las cancelaciones deben realizarse con al menos 24 horas de anticipación.',
        warranty: 'Ofrecemos garantía de 6 meses en tratamientos restauradores.',
        payment: 'Aceptamos efectivo, tarjeta de débito/crédito y transferencia bancaria.',
    });
    const [editingTx, setEditingTx] = useState(null);
    const [saved, setSaved] = useState(false);

    const addTreatment = () => {
        const newT = { id: Date.now(), name: '', desc: '', duration: '', price: '' };
        setTreatments([...treatments, newT]);
        setEditingTx(newT.id);
    };

    const updateTreatment = (id, field, val) =>
        setTreatments(treatments.map(t => t.id === id ? { ...t, [field]: val } : t));

    const deleteTreatment = id => setTreatments(treatments.filter(t => t.id !== id));

    const addFaq = () => setFaqs([...faqs, { id: Date.now(), q: '', a: '' }]);
    const updateFaq = (id, field, val) => setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: val } : f));
    const deleteFaq = id => setFaqs(faqs.filter(f => f.id !== id));

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="space-y-6">
            {/* Tratamientos */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Stethoscope size={16} className="text-cyan-400" /> Tratamientos
                    </h3>
                    <button onClick={addTreatment} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
                        <Plus size={13} /> Agregar
                    </button>
                </div>

                <div className="space-y-3">
                    {treatments.map(t => (
                        <div key={t.id} className="bg-slate-900/40 rounded-xl border border-slate-700/40 overflow-hidden">
                            {editingTx === t.id ? (
                                <div className="p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormInput label="Nombre" value={t.name} onChange={v => updateTreatment(t.id, 'name', v)} placeholder="Ej: Ortodoncia" />
                                        <FormInput label="Duración" value={t.duration} onChange={v => updateTreatment(t.id, 'duration', v)} placeholder="Ej: 18 meses" />
                                    </div>
                                    <FormInput label="Descripción" value={t.desc} onChange={v => updateTreatment(t.id, 'desc', v)} placeholder="Descripción del tratamiento" />
                                    <FormInput label="Precio (opcional)" value={t.price} onChange={v => updateTreatment(t.id, 'price', v)} placeholder="Ej: Desde $80.000" />
                                    <div className="flex justify-end gap-2 pt-1">
                                        <button onClick={() => setEditingTx(null)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">Listo</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 p-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white text-sm truncate">{t.name || <span className="text-slate-600">Sin nombre</span>}</p>
                                        <p className="text-xs text-slate-500 truncate">{t.desc}</p>
                                    </div>
                                    {t.duration && <span className="text-xs text-slate-500 shrink-0">{t.duration}</span>}
                                    {t.price && <span className="text-xs text-cyan-400 shrink-0 font-medium">{t.price}</span>}
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => setEditingTx(t.id)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-all"><Edit3 size={13} /></button>
                                        <button onClick={() => deleteTreatment(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Preguntas Frecuentes */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <MessageSquare size={16} className="text-purple-400" /> Preguntas Frecuentes
                    </h3>
                    <button onClick={addFaq} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
                        <Plus size={13} /> Agregar
                    </button>
                </div>
                <div className="space-y-3">
                    {faqs.map(f => (
                        <div key={f.id} className="bg-slate-900/40 rounded-xl border border-slate-700/40 p-4 space-y-3">
                            <div className="flex gap-2">
                                <FormInput value={f.q} onChange={v => updateFaq(f.id, 'q', v)} placeholder="Pregunta..." />
                                <button onClick={() => deleteFaq(f.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all shrink-0 mt-auto"><Trash2 size={14} /></button>
                            </div>
                            <FormInput value={f.a} onChange={v => updateFaq(f.id, 'a', v)} placeholder="Respuesta..." multiline rows={2} />
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Políticas */}
            <GlassCard className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-emerald-400" /> Políticas de la clínica
                </h3>
                <FormInput label="Política de cancelaciones" value={policies.cancel} onChange={v => setPolicies({ ...policies, cancel: v })} placeholder="Ej: 24 horas de anticipación..." multiline rows={2} />
                <FormInput label="Garantías" value={policies.warranty} onChange={v => setPolicies({ ...policies, warranty: v })} placeholder="Ej: Garantía de 6 meses en tratamientos..." multiline rows={2} />
                <FormInput label="Métodos de pago" value={policies.payment} onChange={v => setPolicies({ ...policies, payment: v })} placeholder="Ej: Efectivo, tarjeta, transferencia..." multiline rows={2} />
            </GlassCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${saved
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                        }`}
                >
                    {saved ? <><CheckCircle2 size={16} /> Guardado</> : <><Save size={16} /> Guardar cambios</>}
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────── TAB 4 ─────────────────────────── */
const SimMessage = ({ role, text, isTyping }) => {
    const isAgent = role === 'agent';
    return (
        <div className={`flex items-end gap-2 ${isAgent ? '' : 'flex-row-reverse'}`}>
            {isAgent && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                </div>
            )}
            <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${isAgent
                    ? 'bg-slate-800/80 text-slate-200 rounded-bl-md'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                    }`}
            >
                {isTyping ? (
                    <div className="flex gap-1 items-center py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : text}
            </div>
        </div>
    );
};

const TabSimulador = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'agent', text: '¡Hola! Bienvenido/a a la clínica. ¿En qué puedo ayudarte hoy? 😊' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    const agentReplies = [
        'Por supuesto, con gusto te ayudo con eso. ¿Me puedes dar más detalles?',
        'Entendido. Podemos agendarte una cita esta semana. ¿Cuál horario te acomoda mejor?',
        'Gracias por tu consulta. En la clínica ofrecemos ese tratamiento con resultados excelentes.',
        'Te recomiendo pasar por una evaluación inicial para que el Doctor pueda orientarte mejor. ¿Te gustaría agendar?',
        '¡Perfecto! Ya tengo tu información. Nuestro equipo se pondrá en contacto contigo pronto.',
    ];

    const urgencyReplies = [
        '⚠️ Entiendo que estás sintiendo mucho dolor. Voy a notificar a nuestro equipo de urgencias de inmediato para que te atiendan lo antes posible.',
    ];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text, isUrgency = false) => {
        if (!text.trim()) return;
        const userMsg = { id: Date.now(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const reply = isUrgency
                ? urgencyReplies[0]
                : agentReplies[Math.floor(Math.random() * agentReplies.length)];
            setMessages(prev => [...prev, { id: Date.now(), role: 'agent', text: reply }]);
        }, 1600);
    };

    const testUrgency = () => sendMessage('Tengo un dolor muy fuerte en la muela y no puedo dormir, es una emergencia', true);

    return (
        <div className="max-w-2xl">
            <GlassCard className="overflow-hidden">
                {/* Chat header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-slate-900/30">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">Agente de Atención</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            <p className="text-xs text-emerald-400">En línea</p>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-medium">Modo simulación</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
                    {messages.map(m => <SimMessage key={m.id} role={m.role} text={m.text} />)}
                    {isTyping && <SimMessage role="agent" isTyping />}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-4 border-t border-white/5 bg-slate-900/20">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Escribe como si fueras un paciente..."
                            className="flex-1 bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/70 transition-all placeholder:text-slate-600"
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || isTyping}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 flex items-center justify-center disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
                        >
                            <Send size={16} className="text-white" />
                        </button>
                    </div>
                </div>
            </GlassCard>

            <button
                onClick={testUrgency}
                disabled={isTyping}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-300 disabled:opacity-40"
            >
                <Zap size={15} /> Probar escenario de urgencia
            </button>

            <p className="text-xs text-slate-600 text-center mt-3">Este simulador no afecta la configuración real del agente.</p>
        </div>
    );
};

/* ─────────────────────────── TAB 5 ─────────────────────────── */
const TabVersiones = () => {
    const versions = [
        { id: 'v3', label: 'Versión 3', date: '19 Feb 2026 · 14:32', changes: ['Actualización de mensaje de bienvenida', 'Nuevo tratamiento: Carillas'], current: true },
        { id: 'v2', label: 'Versión 2', date: '15 Feb 2026 · 10:05', changes: ['Ajuste de tono: Cercano', 'Añadidas políticas de cancelación'], current: false },
        { id: 'v1', label: 'Versión 1', date: '10 Feb 2026 · 08:50', changes: ['Configuración inicial del agente', 'Horario y mensajes base'], current: false },
    ];
    const [restoring, setRestoring] = useState(null);
    const [restored, setRestored] = useState(null);

    const restore = id => {
        setRestoring(id);
        setTimeout(() => {
            setRestoring(null);
            setRestored(id);
            setTimeout(() => setRestored(null), 3000);
        }, 1200);
    };

    return (
        <div className="space-y-4 max-w-2xl">
            {versions.map(v => (
                <GlassCard key={v.id} className={`p-5 transition-all duration-300 ${v.current ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.08)]' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white text-sm">{v.label}</h3>
                                {v.current && (
                                    <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full font-medium">Actual</span>
                                )}
                                {restored === v.id && (
                                    <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Restaurada
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mb-3">{v.date}</p>
                            <ul className="space-y-1">
                                {v.changes.map((c, i) => (
                                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                        <ChevronRight size={11} className="text-slate-600 shrink-0" /> {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {!v.current && (
                            <button
                                onClick={() => restore(v.id)}
                                disabled={restoring === v.id}
                                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0 disabled:opacity-60"
                            >
                                <RotateCcw size={12} className={restoring === v.id ? 'animate-spin' : ''} />
                                {restoring === v.id ? 'Restaurando...' : 'Restaurar'}
                            </button>
                        )}
                    </div>
                </GlassCard>
            ))}

            <p className="text-xs text-slate-600 text-center pt-2">
                Al restaurar una versión anterior, la configuración actual se guardará automáticamente.
            </p>
        </div>
    );
};

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
const TABS = [
    { id: 'general', label: 'Configuración General', icon: Settings },
    { id: 'comportamiento', label: 'Cómo Responde', icon: MessageSquare },
    { id: 'clinica', label: 'Información Clínica', icon: Stethoscope },
    { id: 'simulador', label: 'Simulador', icon: FlaskConical },
    { id: 'versiones', label: 'Versiones', icon: History },
];

const AgentControl = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [agentActive, setAgentActive] = useState(true);
    const [toggling, setToggling] = useState(false);

    const handleToggleAgent = () => {
        setToggling(true);
        setTimeout(() => {
            setAgentActive(prev => !prev);
            setToggling(false);
        }, 700);
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'general': return <TabGeneral />;
            case 'comportamiento': return <TabComportamiento />;
            case 'clinica': return <TabClinica />;
            case 'simulador': return <TabSimulador />;
            case 'versiones': return <TabVersiones />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* BLOQUE 1 — header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Agente de Atención
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Configuración y comportamiento del agente</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    {/* Status indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-500 ${agentActive
                        ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400'
                        : 'border-red-500/30 bg-red-500/8 text-red-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${agentActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                            : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]'
                            } ${toggling ? 'opacity-30' : ''}`} />
                        <span>{toggling ? '...' : agentActive ? 'Activo' : 'Pausado'}</span>
                    </div>

                    {/* Toggle button */}
                    <button
                        onClick={handleToggleAgent}
                        disabled={toggling}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-60 shadow-lg ${agentActive
                            ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 shadow-red-500/10'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
                            }`}
                    >
                        {agentActive ? <PowerOff size={16} /> : <Power size={16} />}
                        {agentActive ? 'Pausar Agente' : 'Activar Agente'}
                    </button>
                </div>
            </div>

            {/* BLOQUE 2 — tabs */}
            <div className="border-b border-slate-700/50">
                <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
                    {TABS.map(t => {
                        const Icon = t.icon;
                        const active = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-200 border-b-2 ${active
                                    ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                                    : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-white/3'
                                    }`}
                            >
                                <Icon size={15} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div
                key={activeTab}
                style={{ animation: 'fadeSlideIn 0.25s ease-out' }}
            >
                {renderTab()}
            </div>

            {/* micro-animation keyframes injected inline */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
        </div>
    );
};

export default AgentControl;
