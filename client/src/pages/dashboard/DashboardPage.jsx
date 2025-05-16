import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/layout/MainLayout';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilter from '../../components/tasks/TaskFilter';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Button from '../../components/common/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import Alert from '../../components/common/Alert';
import { getAllTasks, filterTasks, deleteTask } from '../../services/taskService';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await getAllTasks();
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = async (filterData) => {
    try {
      setLoading(true);
      const filteredTasks = await filterTasks(filterData);
      setTasks(filteredTasks);
    } catch (err) {
      console.error('Failed to filter tasks:', err);
      toast.error('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete);
      setTasks(tasks.filter(task => task._id !== taskToDelete));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link to="/tasks/create">
            <Button variant="primary" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-1" />
              New Task
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-6">
        <TaskFilter
          filters={filters}
          setFilters={setFilters}
          onFilterChange={handleFilterChange}
        />
        
        {loading ? (
          <div className="flex justify-center my-12">
            <LoadingScreen />
          </div>
        ) : error ? (
          <Alert variant="error" title="Error" message={error} className="my-6" />
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">Get started by creating a new task.</p>
            <Link to="/tasks/create">
              <Button variant="primary" className="flex items-center mx-auto">
                <PlusCircle className="h-4 w-4 mr-1" />
                Create your first task
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}
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

export default DashboardPage;