import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, TrendingDown, Clock, Shield, Users,
    Lightbulb, BarChart2, Flame, ChevronDown, Info,
    ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';

/* ─────────── helpers ─────────── */
const GlassCard = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-white/[0.07] backdrop-blur-sm bg-white/[0.035] shadow-xl shadow-black/20 ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ children, sub }) => (
    <div className="mb-5">
        <h2 className="text-base font-semibold text-white">{children}</h2>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
);

const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center">
        <Info size={13} className="text-slate-600 hover:text-slate-400 cursor-help transition-colors ml-1.5" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-normal text-center">
            {text}
        </div>
    </div>
);

/* time range selector */
const RANGES = ['Hoy', 'Últimos 7 días', 'Últimos 30 días'];

/* ────────── KPI DATA per range ────────── */
const kpiData = {
    'Hoy': {
        containment: { value: 82, trend: 4.1, up: true },
        response: { value: 3.2, trend: -0.4, up: true },   // lower is better
        offHours: { value: 7, trend: 2, up: true },
        deriv: { value: 3, trend: -1, up: true },
    },
    'Últimos 7 días': {
        containment: { value: 78, trend: 2.3, up: true },
        response: { value: 3.8, trend: 0.2, up: false },
        offHours: { value: 41, trend: 8, up: true },
        deriv: { value: 19, trend: -3, up: true },
    },
    'Últimos 30 días': {
        containment: { value: 74, trend: -1.2, up: false },
        response: { value: 4.1, trend: 0.5, up: false },
        offHours: { value: 163, trend: 34, up: true },
        deriv: { value: 78, trend: 5, up: false },
    },
};

/* ────────── trend line data ────────── */
const trendData = {
    'Conversaciones': {
        'Hoy': [12, 19, 14, 22, 18, 25, 23, 30, 27, 35, 31, 28],
        'Últimos 7 días': [120, 145, 132, 168, 155, 189, 174],
        'Últimos 30 días': [350, 410, 390, 480, 460, 520, 490, 570, 540, 610, 580, 650, 620, 700, 680, 750, 720, 790, 760, 830, 800, 870, 840, 910, 880, 950, 920, 990, 960, 1020],
    },
    '% Contención': {
        'Hoy': [70, 72, 68, 75, 74, 78, 76, 80, 79, 82, 81, 82],
        'Últimos 7 días': [72, 74, 71, 76, 75, 79, 78],
        'Últimos 30 días': [65, 67, 64, 69, 68, 72, 70, 74, 73, 77, 75, 78, 77, 80, 79, 81, 80, 82, 81, 83, 82, 84, 83, 85, 84, 85, 84, 86, 85, 86],
    },
    'Derivaciones': {
        'Hoy': [2, 1, 3, 2, 4, 3, 2, 1, 3, 2, 2, 3],
        'Últimos 7 días': [18, 22, 15, 19, 23, 17, 19],
        'Últimos 30 días': [20, 25, 18, 28, 24, 32, 27, 35, 30, 38, 33, 40, 36, 43, 39, 45, 42, 47, 44, 48, 46, 49, 47, 50, 48, 50, 48, 51, 49, 52],
    },
};

/* ────────── KPI CARD ────────── */
const AnimatedNumber = ({ target, suffix = '' }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        let start = 0;
        const step = target / 30;
        clearInterval(ref.current);
        ref.current = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(ref.current); }
            else setVal(Math.round(start * 10) / 10);
        }, 20);
        return () => clearInterval(ref.current);
    }, [target]);

    return <span>{typeof target === 'number' && !Number.isInteger(target) ? val.toFixed(1) : val}{suffix}</span>;
};

