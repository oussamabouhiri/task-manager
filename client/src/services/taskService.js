import api from "./api";

// Get all tasks
export const getAllTasks = async () => {
  const response = await api.get("/api/tasks");
  return response.data;
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  const response = await api.get(`/api/tasks/${taskId}`);
  return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post("/api/tasks/create", taskData);
  return response.data;
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/api/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/api/tasks/${taskId}`);
  return response.data;
};

// Filter tasks
export const filterTasks = async (filters) => {
  const { status, search, sortBy, sortOrder } = filters;
  let url = "/api/tasks/filter/results?";

  if (status) url += `status=${status}&`;
  if (search) url += `search=${search}&`;
  if (sortBy) url += `sortBy=${sortBy}&`;
  if (sortOrder) url += `sortOrder=${sortOrder}&`;

  // Remove trailing ampersand if present
  url = url.endsWith("&") ? url.slice(0, -1) : url;

  const response = await api.get(url);
  return response.data;
};
