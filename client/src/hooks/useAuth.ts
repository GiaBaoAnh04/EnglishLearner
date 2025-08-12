export const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const currentUser = user ? JSON.parse(user) : null;
  return {
    isAuthenticated: !!token,
    currentUser,
    token,
  };
};
