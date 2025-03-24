const express = require('express');
const {
  solveDoubt,
  summarizeNotes,
  generateQuiz
} = require('../controllers/aiController');
const {
  verifyToken
} = require('../middleware/authMiddleware');

const router = express.Router();

// AI Doubt Solver
router.post('/solve-doubt', verifyToken, solveDoubt);

// Summarize Notes
router.post('/summarize', verifyToken, summarizeNotes);

// Generate Quiz (Premium mock feature)
router.post('/generate-quiz', verifyToken, generateQuiz);

module.exports = router; 