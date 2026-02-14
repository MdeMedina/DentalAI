import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Bot, User } from 'lucide-react';

const Conversations = () => {
    const [selectedId, setSelectedId] = useState(1);
    const [messageInput, setMessageInput] = useState('');

    // Mock Data
    const conversations = [
        {
            id: 1,
            patient: 'Maria Garcia',
            lastMessage: 'Is it possible to reschedule?',
            time: '10:42 AM',
            unread: 2,
            avatar: 'MG',
            status: 'online'
        },
        {
            id: 2,
            patient: 'John Smith',
            lastMessage: 'Thanks, see you then.',
            time: 'Yesterday',
            unread: 0,
            avatar: 'JS',
            status: 'offline'
        },
        {
            id: 3,
            patient: 'Robert Johnson',
            lastMessage: 'How much for a whitening?',
            time: 'Mon',
            unread: 0,
            avatar: 'RJ',
            status: 'online'
        },
    ];

    const messages = [
        { id: 1, sender: 'ai', text: 'Hello Maria, this is Dr. Sarah from Dental AI. How can I help you today?', time: '10:30 AM' },
        { id: 2, sender: 'patient', text: 'Hi, I have an appointment tomorrow at 2 PM.', time: '10:32 AM' },
        { id: 3, sender: 'ai', text: 'Yes, I see that appointment. Would you like to confirm it?', time: '10:33 AM' },
        { id: 4, sender: 'patient', text: 'Actually, something came up. Is it possible to reschedule?', time: '10:42 AM' },
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        // Logic to send message
        console.log('Sending:', messageInput);
        setMessageInput('');
    };

    const activeConversation = conversations.find(c => c.id === selectedId);

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar - Conversation List */}
            <div className="w-80 glass rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedId(chat.id)}
                            className={`p-4 border-b border-slate-700/50 cursor-pointer transition-colors hover:bg-white/5 ${selectedId === chat.id ? 'bg-white/10 border-l-4 border-l-cyan-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-bold ${selectedId === chat.id ? 'text-white' : 'text-slate-300'}`}>{chat.patient}</h3>
                                <span className="text-xs text-slate-500">{chat.time}</span>
                            </div>
                            <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {activeConversation?.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{activeConversation?.patient}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${activeConversation?.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                                <p className="text-xs text-slate-400 capitalize">{activeConversation?.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Phone size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Video size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'ai' ? 'bg-slate-800 border border-cyan-500/50' : 'bg-slate-700'}`}>
                                    {msg.sender === 'ai' ? <Bot size={16} className="text-cyan-400" /> : <User size={16} className="text-white" />}
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.sender === 'ai' ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 'bg-cyan-600 text-white rounded-tr-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block text-right">{msg.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Type a message to intercept..."
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Conversations;
