import api from "./api";

// Login user
export const loginUser = async (email, password) => {
  const response = await api.post("/api/users/login", { email, password });
  return response.data;
};

// Register user
export const registerUser = async (name, email, password) => {
  const response = await api.post("/api/users/register", {
    name,
    email,
    password,
  });
  return response.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const response = await api.get("/api/users/me");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put("/api/users/profile", userData);
  return response.data;
};

// Fix the avatar upload function
export const updateAvatar = async (formData) => {
  const response = await api.post("/api/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