const KpiCard = ({ icon: Icon, color, title, tooltip, value, suffix, trend, trendUp, sub, invertTrend }) => {
    const positive = invertTrend ? !trendUp : trendUp;
    return (
        <GlassCard className="p-5 flex flex-col gap-3 hover:border-white/[0.12] transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">{title}</span>
                    <Tooltip text={tooltip} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                    {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {trend > 0 ? '+' : ''}{trend}
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-white tracking-tight">
                    <AnimatedNumber target={value} suffix={suffix} />
                </p>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
        </GlassCard>
    );
};

/* ────────── INTENT BAR CHART ────────── */
const intentData = [
    { label: 'Limpieza', value: 34, color: '#06b6d4' },
    { label: 'Ortodoncia', value: 22, color: '#818cf8' },
    { label: 'Implantes', value: 16, color: '#34d399' },
    { label: 'Urgencia', value: 11, color: '#f87171' },
    { label: 'Control', value: 10, color: '#fbbf24' },
    { label: 'Otros', value: 7, color: '#94a3b8' },
];

const IntentBars = () => {
    const [hovered, setHovered] = useState(null);
    const [animated, setAnimated] = useState(false);
    useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

    return (
        <div className="space-y-3">
            {intentData.map((d, i) => (
                <div
                    key={d.label}
                    className="flex items-center gap-3 cursor-default"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <span className="text-xs text-slate-400 w-20 shrink-0 text-right">{d.label}</span>
                    <div className="flex-1 h-7 bg-slate-900/50 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                            style={{
                                width: animated ? `${d.value * 2.8}%` : '0%',
                                background: `linear-gradient(90deg, ${d.color}88, ${d.color})`,
                                boxShadow: hovered === i ? `0 0 12px ${d.color}60` : 'none',
                                transitionDelay: `${i * 80}ms`,
                            }}
                        >
                            <span className="text-xs font-semibold text-white">{d.value}%</span>
                        </div>
                    </div>
                </div>
            ))}
            <p className="text-xs text-slate-600 text-center pt-2">Principales motivos de contacto de los pacientes</p>
        </div>
    );
};

/* ────────── HEATMAP ────────── */
const heatmapDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const heatmapHours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];

const heatmapValues = [
    [2, 5, 7, 6, 8, 4, 1],
    [3, 8, 9, 7, 9, 5, 2],
    [2, 7, 10, 8, 8, 6, 2],
    [2, 6, 8, 9, 7, 5, 1],
    [3, 7, 9, 8, 9, 4, 1],
    [1, 3, 5, 4, 4, 3, 1],
    [1, 2, 3, 2, 3, 2, 1],
];

const heatColor = (v) => {
    if (v <= 2) return '#1e293b';
    if (v <= 4) return '#0e4f6e';
    if (v <= 6) return '#0891b2';
    if (v <= 8) return '#06b6d4';
    return '#22d3ee';
};

