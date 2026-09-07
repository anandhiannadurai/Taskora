const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initSchema } = require('./config/schema');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const memberRoutes = require('./routes/memberRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/workspaces', projectRoutes); // Backward compatibility fallback
app.use('/api/tasks', taskRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/user', userRoutes);

// Root Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Taskora Enterprise API Server',
    tagline: 'Work Together. Finish Faster.',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 Taskora Server running on http://localhost:${PORT}`);
      console.log(`==================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
