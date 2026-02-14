const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

const connection = new Database(process.env.DATABASE_URL.replace("file:", ""));
const adapter = new PrismaBetterSqlite3(connection);
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dental AI Backend is running' });
});

// --- Agents API ---
app.get('/api/agents', async (req, res) => {
    const agents = await prisma.agent.findMany();
    res.json(agents);
});

app.post('/api/agents', async (req, res) => {
    try {
        const agent = await prisma.agent.create({
            data: req.body
        });
        res.json(agent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/agents/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const agent = await prisma.agent.update({
            where: { id },
            data: req.body
        });
        res.json(agent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Metrics API (Mock/Real) ---
app.get('/api/metrics', async (req, res) => {
    // In a real app, query DailyMetric or aggregate from other tables
    const totalConversations = await prisma.conversation.count();
    const totalAppointments = await prisma.appointment.count();

    res.json({
        totalConversations,
        totalAppointments,
        activeAgents: await prisma.agent.count({ where: { status: 'active' } })
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
