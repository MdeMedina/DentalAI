import React, { useState } from 'react';
import {
    Save, Bell, Users, Globe, Download, Database,
    RotateCcw, CheckCircle2, Plus, Trash2, Edit3,
    Clock, MessageSquare, Palette, Monitor, Sun,
    ChevronDown, ChevronRight, Info, AlertTriangle, X, Sliders
} from 'lucide-react';

/* ──────── shared primitives ──────── */
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

const FormInput = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-sm text-slate-400">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
        />
    </div>
);

const FormSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="text-sm text-slate-400">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full appearance-none bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/70 transition-all pr-9"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
    </div>
);

const Toggle = ({ checked, onChange, label, sub }) => (
    <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
            <p className="text-sm font-medium text-white">{label}</p>
            {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className="relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 mt-0.5"
            style={{ background: checked ? '#06b6d4' : '#334155' }}
        >
            <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
            />
        </button>
    </div>
);

const SaveButton = ({ onSave, saving, saved }) => (
    <button
        onClick={onSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-60 ${saved
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
            }`}
    >
        {saved ? <><CheckCircle2 size={15} /> Guardado</> : saving ? <><Save size={15} className="animate-pulse" /> Guardando...</> : <><Save size={15} /> Guardar cambios</>}
    </button>
);

const useSave = () => {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const trigger = () => {
        setSaving(true);
        setSaved(false);
        setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 900);
    };
    return { saving, saved, trigger };
};

/* ──────── BLOQUE 2 — General Info ──────── */
const BlockGeneral = () => {
    const [form, setForm] = useState({
        name: 'Clínica Dental Dr. Medina',
        address: 'Av. Providencia 1234, Santiago',
        phone: '+56 2 2345 6789',
        email: 'contacto@clinicamedina.cl',
        tz: 'America/Santiago',
        lang: 'es',
    });
    const { saving, saved, trigger } = useSave();
    const f = (k) => v => setForm(p => ({ ...p, [k]: v }));

    return (
        <GlassCard className="p-6 space-y-5 col-span-12 lg:col-span-6">
            <SectionTitle icon={Globe} title="Información General" sub="Datos de la clínica utilizados por el agente" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <FormInput label="Nombre de la clínica" value={form.name} onChange={f('name')} placeholder="Ej: Clínica Dental..." />
                </div>
                <div className="sm:col-span-2">
                    <FormInput label="Dirección" value={form.address} onChange={f('address')} placeholder="Calle, número, ciudad" />
                </div>
                <FormInput label="Teléfono principal" type="tel" value={form.phone} onChange={f('phone')} placeholder="+56 9..." />
                <FormInput label="Email de contacto" type="email" value={form.email} onChange={f('email')} placeholder="contacto@..." />
                <FormSelect label="Zona horaria" value={form.tz} onChange={f('tz')} options={[
                    { value: 'America/Santiago', label: 'Santiago (GMT-3)' },
                    { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
                    { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
                    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
                ]} />
                <FormSelect label="Idioma principal" value={form.lang} onChange={f('lang')} options={[
                    { value: 'es', label: 'Español' },
                    { value: 'en', label: 'English' },
                    { value: 'pt', label: 'Português' },
                ]} />
            </div>
            <div className="flex justify-end pt-2">
                <SaveButton onSave={trigger} saving={saving} saved={saved} />
            </div>
        </GlassCard>
    );
};

/* ──────── BLOQUE 3 — Schedule ──────── */
const DAYS = [
    { key: 'lun', label: 'Lunes' }, { key: 'mar', label: 'Martes' },
    { key: 'mie', label: 'Miércoles' }, { key: 'jue', label: 'Jueves' },
    { key: 'vie', label: 'Viernes' }, { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' },
];

const BlockSchedule = () => {
    const [schedule, setSchedule] = useState({
        lun: { open: '09:00', close: '18:00', closed: false },
        mar: { open: '09:00', close: '18:00', closed: false },
        mie: { open: '09:00', close: '18:00', closed: false },
        jue: { open: '09:00', close: '18:00', closed: false },
        vie: { open: '09:00', close: '17:00', closed: false },
        sab: { open: '10:00', close: '14:00', closed: false },
        dom: { open: '09:00', close: '18:00', closed: true },
    });
    const { saving, saved, trigger } = useSave();

    const update = (day, field, val) =>
        setSchedule(p => ({ ...p, [day]: { ...p[day], [field]: val } }));

    return (
        <GlassCard className="p-6 col-span-12 lg:col-span-6">
            <SectionTitle icon={Clock} iconColor="text-amber-400" title="Horarios Generales" sub="Referencia utilizada por el agente para informar disponibilidad" />
            <div className="space-y-2">
                {DAYS.map(d => {
                    const s = schedule[d.key];
                    return (
                        <div key={d.key} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${s.closed ? 'opacity-50 bg-slate-900/20' : 'hover:bg-white/[0.015]'}`}>
                            <span className="text-xs font-medium text-slate-300 w-20 shrink-0">{d.label}</span>
                            <input
                                type="time" value={s.open} disabled={s.closed}
                                onChange={e => update(d.key, 'open', e.target.value)}
                                className="bg-slate-900/60 border border-slate-700/40 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500/60 disabled:opacity-40 w-24"
                            />
                            <span className="text-slate-600 text-xs">—</span>
                            <input
                                type="time" value={s.close} disabled={s.closed}
                                onChange={e => update(d.key, 'close', e.target.value)}
                                className="bg-slate-900/60 border border-slate-700/40 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500/60 disabled:opacity-40 w-24"
                            />
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-xs text-slate-600">Cerrado</span>
                                <button
                                    onClick={() => update(d.key, 'closed', !s.closed)}
                                    className="relative w-8 h-4 rounded-full transition-colors duration-300 shrink-0"
                                    style={{ background: s.closed ? '#06b6d4' : '#334155' }}
                                >
                                    <span className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-300"
                                        style={{ transform: s.closed ? 'translateX(16px)' : 'translateX(0)' }} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end mt-4">
                <SaveButton onSave={trigger} saving={saving} saved={saved} />
            </div>
        </GlassCard>
    );
};

