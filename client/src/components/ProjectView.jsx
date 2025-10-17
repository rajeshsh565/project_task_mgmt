import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import KanbanBoard from './KanbanBoard';
import AIComponent from './AIComponent';
import { BackIcon } from '../utils/icons';
import LoadingView from '../utils/LoadingView';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/v1/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError('Failed to fetch project data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <LoadingView/>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Link to="/" className="text-gray-400 hover:text-white mr-4">
          <BackIcon />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-gray-500">
            Created on: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-gray-300 mb-8">{project.description}</p>

      <KanbanBoard projectId={id} />
      <AIComponent projectId={id} />
    </div>
  );
};

export default ProjectView;
