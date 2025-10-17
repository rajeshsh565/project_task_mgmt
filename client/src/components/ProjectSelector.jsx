import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ProjectSelector = () => {
  const [projects, setProjects] = useState([]);
  const { newProject, navigate, location } = useAppContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/v1/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, [newProject]);

  const selectedProjectId = location.pathname.startsWith('/project/') ? location.pathname.split('/')[2] : "";

  const handleProjectSelect = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <select 
        onChange={(e) => handleProjectSelect(e.target.value)} 
        value={selectedProjectId}
        className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-10 cursor-pointer">
      <option value="" disabled>Select a Project</option>
      {projects.map((project) => (
        <option key={project._id} value={project._id}>
          {project.name}
        </option>
      ))}
    </select>
  );
};

export default ProjectSelector;