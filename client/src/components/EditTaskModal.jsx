import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const EditTaskModal = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    handleTaskUpdated,
    editingTask,
    location
  } = useAppContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const projectId = location.pathname.startsWith('/project/') ? location.pathname.split('/')[2] : null

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId && !editingTask) {
      alert('Please select a project first.');
      return;
    }

    const taskData = { title, description, projectId: editingTask ? editingTask.projectId : projectId };

    try {
      if (editingTask) {
        const res = await axios.put(`/api/v1/tasks/${editingTask._id}`, taskData);
        handleTaskUpdated(res.data);
      } else {
        const res = await axios.post('/api/v1/tasks', { ...taskData, status: 'To Do' });
        handleTaskUpdated(res.data);
      }
      closeTaskModal();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(`Error ${editingTask ? 'updating' : 'creating'} task:`, error);
    }
  };

  if (!isTaskModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={closeTaskModal} className="text-gray-400 w-8 h-8 flex justify-center items-center border rounded-full leading-[12px] cursor-pointer hover:border-2 hover:text-red-700">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            required
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24"
            required
          ></textarea>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 cursor-pointer">
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