const Heatmap = () => {
    const [tooltip, setTooltip] = useState(null);
    return (
        <div className="space-y-2">
            <div className="flex gap-1 pl-8">
                {heatmapDays.map(d => (
                    <div key={d} className="flex-1 text-center text-xs text-slate-600">{d}</div>
                ))}
            </div>
            {heatmapHours.map((h, hi) => (
                <div key={h} className="flex items-center gap-1">
                    <span className="w-7 text-xs text-slate-600 shrink-0 text-right">{h}</span>
                    {heatmapDays.map((d, di) => {
                        const v = heatmapValues[hi][di];
                        const isHov = tooltip?.hi === hi && tooltip?.di === di;
                        return (
                            <div key={d} className="relative flex-1">
                                <div
                                    onMouseEnter={() => setTooltip({ hi, di, v, h, d })}
                                    onMouseLeave={() => setTooltip(null)}
                                    className="w-full aspect-square rounded-md cursor-default transition-transform duration-150 hover:scale-110"
                                    style={{ background: heatColor(v), boxShadow: isHov ? `0 0 10px ${heatColor(v)}90` : 'none' }}
                                />
                                {isHov && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-xl z-50 whitespace-nowrap pointer-events-none">
                                        {d} · {h} — <strong>{v * 11} consultas</strong>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
            <div className="flex items-center justify-end gap-1.5 pt-1">
                <span className="text-xs text-slate-600">Menos</span>
                {['#1e293b', '#0e4f6e', '#0891b2', '#06b6d4', '#22d3ee'].map(c => (
                    <div key={c} className="w-4 h-4 rounded-sm" style={{ background: c }} />
                ))}
                <span className="text-xs text-slate-600">Más</span>
            </div>
        </div>
    );
};

/* ────────── FRICTION LIST ────────── */
const frictions = [
    {
        icon: '🔄',
        issue: 'Ortodoncia frecuentemente deriva a humano',
        detail: '68% de las consultas sobre ortodoncia terminan en derivación',
        recom: 'Revisar información sobre ortodoncia',
    },
    {
        icon: '❓',
        issue: 'Pregunta repetida sin respuesta definida',
        detail: '"¿Cuánto cuesta la limpieza?" aparece 43 veces sin respuesta directa',
        recom: 'Agregar precio de limpieza a la base clínica',
    },
    {
        icon: '⏱️',
        issue: 'Conversaciones más largas de lo habitual',
        detail: '12 conversaciones superaron los 15 minutos en horario de tarde',
        recom: 'Revisar flujo de agendamiento',
    },
    {
        icon: '🌙',
        issue: 'Alta demanda fuera de horario sin respuesta',
        detail: '23 consultas entre 21h y 23h recibieron respuesta automatizada básica',
        recom: 'Activar respuestas enriquecidas nocturnas',
    },
];

const FrictionList = () => (
    <div className="space-y-3">
        {frictions.map((f, i) => (
            <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:border-slate-600/40 transition-all duration-200 group"
            >
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{f.issue}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.detail}</p>
                </div>
                <div className="shrink-0">
                    <span className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                        <Lightbulb size={11} /> {f.recom}
                    </span>
                </div>
            </div>
        ))}
    </div>
);

/* ────────── TREND LINE CHART ────────── */
const TrendChart = ({ range }) => {
    const metrics = ['Conversaciones', '% Contención', 'Derivaciones'];
    const colors = { 'Conversaciones': '#06b6d4', '% Contención': '#818cf8', 'Derivaciones': '#f87171' };
    const [active, setActive] = useState('Conversaciones');
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const data = trendData[active][range] || [];
    const W = 600, H = 160, PAD = 24;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range2 = max - min || 1;

    const pts = data.map((v, i) => ({
        x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
        y: PAD + ((max - v) / range2) * (H - PAD * 2),
        v,
    }));

    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
    const color = colors[active];

    return (
        <div className="space-y-4">
            {/* metric selector */}
            <div className="flex gap-2 flex-wrap">
                {metrics.map(m => (
                    <button
                        key={m}
                        onClick={() => setActive(m)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${active === m
                                ? 'text-white shadow-md'
                                : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'
                            }`}
                        style={active === m ? { background: `${colors[m]}25`, border: `1px solid ${colors[m]}50`, color: colors[m] } : {}}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ background: colors[m] }} />
                        {m}
                    </button>
                ))}
            </div>

            {/* chart */}
            <div className="relative select-none">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }} onMouseLeave={() => setHoveredIdx(null)}>
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                        </linearGradient>
                    </defs>

                    {/* grid lines */}
                    {[0.25, 0.5, 0.75].map(f => (
                        <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)}
                            stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                    ))}

                    {/* area */}
                    <path d={areaD} fill="url(#areaGrad)" />

                    {/* line */}
                    <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* interaction zones + dots */}
                    {pts.map((p, i) => (
                        <g key={i}>
                            <rect
                                x={i === 0 ? p.x : pts[i - 1].x + (p.x - pts[i - 1].x) / 2}
                                y={0}
                                width={i === 0 ? (pts[1]?.x - p.x) / 2 : i === pts.length - 1 ? (p.x - pts[i - 1].x) / 2 : (pts[i + 1]?.x - pts[i - 1].x) / 2}
                                height={H}
                                fill="transparent"
                                onMouseEnter={() => setHoveredIdx(i)}
                            />
                            {hoveredIdx === i && (
                                <>
                                    <line x1={p.x} x2={p.x} y1={PAD} y2={H - PAD} stroke={color} strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5" />
                                    <circle cx={p.x} cy={p.y} r={5} fill={color} stroke="#0f172a" strokeWidth="2" />

                                    {/* tooltip */}
                                    <g>
                                        <rect
                                            x={Math.min(p.x - 30, W - PAD - 70)} y={p.y - 35}
                                            width={70} height={26} rx={6}
                                            fill="#1e293b" stroke={`${color}50`} strokeWidth="1"
                                        />
                                        <text
                                            x={Math.min(p.x - 30, W - PAD - 70) + 35} y={p.y - 17}
                                            textAnchor="middle" fill="white" fontSize="11" fontWeight="600"
                                        >
                                            {active === '% Contención' ? `${p.v}%` : p.v}
                                        </text>
                                    </g>
                                </>
                            )}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

/* ─────────────────── MAIN ─────────────────── */
const Intelligence = () => {
    const [range, setRange] = useState('Últimos 7 días');
    const [rangeOpen, setRangeOpen] = useState(false);

    const kpi = kpiData[range];

    return (
        <div className="space-y-8">

            {/* BLOQUE 1 — Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Inteligencia
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Análisis estratégico del rendimiento del agente</p>
                </div>

                {/* time range selector */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => setRangeOpen(o => !o)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 text-sm text-white font-medium transition-all"
                    >
                        <BarChart2 size={15} className="text-cyan-400" />
                        {range}
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${rangeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {rangeOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                            {RANGES.map(r => (
                                <button
                                    key={r}
                                    onClick={() => { setRange(r); setRangeOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${range === r ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:bg-slate-700/50'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* BLOQUE 2 — KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                    key={`cont-${range}`}
                    icon={Shield}
                    color="bg-gradient-to-br from-cyan-500 to-blue-600"
                    title="Tasa de Contención"
                    tooltip="Porcentaje de conversaciones resueltas por el agente sin necesidad de intervención humana."
                    value={kpi.containment.value}
                    suffix="%"
                    trend={kpi.containment.trend}
                    trendUp={kpi.containment.up}
                    sub="Comparado con periodo anterior"
                />
                <KpiCard
                    key={`resp-${range}`}
                    icon={Clock}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                    title="Tiempo Promedio de Respuesta"
                    tooltip="Tiempo medio que tarda el agente en responder a un mensaje del paciente."
                    value={kpi.response.value}
                    suffix="s"
                    trend={kpi.response.trend}
                    trendUp={kpi.response.up}
                    invertTrend={true}
                    sub="Promedio por mensaje enviado"
                />
                <KpiCard
                    key={`off-${range}`}
                    icon={Flame}
                    color="bg-gradient-to-br from-amber-500 to-orange-600"
                    title="Capturadas Fuera de Horario"
                    tooltip="Conversaciones iniciadas fuera del horario de atención que el agente respondió automáticamente."
                    value={kpi.offHours.value}
                    suffix=""
                    trend={kpi.offHours.trend > 0 ? `+${kpi.offHours.trend}` : kpi.offHours.trend}
                    trendUp={kpi.offHours.up}
                    sub="Interacciones que antes se perdían"
                />
                <KpiCard
                    key={`deriv-${range}`}
                    icon={Users}
                    color="bg-gradient-to-br from-emerald-500 to-teal-600"
                    title="Derivaciones a Humano"
                    tooltip="Conversaciones que el agente transfirió a un miembro del equipo por complejidad o urgencia."
                    value={kpi.deriv.value}
                    suffix=""
                    trend={kpi.deriv.trend}
                    trendUp={kpi.deriv.up}
                    sub="Casos complejos detectados"
                />
            </div>

            {/* BLOQUE 3 + 4 — Intenciones + Heatmap */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <GlassCard className="p-6 h-full">
                        <SectionTitle sub="Distribución de motivos de consulta en el período">
                            Distribución de Intenciones
                        </SectionTitle>
                        <IntentBars />
                    </GlassCard>
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <GlassCard className="p-6 h-full">
                        <SectionTitle sub="Horarios con mayor volumen de consultas">
                            Momentos de Mayor Interacción
                        </SectionTitle>
                        <Heatmap />
                    </GlassCard>
                </div>
            </div>

            {/* BLOQUE 5 — Fricciones */}
            <GlassCard className="p-6">
                <SectionTitle sub="Patrones detectados que pueden optimizarse para mejorar la experiencia">
                    Oportunidades de Mejora
                </SectionTitle>
                <FrictionList />
            </GlassCard>

            {/* BLOQUE 6 — Trend line */}
            <GlassCard className="p-6">
                <SectionTitle sub="Evolución de las métricas principales en el tiempo seleccionado">
                    Evolución del Rendimiento del Agente
                </SectionTitle>
                <TrendChart range={range} />
            </GlassCard>

            {/* tab fade-in keyframe */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Intelligence;
