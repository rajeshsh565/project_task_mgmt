import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { EditIcon, DeleteIcon } from '../utils/icons.jsx';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const TaskCard = ({ task, index, onTaskDeleted }) => {
  const { handleEditTask } = useAppContext();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete task: "${task.title}"?`)) {
        try {
            await axios.delete(`/api/v1/tasks/${task._id}`);
            onTaskDeleted(task._id);
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="bg-gray-700 rounded-md p-3 mb-3 shadow-md cursor-grab"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h4 className="font-bold text-lg mb-2">{task.title}</h4>
          <p className="text-sm text-gray-300 mb-3">{task.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
            <div className="flex space-x-2">
              <button onClick={() => handleEditTask(task)} className="text-gray-400 hover:text-white">
                <EditIcon />
              </button>
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;