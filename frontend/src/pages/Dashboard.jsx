import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, Activity, Clock, MessageSquare, AlertTriangle, CheckCircle, ChevronDown, Play, Pause, Settings, Eye, User, BarChart2, ShieldCheck, AlertOctagon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Dashboard = () => {
    const [selectedAgentId, setSelectedAgentId] = useState(1);
    const [loading, setLoading] = useState(true);
    const [chartMetric, setChartMetric] = useState('conversations'); // conversations, handoffs, retention

    // Mock Agents
    const agents = [
        { id: 1, name: 'Dra. Sarah', role: 'Recepcionista', status: 'active', timeActive: '2h 15m' },
        { id: 2, name: 'Alex', role: 'Reservas', status: 'paused', timeActive: '45m' },
    ];

    const currentAgent = agents.find(a => a.id === parseInt(selectedAgentId)) || agents[0];

    // Mock Chart Data - Extended for multiple metrics
    const activityData = [
        { name: 'Lun', conversations: 45, handoffs: 2, retention: 95 },
        { name: 'Mar', conversations: 52, handoffs: 5, retention: 90 },
        { name: 'Mié', conversations: 38, handoffs: 1, retention: 97 },
        { name: 'Jue', conversations: 65, handoffs: 8, retention: 88 },
        { name: 'Vie', conversations: 48, handoffs: 3, retention: 94 },
        { name: 'Sáb', conversations: 25, handoffs: 0, retention: 100 },
        { name: 'Dom', conversations: 30, handoffs: 1, retention: 96 },
    ];

    // Mock Feed Data
    const activityFeed = [
        { id: 1, type: 'new_conv', text: 'Nueva conversación iniciada', time: 'hace 2 min', icon: MessageSquare, color: 'text-blue-400' },
        { id: 2, type: 'human_handoff', text: 'Derivado a humano: Consulta compleja', time: 'hace 15 min', icon: User, color: 'text-amber-400' },
        { id: 3, type: 'intent', text: 'Intención detectada: Ortodoncia', time: 'hace 32 min', icon: Activity, color: 'text-emerald-400' },
        { id: 4, type: 'error', text: 'Error de integración: Calendar API', time: 'hace 1h', icon: AlertTriangle, color: 'text-red-400' },
    ];

    // System Status Logic (Mocked)
    const systemStatus = {
        hasIssues: true, // Toggle this to test different states
        message: 'Integración Calendar con errores',
        impact: 'Posibles fallos en creación de citas',
        action: 'Revisar Integración'
    };
    // const systemStatus = { hasIssues: false };

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 800);
    }, []);

    const getChartConfig = (metric) => {
        switch (metric) {
            case 'conversations': return { color: '#06b6d4', label: 'Conversaciones' };
            case 'handoffs': return { color: '#f59e0b', label: 'Derivaciones' };
            case 'retention': return { color: '#10b981', label: '% Contención' };
            default: return { color: '#06b6d4', label: 'Conversaciones' };
        }
    };

    const chartConfig = getChartConfig(chartMetric);

    return (
        <div className="space-y-6">
            {/* Block 1: Header & Agent Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Centro de Control
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Supervisión en tiempo real
                    </p>
                </div>

                <div className="flex items-center gap-6 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                    {/* Agent Selector */}
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1 ml-1 uppercase tracking-wider font-bold">Monitoreando a:</label>
                        <div className="relative group">
                            <select
                                value={selectedAgentId}
                                onChange={(e) => setSelectedAgentId(e.target.value)}
                                className="appearance-none bg-slate-800 text-white pl-10 pr-8 py-2 rounded-xl border border-slate-700 hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all cursor-pointer font-medium min-w-[200px]"
                            >
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>{agent.name} ({agent.role})</option>
                                ))}
                            </select>
                            <Bot size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    <div className="h-10 w-px bg-slate-700"></div>

                    {/* Status Indicator (Dominant) */}
                    <div className="flex flex-col items-center px-2">
                        <span className={`relative flex h-4 w-4 mb-1`}>
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentAgent.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-4 w-4 ${currentAgent.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${currentAgent.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {currentAgent.status === 'active' ? 'Activo' : 'Pausado'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Block 4: System Status (Moved to Top) */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300
                ${systemStatus.hasIssues
                    ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                }`}>

                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${systemStatus.hasIssues ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {systemStatus.hasIssues ? <AlertOctagon size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <div>
                        <h3 className={`text-base font-bold flex items-center gap-2 ${systemStatus.hasIssues ? 'text-red-400' : 'text-emerald-400'}`}>
                            {systemStatus.hasIssues ? 'Atención Requerida' : 'Sistema Operativo'}
                            {systemStatus.hasIssues && (
                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                                    Crítico
                                </span>
                            )}
                        </h3>
                        <p className="text-slate-300 text-sm mt-0.5">
                            {systemStatus.hasIssues ? (
                                <span className="flex items-center gap-1.5">
                                    {systemStatus.message}
                                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                    <span className="text-slate-400 italic">Impacto: {systemStatus.impact}</span>
                                </span>
                            ) : (
                                'Todos los sistemas funcionan con normalidad.'
                            )}
                        </p>
                    </div>
                </div>

                {systemStatus.hasIssues && (
                    <button className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2 whitespace-nowrap">
                        <Settings size={16} />
                        {systemStatus.action}
                    </button>
                )}

                {!systemStatus.hasIssues && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle size={14} className="text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-medium">Verificado hace 1m</span>
                    </div>
                )}
            </div>

            {/* Block 2: Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Conversaciones Hoy"
                    value="42"
                    subtext="12 activas en este momento"
                    loading={loading}
                    valueColor="text-white"
                />
                <MetricCard
                    title="Tiempo Promedio Respuesta"
                    value="1.8s"
                    subtext="Promedio del día"
                    loading={loading}
                    valueColor="text-cyan-400"
                    trend={{ value: '0.3s', direction: 'down', label: 'vs ayer' }}
                />
                <MetricCard
                    title="Resueltas sin Humano"
                    value="94%"
                    subtext="Tasa de contención"
                    loading={loading}
                    valueColor="text-emerald-400"
                    trend={{ value: '2%', direction: 'up', label: 'vs semana ant.' }}
                />
                <MetricCard
                    title="Derivaciones a Humano"
                    value="3"
                    subtext="Hoy"
                    loading={loading}
                    valueColor="text-amber-400"
                />
            </div>

            {/* Block 5: Quick Actions (Below Metrics) */}
            <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ActionButton icon={Eye} label="Ver Conversaciones" />
                    <ActionButton icon={Play} label="Probar el Agente" />
                    <ActionButton icon={Settings} label="Ajustar Info Clínica" />
                    <ActionButton icon={Pause} label="Pausar Agente" variant="danger" />
                </div>
            </div>

            {/* Block 3: Real-time Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                {/* Chart Column (8) */}
                <div className="lg:col-span-8 glass rounded-2xl border border-slate-700/50 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart2 size={18} className="text-cyan-400" />
                            Rendimiento Operativo del Agente
                        </h3>

                        {/* Smart Chart Selector */}
                        <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                            <button
                                onClick={() => setChartMetric('conversations')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMetric === 'conversations' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Conversaciones
                            </button>
                            <button
                                onClick={() => setChartMetric('handoffs')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMetric === 'handoffs' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Derivaciones
                            </button>
                            <button
                                onClick={() => setChartMetric('retention')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMetric === 'retention' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                % Contención
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: chartConfig.color }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={chartMetric}
                                    stroke={chartConfig.color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                    animationDuration={500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Feed Column (4) */}
                <div className="lg:col-span-4 glass rounded-2xl border border-slate-700/50 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" />
                        Actividad Reciente
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        {activityFeed.map((item) => (
                            <div key={item.id} className="relative pl-6 border-l border-slate-700/50 pb-2 last:pb-0 group">
                                <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0f172a] group-hover:ring-slate-800 transition-all ${item.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                                    <p className="text-sm text-slate-200 font-medium">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, subtext, loading, valueColor, trend }) => (
    <div className="glass p-5 rounded-2xl border border-slate-700/50 flex flex-col justify-between h-32 hover:border-slate-600 transition-colors group relative overflow-hidden">
        <div className="flex justify-between items-start">
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md ${trend.direction === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend.value}
                </div>
            )}
        </div>

        <div>
            <p className={`text-3xl font-bold ${valueColor} tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left`}>
                {loading ? '...' : value}
            </p>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">{subtext}</p>
                {trend && (
                    <span className={`text-[10px] ${trend.direction === 'up' ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                        {trend.label}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, label, variant = 'primary' }) => (
    <button className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 font-medium group
        ${variant === 'danger'
            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
        }
    `}>
        <Icon size={18} className="transition-transform group-hover:scale-110" />
        {label}
    </button>
);

export default Dashboard;
