import React, { useState } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';

const TaskForm = ({ 
  initialData = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: ''
  },
  onSubmit,
  submitButtonText = 'Save Task',
  loading = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Input
          label="Task Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          error={errors.title}
          required
        />
        
        <TextArea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={4}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          
          <Select
            label="Priority"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          
          <Input
            label="Deadline"
            id="deadline"
            name="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;