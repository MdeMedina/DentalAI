import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Bot, Clock, MessageSquare } from 'lucide-react';

const AgentControl = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAgent, setEditingAgent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Mock initial data handling
    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            // const res = await fetch('http://localhost:3001/api/agents');
            // const data = await res.json();
            // setAgents(data);

            // Mock data
            setTimeout(() => {
                setAgents([
                    { id: 1, name: 'Dra. Sarah (Recepcionista)', role: 'receptionist', status: 'active', personality: 'Amable, Profesional, Empática' },
                    { id: 2, name: 'Alex (Reservas)', role: 'booking', status: 'active', personality: 'Eficiente, Directo, Servicial' },
                ]);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error fetching agents:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Logic to save/update agent would go here
        // await fetch('/api/agents', { method: 'POST', ... })

        // Mock update
        if (editingAgent.id) {
            setAgents(agents.map(a => a.id === editingAgent.id ? editingAgent : a));
        } else {
            setAgents([...agents, { ...editingAgent, id: agents.length + 1, status: 'active' }]);
        }
        setEditingAgent(null);
        setIsCreating(false);
    };

    const startEdit = (agent) => {
        setEditingAgent({ ...agent });
        setIsCreating(false);
    };

    const startCreate = () => {
        setEditingAgent({ name: '', role: 'receptionist', personality: '' });
        setIsCreating(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Control de Agentes
                </h2>
                <button
                    onClick={startCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} />
                    Nuevo Agente
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent List */}
                <div className="lg:col-span-1 space-y-4">
                    {loading ? (
                        <p className="text-slate-500">Cargando agentes...</p>
                    ) : (
                        agents.map(agent => (
                            <div
                                key={agent.id}
                                onClick={() => startEdit(agent)}
                                className={`glass p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 ${editingAgent?.id === agent.id ? 'border-cyan-500 bg-white/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-700/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <Bot className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{agent.name}</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">{agent.role}</p>
                                    </div>
                                    <div className={`ml-auto w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-500'}`} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    {editingAgent ? (
                        <div className="glass p-8 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => setEditingAgent(null)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                {isCreating ? <Plus size={20} className="text-cyan-400" /> : <Edit size={20} className="text-cyan-400" />}
                                {isCreating ? 'Crear Nuevo Agente' : 'Editar Configuración del Agente'}
                            </h3>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Nombre del Agente</label>
                                        <input
                                            type="text"
                                            value={editingAgent.name}
                                            onChange={e => setEditingAgent({ ...editingAgent, name: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                            placeholder="ej. Dra. Sarah"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Rol</label>
                                        <select
                                            value={editingAgent.role}
                                            onChange={e => setEditingAgent({ ...editingAgent, role: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        >
                                            <option value="receptionist">Recepcionista</option>
                                            <option value="booking">Especialista en Reservas</option>
                                            <option value="support">Atención al Cliente</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Personalidad e Instrucciones</label>
                                    <textarea
                                        value={editingAgent.personality}
                                        onChange={e => setEditingAgent({ ...editingAgent, personality: e.target.value })}
                                        className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                        placeholder="Describa cómo debe comportarse el agente..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-700/50 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingAgent(null)}
                                        className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                                    >
                                        <Save size={18} />
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 glass rounded-2xl border border-dashed border-slate-700 text-slate-500">
                            <Bot size={48} className="mb-4 opacity-50" />
                            <p>Seleccione un agente para editar o cree uno nuevo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentControl;
