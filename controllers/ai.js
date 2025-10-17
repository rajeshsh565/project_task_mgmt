import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import Task from '../models/Task.js';

dotenv.config();

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
export const summarizeTasks = async (req, res) => {
  const { projectId } = req.body;

  try {
    const tasks = await Task.find({ projectId });

    if (tasks.length === 0) {
      return res.json({ summary: 'No tasks found for this project to summarize.' });
    }

    const taskDescriptions = tasks.map(task => `- ${task.title}: ${task.description} (Status: ${task.status})`).join('\n');
    const prompt = `Summarize the following tasks for a project:\n${taskDescriptions}. Respond only with detailed summary and nothing else.`;

    const chat = ai.chats.create({ model: GEMINI_MODEL });
    const result = await chat.sendMessage({ message: prompt });
    const summary = result.candidates[0].content.parts[0].text;

    res.json({ summary });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const askQuestion = async (req, res) => {
  const { taskId, question } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const prompt = `Given the task with title "${task.title}" and description "${task.description}", answer the following question: ${question}. Respond only with answer and nothing else.`;

    const chat = ai.chats.create({ model: GEMINI_MODEL });
    const result = await chat.sendMessage({ message: prompt });
    const answer = result.candidates[0].content.parts[0].text;

    res.json({ answer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
