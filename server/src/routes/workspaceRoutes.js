const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, workspaceController.getWorkspaces);
router.post('/', authenticateToken, workspaceController.createWorkspace);
router.put('/:id', authenticateToken, workspaceController.updateWorkspace);
router.delete('/:id', authenticateToken, workspaceController.deleteWorkspace);

module.exports = router;
