import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingScreen from '../../components/common/LoadingScreen';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { getTaskById, deleteTask, updateTask } from '../../services/taskService';
import { formatDateTime, getDeadlineInfo } from '../../utils/dateUtils';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const taskData = await getTaskById(id);
        setTask(taskData);
        setError(null);
      } catch (err) {
        console.error('Failed to load task:', err);
        setError('Failed to load task details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTask();
  }, [id]);
  
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateTask(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      toast.error('Failed to update task status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <LoadingScreen />
      </MainLayout>
    );
  }
  
  if (error && !task) {
    return (
      <MainLayout>
        <Alert
          variant="error"
          title="Error"
          message={error}
          className="mb-6"
        />
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </MainLayout>
    );
  }
  
  // Priority styling
  const priorityClass = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  }[task.priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  
  // Status styling and icon
  const statusConfig = {
    pending: {
      classes: 'bg-gray-100 text-gray-800',
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
    'in progress': {
      classes: 'bg-yellow-100 text-yellow-800',
      icon: <AlertCircle className="h-4 w-4 mr-1" />,
    },
    completed: {
      classes: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
  }[task.status] || { classes: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4 mr-1" /> };
  
  // Deadline information
  const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="secondary"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link to={`/tasks/${id}/edit`}>
            <Button variant="secondary" className="flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            className="flex items-center"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${priorityClass}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.classes}`}>
                  {statusConfig.icon}
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              
              {!updatingStatus && task.status !== 'completed' && (
                <div className="mt-3">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Completed
                  </Button>
                </div>
              )}
              
              {!updatingStatus && task.status === 'pending' && (
                <div className="mt-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleStatusChange('in progress')}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Mark as In Progress
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              {deadlineInfo && (
                <>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                  <p className={`text-sm ${
                    deadlineInfo.status === 'overdue' 
                      ? 'text-red-600 font-medium' 
                      : deadlineInfo.status === 'approaching'
                        ? 'text-yellow-600'
                        : 'text-gray-900'
                  }`}>
                    {formatDateTime(task.deadline)}
                    <span className="ml-2 italic">({deadlineInfo.text})</span>
                  </p>
                </>
              )}
              
              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-1">Created At</h3>
              <p className="text-sm text-gray-900">{formatDateTime(task.createdAt)}</p>
            </div>
          </div>
          
          {task.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap text-gray-800">{task.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </MainLayout>
  );
};

export default TaskDetailsPage;