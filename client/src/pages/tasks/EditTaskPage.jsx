import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/layout/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingScreen from '../../components/common/LoadingScreen';
import { getTaskById, updateTask } from '../../services/taskService';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  
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
  
  const handleSubmit = async (formData) => {
    try {
      setUpdating(true);
      setError(null);
      
      await updateTask(id, formData);
      toast.success('Task updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err.response?.data?.msg || 'Failed to update task. Please try again.');
    } finally {
      setUpdating(false);
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
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Button
          variant="secondary"
          size="sm"
          className="mr-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
      </div>
      
      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          className="mb-6"
          dismissible
          onDismiss={() => setError(null)}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TaskForm
          initialData={{
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'pending',
            priority: task.priority || 'medium',
            deadline: task.deadline || ''
          }}
          onSubmit={handleSubmit}
          submitButtonText="Update Task"
          loading={updating}
        />
      </div>
    </MainLayout>
  );
};

export default EditTaskPage;