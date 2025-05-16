import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getDeadlineInfo } from '../../utils/dateUtils';

const priorityClasses = {
  low: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  high: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

const statusClasses = {
  pending: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: <Clock className="w-4 h-4 mr-1" />,
  },
  'in progress': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: <AlertCircle className="w-4 h-4 mr-1" />,
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
  },
};

const TaskCard = ({ task, onDeleteClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityClass = priorityClasses[task.priority] || priorityClasses.medium;
  const statusClass = statusClasses[task.status] || statusClasses.pending;
  
  const deadlineInfo = getDeadlineInfo(task.deadline);
  
  let deadlineClasses = 'text-gray-600';
  if (deadlineInfo.status === 'approaching') {
    deadlineClasses = 'text-yellow-600';
  } else if (deadlineInfo.status === 'overdue') {
    deadlineClasses = 'text-red-600 font-medium';
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <Link to={`/tasks/${task._id}`} className="block">
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
          </Link>
          <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass.bg} ${priorityClass.text}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </div>
        </div>
        
        {task.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass.bg} ${statusClass.text}`}>
              {statusClass.icon}
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </div>
          </div>
          
          {task.deadline && (
            <div className={`text-sm ${deadlineClasses}`}>
              {deadlineInfo.text}
            </div>
          )}
        </div>
      </div>
      
      {/* Actions bar */}
      <div 
        className={`flex justify-end p-3 bg-gray-50 border-t border-gray-100 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Link 
          to={`/tasks/${task._id}/edit`}
          className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-2"
          title="Edit Task"
        >
          <Edit className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Link>
        <button
          onClick={() => onDeleteClick(task._id)}
          className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;