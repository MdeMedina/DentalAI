import React, { useState } from 'react';
import { MessageCircle, Mail, Instagram, Calendar, FileText, Settings, Check, X, ExternalLink } from 'lucide-react';

const Integrations = () => {
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'WhatsApp Business', icon: <MessageCircle size={32} />, status: 'connected', description: 'Manage patient chats directly via WhatsApp API.' },
        { id: 2, name: 'Instagram Direct', icon: <Instagram size={32} />, status: 'disconnected', description: 'Reply to DMs and story mentions automatically.' },
        { id: 3, name: 'Google Calendar', icon: <Calendar size={32} />, status: 'connected', description: 'Sync appointments with your clinic\'s main calendar.' },
        { id: 4, name: 'Gmail', icon: <Mail size={32} />, status: 'disconnected', description: 'Send follow-up emails and treatment plans.' },
        { id: 5, name: 'Telegram', icon: <MessageCircle size={32} />, status: 'disconnected', description: 'Alternative channel for patient support.' },
        { id: 6, name: 'EHR System', icon: <FileText size={32} />, status: 'error', description: 'Connect to your Electronic Health Records database.' },
    ]);

    const toggleStatus = (id) => {
        setIntegrations(integrations.map(integration => {
            if (integration.id === id) {
                return {
                    ...integration,
                    status: integration.status === 'connected' ? 'disconnected' : 'connected'
                };
            }
            return integration;
        }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Integrations Hub
            </h2>
            <p className="text-slate-400 max-w-2xl">
                Connect your AI agents to the tools you use every day. Manage permissions and configure specific settings for each integration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map(integration => (
                    <div key={integration.id} className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                {integration.icon}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${integration.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                    integration.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                        'bg-slate-700/50 text-slate-400 border-slate-600'
                                }`}>
                                {integration.status === 'connected' ? 'Connected' :
                                    integration.status === 'error' ? 'Error' : 'Disconnected'}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{integration.name}</h3>
                        <p className="text-sm text-slate-400 mb-6 h-10">{integration.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                                <Settings size={16} />
                                Configure
                            </button>

                            <button
                                onClick={() => toggleStatus(integration.id)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${integration.status === 'connected' ? 'bg-cyan-500' : 'bg-slate-700'}`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${integration.status === 'connected' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Need a custom integration?</h3>
                    <p className="text-slate-400">Our team can build custom connectors for your specific dental software.</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                    Contact Support <ExternalLink size={18} />
                </button>
            </div>
        </div>
    );
};

export default Integrations;
