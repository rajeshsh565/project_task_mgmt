import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const KanbanBoard = ({ projectId }) => {
  const { taskToUpdate } = useAppContext();
  const initialColumns = {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  };

  const [boardData, setBoardData] = useState({ tasks: {}, columns: initialColumns });

  useEffect(() => {
    if (projectId) {
      const fetchTasks = async () => {
        try {
          const res = await axios.get(`/api/v1/tasks/project/${projectId}`);
          const tasksData = res.data.reduce((acc, task) => {
            acc[task._id] = task;
            return acc;
          }, {});

          const newColumns = { ...initialColumns };
          Object.values(newColumns).forEach(c => c.taskIds = []);

          res.data.forEach(task => {
            const columnId = Object.keys(initialColumns).find(key => initialColumns[key].title === task.status);
            if(columnId) {
              newColumns[columnId].taskIds.push(task._id);
            }
          });

          setBoardData({ tasks: tasksData, columns: newColumns });
        } catch (err) {
          console.error(err);
        }
      };
      fetchTasks();
    }
  }, [projectId, taskToUpdate]);

  const onTaskDeleted = (deletedTaskId) => {
    const newTasks = { ...boardData.tasks };
    delete newTasks[deletedTaskId];

    const newColumns = { ...boardData.columns };
    Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== deletedTaskId);
    });

    setBoardData({ tasks: newTasks, columns: newColumns });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...start,
            taskIds: newTaskIds,
        };

        const newState = {
            ...boardData,
            columns: {
                ...boardData.columns,
                [newColumn.id]: newColumn,
            },
        };

        setBoardData(newState);
        return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newStatus = newFinish.title;
    const updatedTask = { ...boardData.tasks[draggableId], status: newStatus };

    const newTasks = {
        ...boardData.tasks,
        [draggableId]: updatedTask
    }

    const newState = {
      ...boardData,
      tasks: newTasks,
      columns: {
        ...boardData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoardData(newState);

    try {
        await axios.put(`/api/v1/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
        console.error('Error updating task status:', err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center">
        <div className="flex space-x-4 overflow-x-auto p-4">
            {Object.values(boardData.columns).map(column => {
              const tasks = column.taskIds.map(taskId => boardData.tasks[taskId]).filter(Boolean);
              return <Column key={column.id} column={column} tasks={tasks} onTaskDeleted={onTaskDeleted} />;
            })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
