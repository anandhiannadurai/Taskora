const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { initSchema } = require('../config/schema');

async function seed() {
  console.log('[Taskora Seed] Starting database seeding...');
  await query('DROP TABLE IF EXISTS activity_logs');
  await query('DROP TABLE IF EXISTS team_members');
  await query('DROP TABLE IF EXISTS work_items');
  await query('DROP TABLE IF EXISTS projects');
  await query('DROP TABLE IF EXISTS workspaces');
  await query('DROP TABLE IF EXISTS users');
  await initSchema();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  const usersData = [
    { name: 'Alex Rivera', email: 'alex@taskora.io', role: 'Admin', title: 'Product Founder', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', bio: 'Leading Taskora product execution.' },
    { name: 'Sarah Chen', email: 'sarah@taskora.io', role: 'Project Lead', title: 'Senior Technical PM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', bio: 'Managing sprint velocity and deliverables.' },
    { name: 'Marcus Vance', email: 'marcus@taskora.io', role: 'Developer', title: 'Senior Backend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', bio: 'Architecting high speed API microservices.' },
    { name: 'Elena Rostova', email: 'elena@taskora.io', role: 'Designer', title: 'Lead UI/UX Architect', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', bio: 'Designing glassmorphism visual systems.' },
    { name: 'David Kim', email: 'david@taskora.io', role: 'Developer', title: 'Full-Stack Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', bio: 'React + Node integration specialist.' }
  ];

  const userIds = [];
  for (const u of usersData) {
    const res = await query(
      `INSERT INTO users (name, email, password, role, title, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [u.name, u.email, hashedPassword, u.role, u.title, u.avatar, u.bio]
    );
    userIds.push(res.id);
  }

  // 2. Seed Projects (Statuses: Idea, Building, Testing, Delivered)
  const projectsData = [
    {
      name: 'Taskora Core Platform 2.0',
      description: 'Enterprise project management suite with glassmorphism UI, Focus Mode timer, and real-time sprint boards.',
      priority: 'High',
      status: 'Building',
      start_date: '2026-08-01',
      end_date: '2026-10-31',
      created_by: userIds[0]
    },
    {
      name: 'AI Workflow Automations',
      description: 'Predictive task completion dates, auto-assignment rules, and sprint bottleneck detection.',
      priority: 'Urgent',
      status: 'Idea',
      start_date: '2026-11-01',
      end_date: '2026-12-15',
      created_by: userIds[1]
    },
    {
      name: 'Cross-Platform Mobile App',
      description: 'Native mobile client for iOS and Android with offline task caching and push notification sync.',
      priority: 'High',
      status: 'Building',
      start_date: '2026-09-01',
      end_date: '2026-12-01',
      created_by: userIds[1]
    },
    {
      name: 'Real-time Telemetry & Webhooks',
      description: 'High throughput event dispatcher for third-party integrations and live cursor telemetry.',
      priority: 'Medium',
      status: 'Testing',
      start_date: '2026-07-15',
      end_date: '2026-09-30',
      created_by: userIds[2]
    },
    {
      name: 'SOC2 & Security Compliance Audit',
      description: 'Hardening JWT authorization headers, zero-trust RBAC policies, and SQL injection sanitization.',
      priority: 'High',
      status: 'Delivered',
      start_date: '2026-06-01',
      end_date: '2026-08-31',
      created_by: userIds[0]
    }
  ];

  const projectIds = [];
  for (const p of projectsData) {
    const res = await query(
      `INSERT INTO projects (name, description, priority, status, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.name, p.description, p.priority, p.status, p.start_date, p.end_date, p.created_by]
    );
    projectIds.push(res.id);
  }

  // 3. Seed Work Items (Kanban Columns: Backlog, In Progress, Review, Completed)
  const workItemsData = [
    {
      title: 'Design Dark Mode Glassmorphism Tokens',
      description: 'Establish standard backdrop-blur values, border highlights, and dark slate color variables.',
      priority: 'High',
      due_date: '2026-09-20',
      status: 'Backlog',
      project_id: projectIds[0],
      assigned_to: userIds[3]
    },
    {
      title: 'Configure OAuth 2.0 Social Authentication',
      description: 'Implement GitHub and Google OAuth token exchange flows with state verification.',
      priority: 'Medium',
      due_date: '2026-09-24',
      status: 'Backlog',
      project_id: projectIds[0],
      assigned_to: userIds[4]
    },
    {
      title: 'Mobile Push Notification Pipeline',
      description: 'Integrate FCM service worker for instant task updates on mobile clients.',
      priority: 'Urgent',
      due_date: '2026-09-28',
      status: 'Backlog',
      project_id: projectIds[2],
      assigned_to: userIds[2]
    },
    {
      title: 'Focus Mode 25-Min Pomodoro Timer Widget',
      description: 'Build interactive session timer with task binding and productivity tracker.',
      priority: 'Urgent',
      due_date: '2026-09-15',
      status: 'In Progress',
      project_id: projectIds[0],
      assigned_to: userIds[4]
    },
    {
      title: 'Recharts Premium Orange Theme Graphs',
      description: 'Style area, bar, and pie graphs with Taskora orange gradients `#FF6B00`.',
      priority: 'High',
      due_date: '2026-09-16',
      status: 'In Progress',
      project_id: projectIds[0],
      assigned_to: userIds[3]
    },
    {
      title: 'RBAC Permission Middleware Enforcement',
      description: 'Audit REST endpoints to guarantee Admin, Project Lead, and Developer role privileges.',
      priority: 'High',
      due_date: '2026-09-17',
      status: 'In Progress',
      project_id: projectIds[4],
      assigned_to: userIds[2]
    },
    {
      title: 'Real-time Webhook Dispatcher Engine',
      description: 'Build queue processor for sending external webhook payloads on project status changes.',
      priority: 'Medium',
      due_date: '2026-09-13',
      status: 'Review',
      project_id: projectIds[3],
      assigned_to: userIds[2]
    },
    {
      title: 'Database Index Optimization for Task Queries',
      description: 'Add compound indexes on `project_id`, `assigned_to`, and `status` columns for faster lookup.',
      priority: 'Low',
      due_date: '2026-09-14',
      status: 'Review',
      project_id: projectIds[3],
      assigned_to: userIds[2]
    },
    {
      title: 'Setup Express REST API Modular Controllers',
      description: 'Construct modular route controllers, JSON parsers, CORS middleware, and health endpoints.',
      priority: 'High',
      due_date: '2026-09-05',
      status: 'Completed',
      project_id: projectIds[0],
      assigned_to: userIds[2]
    },
    {
      title: 'Define Taskora Brand Palette & Typography System',
      description: 'Select primary `#FF6B00` brand accent, `#111827` dark slate, Plus Jakarta Sans font, and 16px radius.',
      priority: 'High',
      due_date: '2026-09-04',
      status: 'Completed',
      project_id: projectIds[0],
      assigned_to: userIds[3]
    },
    {
      title: 'SQLite & PostgreSQL Dual Database Layer',
      description: 'Provide seamless SQLite zero-setup dev mode alongside production-grade PostgreSQL adapter.',
      priority: 'Medium',
      due_date: '2026-09-06',
      status: 'Completed',
      project_id: projectIds[4],
      assigned_to: userIds[4]
    }
  ];

  for (const item of workItemsData) {
    await query(
      `INSERT INTO work_items (title, description, priority, due_date, status, project_id, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [item.title, item.description, item.priority, item.due_date, item.status, item.project_id, item.assigned_to]
    );
  }

  // 4. Seed Activity Logs
  const activitiesData = [
    { user_id: userIds[0], user_name: 'Alex Rivera', user_avatar: usersData[0].avatar, action: 'moved task to Completed', target: 'Define Taskora Brand Palette' },
    { user_id: userIds[3], user_name: 'Elena Rostova', user_avatar: usersData[3].avatar, action: 'updated project status to Building', target: 'Taskora Core Platform 2.0' },
    { user_id: userIds[4], user_name: 'David Kim', user_avatar: usersData[4].avatar, action: 'started Focus Mode session on', target: 'Focus Mode 25-Min Pomodoro Timer' },
    { user_id: userIds[1], user_name: 'Sarah Chen', user_avatar: usersData[1].avatar, action: 'added member', target: 'Marcus Vance (Senior Backend Engineer)' },
    { user_id: userIds[2], user_name: 'Marcus Vance', user_avatar: usersData[2].avatar, action: 'moved task to Review', target: 'Real-time Webhook Dispatcher' }
  ];

  for (const act of activitiesData) {
    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target) VALUES (?, ?, ?, ?, ?)`,
      [act.user_id, act.user_name, act.user_avatar, act.action, act.target]
    );
  }

  console.log('✅ [Taskora Seed] Database populated with projects, work_items, team_members, and activity_logs!\n');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
