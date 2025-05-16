// Store JWT token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("taskManagerToken", token);
  }
};

export const setAuthUserId = (user) => {
  if (user) {
    localStorage.setItem("UserId", user._id);
  }
};

// Get JWT token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("taskManagerToken");
};
export const getAuthUserId = () => {
  return localStorage.getItem("UserId");
};
// Remove JWT token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem("taskManagerToken");
};
export const removeAuthUserId = () => {
  localStorage.removeItem("UserId");
};
