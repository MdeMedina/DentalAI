import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock Appointments
    const appointments = [
        { id: 1, patient: 'Maria Garcia', type: 'Check-up', time: '10:00 AM', duration: '30m', date: new Date().getDate() },
        { id: 2, patient: 'John Smith', type: 'Cleaning', time: '02:00 PM', duration: '1h', date: new Date().getDate() + 1 },
        { id: 3, patient: 'Robert Johnson', type: 'Whitening', time: '11:30 AM', duration: '1h', date: new Date().getDate() + 2 },
    ];

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 border border-slate-700/30 bg-slate-900/20"></div>);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dateAppointments = appointments.filter(apt => apt.date === day);
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            const isSelected = day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`h-32 border border-slate-700/30 p-2 relative group transition-colors hover:bg-white/5 ${isSelected ? 'bg-white/10' : ''}`}
                >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}>
                        {day}
                    </span>

                    <div className="mt-2 space-y-1">
                        {dateAppointments.map(apt => (
                            <div key={apt.id} className="text-xs p-1.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 truncate">
                                {apt.time} - {apt.patient}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            <div className="flex-1 flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Calendar
                    </h2>
                    <div className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-1 border border-slate-700">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-lg font-medium text-white w-32 text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-3 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 flex-1 overflow-y-auto">
                        {generateCalendarDays()}
                    </div>
                </div>
            </div>

            {/* Side Panel for Selected Day */}
            <div className="w-80 glass rounded-2xl border border-slate-700/50 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </h3>
                <p className="text-slate-400 mb-6">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>

                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Appointments</h4>

                <div className="space-y-4 flex-1 overflow-y-auto">
                    {appointments.filter(apt => apt.date === selectedDate.getDate()).length > 0 ? (
                        appointments.filter(apt => apt.date === selectedDate.getDate()).map(apt => (
                            <div key={apt.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{apt.type}</h5>
                                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{apt.duration}</span>
                                </div>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-cyan-500" />
                                        <span>{apt.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-cyan-500" />
                                        <span>{apt.patient}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                            <p>No appointments</p>
                            <button className="mt-4 text-cyan-400 text-sm hover:underline">Add Appointment</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
