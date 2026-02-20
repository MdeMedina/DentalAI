import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, User, Phone, Mail, FileText } from 'lucide-react';

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: 1, name: 'Maria Garcia', email: 'maria.g@example.com', phone: '+1 555-0123', status: 'Activo', lastVisit: '24 Oct, 2023', nextAppt: '12 Nov, 2023' },
        { id: 2, name: 'John Smith', email: 'john.smith@example.com', phone: '+1 555-5678', status: 'Activo', lastVisit: '15 Sep, 2023', nextAppt: 'Pendiente' },
        { id: 3, name: 'Robert Johnson', email: 'rob.j@example.com', phone: '+1 555-9012', status: 'Inactivo', lastVisit: '10 Jun, 2023', nextAppt: '-' },
        { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', phone: '+1 555-3456', status: 'Prospecto', lastVisit: '-', nextAppt: '15 Nov, 2023' },
        { id: 5, name: 'Michael Wilson', email: 'm.wilson@example.com', phone: '+1 555-7890', status: 'Activo', lastVisit: '30 Oct, 2023', nextAppt: '05 Dic, 2023' },
    ];

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    CRM de Pacientes
                </h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                        <Filter size={18} />
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20">
                        <User size={18} />
                        Agregar Paciente
                    </button>
                </div>
            </div>

            <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar pacientes por nombre o correo..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Última Visita</th>
                                <th className="px-6 py-4">Próxima Cita</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-slate-700">
                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{patient.name}</div>
                                                <div className="text-xs text-slate-500">ID: #{1000 + patient.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Mail size={14} className="text-slate-500" />
                                                {patient.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Phone size={14} className="text-slate-500" />
                                                {patient.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${patient.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            patient.status === 'Prospecto' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-slate-700/50 text-slate-400 border-slate-600'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {patient.nextAppt !== '-' && patient.nextAppt !== 'Pendiente' ? (
                                            <div className="flex items-center gap-2 text-cyan-400">
                                                <FileText size={14} />
                                                {patient.nextAppt}
                                            </div>
                                        ) : (
                                            <span>{patient.nextAppt}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-700/50 flex justify-between items-center text-sm text-slate-400">
                    <div>Mostrando {filteredPatients.length} de {patients.length} pacientes</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;
