import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { ToDoIcon, InProgressIcon, DoneIcon } from '../utils/icons.jsx';

const Column = ({ column, tasks, onTaskDeleted }) => {

  const renderIcon = () => {
    switch (column.title) {
      case 'To Do':
        return <ToDoIcon />;
      case 'In Progress':
        return <InProgressIcon />;
      case 'Done':
        return <DoneIcon />;
      default:
        return null;
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
            {renderIcon()}
            <h3 className="font-bold text-xl text-white">{column.title}</h3>
        </div>
        <span className="text-gray-400 bg-gray-700 rounded-full px-2 py-1 text-sm font-semibold">{tasks.length}</span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`min-h-[200px] rounded-md transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-gray-700' : 'bg-gray-800'}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard key={task._id} task={task} index={index} onTaskDeleted={onTaskDeleted} />
              ))
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-700 rounded-md">
                <p className="text-gray-500">Drag tasks here</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
