import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const EditProjectModal = () => {
  const {
    isProjectModalOpen,
    closeProjectModal,
    handleProjectUpdated,
    editingProject,
  } = useAppContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [editingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = { name, description };

    try {
      if (editingProject) {
        const res = await axios.put(`/api/v1/projects/${editingProject._id}`, projectData);
        handleProjectUpdated(res.data);
      } else {
        const res = await axios.post('/api/v1/projects', projectData);
        handleProjectUpdated(res.data);
      }
      setName('');
      setDescription('');
      closeProjectModal();
    } catch (error) {
      console.error(`Error ${editingProject ? 'updating' : 'creating'} project:`, error);
    }
  };

  if (!isProjectModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={closeProjectModal} className="text-gray-400 w-8 h-8 flex justify-center items-center border rounded-full leading-[12px] cursor-pointer hover:border-2 hover:text-red-700">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            required
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24"
            required
          ></textarea>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 cursor-pointer">
            {editingProject ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
