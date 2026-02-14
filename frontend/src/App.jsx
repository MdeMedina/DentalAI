import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

import AgentControl from './pages/AgentControl';

import Conversations from './pages/Conversations';

import Calendar from './pages/Calendar';

import Integrations from './pages/Integrations';

import Patients from './pages/Patients';

import Settings from './pages/Settings';

// Placeholder components for other routes
const Placeholder = ({ title }) => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold text-white">{title}</h2>
    <div className="p-10 glass rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
      Content for {title} coming soon...
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="agents" element={<AgentControl />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="patients" element={<Patients />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
