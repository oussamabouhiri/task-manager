import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/layout/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { createTask } from '../../services/taskService';

const CreateTaskPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      await createTask(formData);
      toast.success('Task created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.response?.data?.msg || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
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
          onSubmit={handleSubmit}
          submitButtonText="Create Task"
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default CreateTaskPage;