/* ──────── BLOQUE 4 — Notifications ──────── */
const BlockNotifications = () => {
    const [notifs, setNotifs] = useState({
        derive: true, error: true, daily: false,
    });
    const [email, setEmail] = useState('dr.medina@clinicamedina.cl');
    const [wa, setWa] = useState('');
    const { saving, saved, trigger } = useSave();

    return (
        <GlassCard className="p-6 col-span-12 space-y-5">
            <SectionTitle icon={Bell} iconColor="text-violet-400" title="Notificaciones" sub="Configura cómo y cuándo quieres recibir alertas del sistema" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Alertas activas</p>
                    <div className="space-y-4">
                        <Toggle checked={notifs.derive} onChange={v => setNotifs(p => ({ ...p, derive: v }))}
                            label="Derivación a humano"
                            sub="Recibir alerta cuando el agente transfiere a un responsable" />
                        <div className="h-px bg-slate-800/60" />
                        <Toggle checked={notifs.error} onChange={v => setNotifs(p => ({ ...p, error: v }))}
                            label="Error de integración"
                            sub="Notificar cuando una conexión externa falle o se interrumpa" />
                        <div className="h-px bg-slate-800/60" />
                        <Toggle checked={notifs.daily} onChange={v => setNotifs(p => ({ ...p, daily: v }))}
                            label="Resumen diario del agente"
                            sub="Recibir un reporte con las métricas del día al finalizar el horario" />
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Destino de notificaciones</p>
                    <FormInput label="Email de notificaciones" type="email" value={email} onChange={setEmail} placeholder="correo@clinica.cl" />
                    <FormInput label="WhatsApp interno (opcional)" type="tel" value={wa} onChange={setWa} placeholder="+56 9 ..." />
                    <p className="text-xs text-slate-600">Si ingresas un número WhatsApp recibirás las alertas más urgentes por ese canal.</p>
                </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-800/50">
                <SaveButton onSave={trigger} saving={saving} saved={saved} />
            </div>
        </GlassCard>
    );
};

/* ──────── BLOQUE 5 — Users ──────── */
const ROLES = ['Administrador', 'Supervisor', 'Recepción'];
const roleStyle = {
    'Administrador': 'bg-violet-500/10 border-violet-500/25 text-violet-400',
    'Supervisor': 'bg-blue-500/10   border-blue-500/25   text-blue-400',
    'Recepción': 'bg-slate-700/40  border-slate-600/30  text-slate-300',
};

const BlockUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Dr. Medina', role: 'Administrador', email: 'dr.medina@clinicamedina.cl', status: 'active' },
        { id: 2, name: 'Ana Reyes', role: 'Recepción', email: 'ana.reyes@clinicamedina.cl', status: 'active' },
        { id: 3, name: 'Carlos López', role: 'Supervisor', email: 'carlos.lopez@clinicamedina.cl', status: 'active' },
        { id: 4, name: 'Laura Soto', role: 'Recepción', email: 'laura.soto@clinicamedina.cl', status: 'inactive' },
    ]);
    const [editing, setEditing] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', role: 'Recepción', email: '' });
    const [deleting, setDeleting] = useState(null);

    const saveNew = () => {
        if (!newUser.name || !newUser.email) return;
        setUsers(u => [...u, { id: Date.now(), ...newUser, status: 'active' }]);
        setNewUser({ name: '', role: 'Recepción', email: '' });
        setAdding(false);
    };

    const confirmDelete = id => { setDeleting(id); setTimeout(() => { setUsers(u => u.filter(x => x.id !== id)); setDeleting(null); }, 700); };

    return (
        <GlassCard className="p-6 col-span-12">
            <div className="flex items-center justify-between mb-5">
                <SectionTitle icon={Users} iconColor="text-blue-400" title="Gestión de Usuarios" sub="Personas con acceso a la plataforma" />
                <button onClick={() => { setAdding(true); setEditing(null); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-medium transition-all shadow-md shadow-cyan-500/15 shrink-0">
                    <Plus size={13} /> Agregar usuario
                </button>
            </div>

            {/* Add form */}
            {adding && (
                <div className="mb-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/40 space-y-3" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                    <p className="text-xs font-semibold text-slate-400">Nuevo usuario</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormInput label="Nombre" value={newUser.name} onChange={v => setNewUser(p => ({ ...p, name: v }))} placeholder="Nombre completo" />
                        <FormInput label="Email" type="email" value={newUser.email} onChange={v => setNewUser(p => ({ ...p, email: v }))} placeholder="correo@..." />
                        <FormSelect label="Rol" value={newUser.role} onChange={v => setNewUser(p => ({ ...p, role: v }))} options={ROLES.map(r => ({ value: r, label: r }))} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all">Cancelar</button>
                        <button onClick={saveNew} className="px-4 py-1.5 rounded-lg text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all">Guardar</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Nombre', 'Rol', 'Email', 'Estado', ''].map(h => (
                                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4 last:pr-0">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {users.map(u => (
                            <tr
                                key={u.id}
                                className={`group transition-all ${deleting === u.id ? 'opacity-0 scale-95' : 'opacity-100'}`}
                                style={{ transition: 'opacity 0.4s, transform 0.4s' }}
                            >
                                <td className="py-3.5 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-semibold text-slate-300 shrink-0">
                                            {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                        </div>
                                        {editing === u.id ? (
                                            <input value={u.name} onChange={e => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, name: e.target.value } : x))}
                                                className="bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500/70 w-32" />
                                        ) : <span className="font-medium text-white text-sm">{u.name}</span>}
                                    </div>
                                </td>
                                <td className="py-3.5 pr-4">
                                    {editing === u.id ? (
                                        <select value={u.role} onChange={e => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: e.target.value } : x))}
                                            className="bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none w-32">
                                            {ROLES.map(r => <option key={r}>{r}</option>)}
                                        </select>
                                    ) : <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-xs font-medium ${roleStyle[u.role]}`}>{u.role}</span>}
                                </td>
                                <td className="py-3.5 pr-4 text-xs text-slate-400">{u.email}</td>
                                <td className="py-3.5 pr-4">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                                        {u.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="py-3.5">
                                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditing(editing === u.id ? null : u.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
                                            {editing === u.id ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Edit3 size={13} />}
                                        </button>
                                        <button onClick={() => confirmDelete(u.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
};

/* ──────── BLOQUE 6 — Operational params ──────── */
const BlockParams = () => {
    const [deriveTime, setDeriveTime] = useState('10');
    const [manualOk, setManualOk] = useState(true);
    const [confirmSensitive, setConfirmSensitive] = useState(true);
    const { saving, saved, trigger } = useSave();

    return (
        <GlassCard className="p-6 col-span-12 md:col-span-6 space-y-5">
            <SectionTitle icon={Sliders} iconColor="text-cyan-400" title="Parámetros Operativos" sub="Comportamiento del agente ante situaciones específicas" />
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Tiempo máximo antes de derivar conversación</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range" min="2" max="30" value={deriveTime}
                            onChange={e => setDeriveTime(e.target.value)}
                            className="flex-1 accent-cyan-400"
                        />
                        <span className="text-sm font-semibold text-cyan-400 w-16 text-right">{deriveTime} min</span>
                    </div>
                    <p className="text-xs text-slate-600">Si una conversación supera este tiempo sin resolverse, se notificará al responsable.</p>
                </div>
                <div className="h-px bg-slate-800/60" />
                <Toggle
                    checked={manualOk}
                    onChange={setManualOk}
                    label="Permitir intervención manual"
                    sub="El equipo puede intervenir en cualquier conversación activa sin necesidad de pausar el agente"
                />
                <div className="h-px bg-slate-800/60" />
                <Toggle
                    checked={confirmSensitive}
                    onChange={setConfirmSensitive}
                    label="Confirmar antes de acciones sensibles"
                    sub="El sistema pedirá confirmación antes de ejecutar cambios que afecten al agente o integraciones"
                />
            </div>
            <div className="flex justify-end pt-2">
                <SaveButton onSave={trigger} saving={saving} saved={saved} />
            </div>
        </GlassCard>
    );
};

/* ──────── BLOQUE 7 — Backup & Export ──────── */
const BlockBackup = () => {
    const [backing, setBacking] = useState(false);
    const [backDone, setBackDone] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [restoring, setRestoring] = useState(false);

    const runBak = () => { setBacking(true); setBackDone(false); setTimeout(() => { setBacking(false); setBackDone(true); setTimeout(() => setBackDone(false), 3000); }, 1800); };
    const runExport = () => { setExporting(true); setTimeout(() => setExporting(false), 1200); };
    const runRestore = () => { setRestoring(true); setTimeout(() => setRestoring(false), 1500); };

    return (
        <GlassCard className="p-6 col-span-12 md:col-span-6">
            <SectionTitle icon={Database} iconColor="text-emerald-400" title="Respaldo y Exportación" sub="Protección y portabilidad de la configuración" />
            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div>
                        <p className="text-sm font-medium text-white">Exportar configuración</p>
                        <p className="text-xs text-slate-500 mt-0.5">Descarga un archivo con todos los parámetros actuales</p>
                    </div>
                    <button onClick={runExport} disabled={exporting} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all disabled:opacity-50">
                        <Download size={13} className={exporting ? 'animate-bounce' : ''} /> {exporting ? 'Exportando...' : 'Exportar'}
                    </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div>
                        <p className="text-sm font-medium text-white">Generar respaldo</p>
                        <p className="text-xs text-slate-500 mt-0.5">Último respaldo automático: 19 Feb 2026 · 23:00</p>
                    </div>
                    {backDone ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                            <CheckCircle2 size={13} /> Completado
                        </span>
                    ) : (
                        <button onClick={runBak} disabled={backing} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-all disabled:opacity-50">
                            <Database size={13} className={backing ? 'animate-pulse' : ''} /> {backing ? 'Generando...' : 'Respaldar'}
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div>
                        <p className="text-sm font-medium text-white">Restaurar configuración previa</p>
                        <p className="text-xs text-slate-500 mt-0.5">Vuelve al estado anterior al último guardado</p>
                    </div>
                    <button onClick={runRestore} disabled={restoring} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-all disabled:opacity-50">
                        <RotateCcw size={13} className={restoring ? 'animate-spin' : ''} /> {restoring ? 'Restaurando...' : 'Restaurar'}
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

/* ──────── APARIENCIA — sub-page panel ──────── */
const ACCENT_COLORS = [
    { name: 'Cyan', from: '#06b6d4', to: '#3b82f6', id: 'cyan' },
    { name: 'Violeta', from: '#8b5cf6', to: '#6366f1', id: 'violet' },
    { name: 'Esmeralda', from: '#10b981', to: '#14b8a6', id: 'emerald' },
    { name: 'Rosa', from: '#f43f5e', to: '#ec4899', id: 'rose' },
    { name: 'Ámbar', from: '#f59e0b', to: '#f97316', id: 'amber' },
];

const AppearancePanel = ({ onClose }) => {
    const [density, setDensity] = useState('comfortable');
    const [accent, setAccent] = useState('cyan');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { saving, saved, trigger } = useSave();
    const currentAccent = ACCENT_COLORS.find(c => c.id === accent);

    return (
        <div
            className="fixed inset-0 z-50 flex"
            style={{ animation: 'panelBgIn 0.25s ease-out' }}
        >
            {/* dim overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* slide-over panel */}
            <div
                className="relative ml-auto w-full max-w-xl h-full bg-[#0f172a] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
                style={{ animation: 'panelSlideIn 0.3s cubic-bezier(0.32,0.72,0,1)' }}
            >
                {/* panel header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-800/70">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${currentAccent?.from}, ${currentAccent?.to})` }}>
                            <Palette size={15} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">Apariencia</h2>
                            <p className="text-xs text-slate-500">Personaliza la visual de la plataforma</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">

                    {/* color de acento */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Color de acento</p>
                        <div className="grid grid-cols-5 gap-3">
                            {ACCENT_COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setAccent(c.id)}
                                    className={`group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${accent === c.id
                                        ? 'border-white/30 bg-white/5'
                                        : 'border-slate-800 hover:border-slate-700 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-full transition-transform duration-200 ${accent === c.id ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}`}
                                        style={{
                                            background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                                            boxShadow: accent === c.id ? `0 0 16px ${c.from}70` : 'none',
                                        }}
                                    />
                                    <span className={`text-xs font-medium transition-colors ${accent === c.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{c.name}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600">El color seleccionado se aplicará en botones, tabs activos e indicadores del panel.</p>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    {/* densidad */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Densidad de información</p>
                        <div className="space-y-2">
                            {[
                                { v: 'compact', l: 'Compacto', s: 'Más información por pantalla' },
                                { v: 'comfortable', l: 'Cómodo', s: 'Espaciado equilibrado (recomendado)' },
                                { v: 'spacious', l: 'Amplio', s: 'Mayor espacio entre elementos' },
                            ].map(opt => (
                                <button
                                    key={opt.v}
                                    onClick={() => setDensity(opt.v)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all ${density === opt.v
                                        ? 'border-cyan-500/30 bg-cyan-500/5'
                                        : 'border-slate-800 hover:border-slate-700 hover:bg-white/[0.015]'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${density === opt.v ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'border-slate-600'}`} />
                                    <div>
                                        <p className={`text-sm font-medium ${density === opt.v ? 'text-white' : 'text-slate-400'}`}>{opt.l}</p>
                                        <p className="text-xs text-slate-600">{opt.s}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    {/* interfaz */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Interfaz</p>
                        <div className="space-y-4">
                            <Toggle
                                checked={sidebarCollapsed}
                                onChange={setSidebarCollapsed}
                                label="Sidebar minimizado por defecto"
                                sub="El panel lateral se mostrará colapsado al iniciar sesión"
                            />
                            <div className="h-px bg-slate-800/60" />
                            <div className="flex items-center gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                                <Monitor size={15} className="text-slate-400 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Modo oscuro</p>
                                    <p className="text-xs text-slate-600">Activo por defecto en todo el sistema</p>
                                </div>
                                <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">Predeterminado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="px-7 py-4 border-t border-slate-800/70 flex items-center justify-between">
                    <button onClick={onClose} className="text-sm text-slate-500 hover:text-white transition-colors">Cancelar</button>
                    <SaveButton onSave={() => { trigger(); setTimeout(onClose, 1600); }} saving={saving} saved={saved} />
                </div>
            </div>
        </div>
    );
};

