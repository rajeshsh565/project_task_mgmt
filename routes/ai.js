import express from 'express';
import { summarizeTasks, askQuestion } from '../controllers/ai.js';

const router = express.Router();

router.post('/summarize', summarizeTasks);
router.post('/ask', askQuestion);

export default router;