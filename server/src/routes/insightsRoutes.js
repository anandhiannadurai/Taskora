const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, insightsController.getInsights);

module.exports = router;
