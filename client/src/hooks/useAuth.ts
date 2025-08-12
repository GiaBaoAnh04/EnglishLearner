// export const useAuth = () => {
//   const token = localStorage.getItem("token");
//   const user = localStorage.getItem("user");
//   const currentUser = user ? JSON.parse(user) : null;
//   return {
//     isAuthenticated: !!token,
//     currentUser,
//     token,
//   };
// };

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  // Thêm các field khác nếu cần
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    // Chỉ chạy trên client-side
    const initializeAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          const user = localStorage.getItem("user");
          const currentUser = user ? JSON.parse(user) : null;

          setAuthState({
            isAuthenticated: !!token,
            currentUser,
            token,
            loading: false,
          });
        } else {
          // Server-side: không authenticated
          setAuthState({
            isAuthenticated: false,
            currentUser: null,
            token: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        setAuthState({
          isAuthenticated: false,
          currentUser: null,
          token: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Function để logout
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
      token: null,
      loading: false,
    });
  };

  return {
    ...authState,
    logout,
  };
};
