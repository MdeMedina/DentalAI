import React, { useState } from 'react';
import { Save, Bell, Lock, User, Globe, Moon } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Settings
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {[
                        { id: 'general', label: 'General', icon: <User size={18} /> },
                        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
                        { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 glass p-8 rounded-2xl border border-slate-700/50">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Clinic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Clinic Name</label>
                                    <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" defaultValue="Future Smiles Dental" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Email Address</label>
                                    <input type="email" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" defaultValue="contact@futuresmiles.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Phone Number</label>
                                    <input type="tel" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" defaultValue="+1 (555) 123-4567" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Website</label>
                                    <input type="url" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" defaultValue="https://futuresmiles.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Address</label>
                                <textarea className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 h-24 resize-none" defaultValue="123 Innovation Blvd, Tech City, TC 94043" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'New Appointment', desc: 'Receive alerts when a new appointment is booked.' },
                                    { title: 'Patient Messages', desc: 'Get notified for incoming patient messages.' },
                                    { title: 'System Updates', desc: 'Notifications about platform updates and maintenance.' },
                                    { title: 'Daily Report', desc: 'Receive a daily summary of clinic performance.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                        <div>
                                            <h4 className="font-medium text-white">{item.title}</h4>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === 'security' || activeTab === 'appearance') && (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                            <Lock className="mb-4 opacity-50" size={48} />
                            <p>Security & Appearance settings coming soon</p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-cyan-500/20">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
