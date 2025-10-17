import express from 'express';
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.js';

const router = express.Router();

router.get('/project/:projectId', getTasksByProject);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;