/* compact entry button rendered inside the main grid */
const AppearanceEntryButton = ({ onClick }) => (
    <GlassCard className="col-span-12 hover:border-white/[0.12] transition-all duration-300">
        <button
            onClick={onClick}
            className="w-full flex items-center gap-5 px-6 py-5 group"
        >
            {/* icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
                <Palette size={18} className="text-white" />
            </div>

            {/* text */}
            <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white">Apariencia</p>
                <p className="text-xs text-slate-500 mt-0.5">Personaliza el color de acento, densidad y preferencias visuales de la plataforma</p>
            </div>

            {/* preview dots */}
            <div className="flex gap-1.5 shrink-0">
                {ACCENT_COLORS.map(c => (
                    <div key={c.id} className="w-4 h-4 rounded-full transition-transform duration-200 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} />
                ))}
            </div>

            <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
    </GlassCard>
);

/* ──────────────── MAIN ──────────────── */
const Settings = () => {
    const [showAppearance, setShowAppearance] = useState(false);

    return (
        <div className="space-y-8">

            {/* BLOQUE 1 — Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                    Configuración
                </h1>
                <p className="text-slate-400 text-sm mt-1.5">Información general y parámetros operativos</p>
            </div>

            {/* Grid principal */}
            <div className="grid grid-cols-12 gap-6">
                <BlockGeneral />
                <BlockSchedule />
                <BlockNotifications />
                <BlockUsers />
                <BlockParams />
                <BlockBackup />
                <AppearanceEntryButton onClick={() => setShowAppearance(true)} />
            </div>

            {/* Appearance slide-over */}
            {showAppearance && <AppearancePanel onClose={() => setShowAppearance(false)} />}

            <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes panelSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes panelBgIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>
        </div>
    );
};

export default Settings;
