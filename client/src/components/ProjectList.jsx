import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '../utils/icons.jsx';
import { useAppContext } from '../context/AppContext';
import LoadingView from '../utils/LoadingView.jsx';

const ProjectList = () => {
  const { handleEditProject, projects, setProjects} = useAppContext();

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/v1/projects/${projectId}`);
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  if(!projects) {
    return <LoadingView/>
  }

  if (projects?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl text-gray-500 mb-4 select-none">No projects found.</h2>
        <button onClick={() => handleEditProject(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg cursor-pointer">
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
        <h1 className='font-bold text-xl'>Project List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
            <div key={project._id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between h-48">
                <div>
                    <h3 className="font-bold text-lg mb-2 text-white truncate">{project.name}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                    <div className="flex space-x-2">
                        <button onClick={() => handleEditProject(project)} className="text-gray-400 hover:text-white cursor-pointer"><EditIcon /></button>
                        <button onClick={() => handleDelete(project._id)} className="text-gray-400 hover:text-red-500 cursor-pointer"><DeleteIcon /></button>
                        <Link to={`/project/${project._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            View Board
                        </Link>
                    </div>
                </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default ProjectList;
