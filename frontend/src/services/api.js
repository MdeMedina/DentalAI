const API_URL = 'http://localhost:3001/api';

export const api = {
  // Agents
  getAgents: async () => {
    const response = await fetch(`${API_URL}/agents`);
    if (!response.ok) throw new Error('Failed to fetch agents');
    return response.json();
  },
  createAgent: async (agentData) => {
    const response = await fetch(`${API_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    if (!response.ok) throw new Error('Failed to create agent');
    return response.json();
  },
  updateAgent: async (id, agentData) => {
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    if (!response.ok) throw new Error('Failed to update agent');
    return response.json();
  },

  // Mock Metrics
  getMetrics: async () => {
    const response = await fetch(`${API_URL}/metrics`);
    if (!response.ok) throw new Error('Failed to fetch metrics');
    return response.json();
  },
};
