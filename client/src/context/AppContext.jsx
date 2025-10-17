
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [newProject, setNewProject] = useState(null);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [projects, setProjects] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const onProjectListPage = location.pathname === '/';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/v1/projects');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, [newProject]);

  const handleProjectUpdated = (project) => {
    setNewProject(project);
    setEditingProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setEditingProject(null);
  }

  const handleTaskUpdated = (task) => {
    setTaskToUpdate(task);
    setEditingTask(null);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
    setEditingTask(null);
  }

  const value = {
    newProject,
    isProjectModalOpen,
    editingProject,
    isTaskModalOpen,
    editingTask,
    taskToUpdate,
    onProjectListPage,
    projects,
    setProjects,
    handleProjectUpdated,
    handleEditProject,
    closeProjectModal,
    handleTaskUpdated,
    handleCreateTask,
    handleEditTask,
    closeTaskModal,
    setProjectModalOpen,
    location,
    navigate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
