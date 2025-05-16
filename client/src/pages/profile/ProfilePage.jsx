import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Upload, Trash2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile, updateAvatar } from '../../services/authService';
import { formatDate } from '../../utils/dateUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Add a local state for the avatar
  const [localAvatar, setLocalAvatar] = useState(currentUser?.avatar || '');
  
  // Update local avatar when currentUser changes
  useEffect(() => {
    if (currentUser?.avatar) {
      setLocalAvatar(currentUser.avatar);
    }
  }, [currentUser?.avatar]);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    age: currentUser?.age || '',
  });
  
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 0)) {
      newErrors.age = 'Age must be a valid number';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setUpdating(true);
      setUpdateError(null);
      
      // Create payload with fields that can be updated
      const payload = {
        name: formData.name,
        email: currentUser.email,
        age: formData.age ? parseInt(formData.age) : undefined,
      };
      
      await updateUserProfile(payload);
      setCurrentUser({ ...currentUser, name: payload.name, age: payload.age });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setUpdateError(err.response?.data?.msg || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleAvatarChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      toast.error('Avatar image must be less than 5MB');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and GIF images are allowed');
      return;
    }
    
    try {
      setUploadingAvatar(true);
      setUpdateError(null);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await updateAvatar(formData);
      console.log('Avatar Updated: ', response.avatar);
      
      // Update local state first for immediate feedback
      setLocalAvatar(response.avatar);
      
      // Try to update context state, but don't rely solely on it
      try {
        if (typeof setCurrentUser === 'function') {
          setCurrentUser({ ...currentUser, avatar: response.avatar });
        }
      } catch (contextError) {
        console.warn('Context update failed:', contextError);
        // The local state update will still work
      }
      
      toast.success('Avatar updated successfully');
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setUpdateError(err.response?.data?.msg || 'Failed to update avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      e.target.value = null;
    }
  };
  
  // Removed the handleDeleteAvatar function since you don't want to implement it
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Helper function to get the proper avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return `${API_BASE_URL}/defaults/default-avatar.png`;
    // If it's already an absolute URL
    if (avatarPath.startsWith('http')) return avatarPath;
    // Otherwise join with API base URL
    return `${API_BASE_URL}${avatarPath}`;
  };
  
  const avatarUrl = getAvatarUrl(localAvatar || currentUser?.avatar);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center space-x-4">
          <div 
            className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center relative overflow-hidden cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {uploadingAvatar ? (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-16 w-16 object-cover"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    e.target.src = `${API_BASE_URL}/defaults/default-avatar.png`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,image/gif"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900">{currentUser?.name}</h2>
            <p className="text-sm text-gray-500">Member since {formatDate(currentUser?.date)}</p>
          </div>
        </div>
        
        <div className="p-6">
          {updateError && (
            <Alert
              variant="error"
              message={updateError}
              className="mb-6"
              dismissible
              onDismiss={() => setUpdateError(null)}
            />
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
              <Input
                label="Email Address"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
              
              <Input
                label="Age"
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
                placeholder="Enter your age (optional)"
              />
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="danger"
                onClick={handleLogout}
              >
                Log Out
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                loading={updating}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;