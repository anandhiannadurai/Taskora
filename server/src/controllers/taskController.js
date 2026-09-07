const { query } = require('../config/db');

exports.getTasks = async (req, res) => {
  try {
    const { project_id, status, priority, search } = req.query;
    let sql = `
      SELECT t.*,
             p.name as project_name,
             u.name as assignee_name,
             u.avatar as assignee_avatar,
             u.role as assignee_role
      FROM work_items t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) {
      sql += ' AND t.project_id = ?';
      params.push(project_id);
    }
    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }
    if (priority) {
      sql += ' AND t.priority = ?';
      params.push(priority);
    }
    if (search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY t.id DESC';

    const tasks = await query(sql, params);
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date, status, project_id, assigned_to } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const taskStatus = status || 'Backlog';
    const taskPriority = priority || 'Medium';
    const dueDate = due_date || '2026-09-30';

    const result = await query(
      `INSERT INTO work_items (title, description, priority, due_date, status, project_id, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || '', taskPriority, dueDate, taskStatus, project_id || null, assigned_to || null]
    );

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'created task', title]
    );

    const fetched = await query(
      `SELECT t.*, p.name as project_name, u.name as assignee_name, u.avatar as assignee_avatar
       FROM work_items t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = ?`,
      [result.id]
    );

    res.status(201).json({ success: true, message: 'Task created', task: fetched[0] });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, status, project_id, assigned_to } = req.body;

    const existing = await query('SELECT * FROM work_items WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const cur = existing[0];
    const newStatus = status !== undefined ? status : cur.status;

    await query(
      `UPDATE work_items
       SET title = ?, description = ?, priority = ?, due_date = ?, status = ?, project_id = ?, assigned_to = ?
       WHERE id = ?`,
      [
        title !== undefined ? title : cur.title,
        description !== undefined ? description : cur.description,
        priority !== undefined ? priority : cur.priority,
        due_date !== undefined ? due_date : cur.due_date,
        newStatus,
        project_id !== undefined ? project_id : cur.project_id,
        assigned_to !== undefined ? assigned_to : cur.assigned_to,
        id
      ]
    );

    const actionText = cur.status !== newStatus ? `moved task to ${newStatus}` : 'updated task';
    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, actionText, title || cur.title]
    );

    const updated = await query(
      `SELECT t.*, p.name as project_name, u.name as assignee_name, u.avatar as assignee_avatar
       FROM work_items t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = ?`,
      [id]
    );

    res.json({ success: true, message: 'Task updated', task: updated[0] });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM work_items WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await query('DELETE FROM work_items WHERE id = ?', [id]);

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'deleted task', existing[0].title]
    );

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};
