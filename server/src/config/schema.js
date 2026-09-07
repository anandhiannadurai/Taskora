const { query } = require('./db');

async function initSchema() {
  console.log('[Taskora Schema] Initializing database tables...');

  // 1. Users Table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Developer',
      avatar TEXT,
      bio TEXT,
      title TEXT,
      theme TEXT DEFAULT 'light',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Projects Table (Renamed from workspaces)
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'Medium',
      status TEXT NOT NULL DEFAULT 'Building',
      start_date TEXT,
      end_date TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Work Items (Tasks) Table - uses project_id
  await query(`
    CREATE TABLE IF NOT EXISTS work_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'Medium',
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'Backlog',
      project_id INTEGER,
      assigned_to INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Team Members Table - uses project_id
  await query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER,
      role TEXT DEFAULT 'Developer',
      activity_status TEXT DEFAULT 'Active',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Activity Logs Table
  await query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      user_avatar TEXT,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[Taskora Schema] Tables (users, projects, work_items, team_members, activity_logs) initialized successfully.');
}

module.exports = { initSchema };
