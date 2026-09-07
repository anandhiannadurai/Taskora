const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, memberController.getMembers);
router.post('/', authenticateToken, memberController.addMember);
router.delete('/:id', authenticateToken, memberController.deleteMember);

module.exports = router;
