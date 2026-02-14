import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [metrics, setMetrics] = React.useState({
        totalConversations: 0,
        totalAppointments: 0,
        activeAgents: 0
    });
    const [loading, setLoading] = React.useState(true);

    // Mock data for charts
    const data = [
        { name: 'Mon', conversations: 40, appointments: 24 },
        { name: 'Tue', conversations: 30, appointments: 13 },
        { name: 'Wed', conversations: 20, appointments: 98 },
        { name: 'Thu', conversations: 27, appointments: 39 },
        { name: 'Fri', conversations: 18, appointments: 48 },
        { name: 'Sat', conversations: 23, appointments: 38 },
        { name: 'Sun', conversations: 34, appointments: 43 },
    ];

    React.useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // In a real scenario, this would be an actual fetch call
                // const res = await fetch('http://localhost:3001/api/metrics');
                // const data = await res.json();
                // setMetrics(data);

                // Simulating fetch for now to match the "Mock/Basic CRUD" stage
                setTimeout(() => {
                    setMetrics({
                        totalConversations: 1248, // Mocked for visuals
                        totalAppointments: 85,
                        activeAgents: 3
                    });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching metrics:", error);
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Dashboard
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 mb-2 relative z-10">Total Patients</h3>
                    <p className="text-4xl font-bold text-cyan-400 glow-text relative z-10">
                        {loading ? '...' : metrics.totalConversations}
                    </p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 mb-2 relative z-10">Active Agents</h3>
                    <p className="text-4xl font-bold text-blue-400 glow-text relative z-10">
                        {loading ? '...' : metrics.activeAgents}
                    </p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 mb-2 relative z-10">Appointments Today</h3>
                    <p className="text-4xl font-bold text-emerald-400 glow-text relative z-10">
                        {loading ? '...' : metrics.totalAppointments}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Activity Overview</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="conversations" stroke="#06b6d4" fillOpacity={1} fill="url(#colorConv)" />
                                <Area type="monotone" dataKey="appointments" stroke="#10b981" fillOpacity={1} fill="url(#colorAppt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">John Doe</p>
                                        <p className="text-xs text-slate-400">New appointment booked</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">2 min ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
