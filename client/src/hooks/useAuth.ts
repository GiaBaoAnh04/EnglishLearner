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

// hooks/useAuth.ts
import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    currentUser: null as User | null,
    token: null as string | null,
    loading: true,
  });

  // Function để update auth state
  const updateAuthState = () => {
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
    }
  };

  useEffect(() => {
    updateAuthState();

    // Listen for storage changes (khi login ở tab khác)
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function để trigger update sau khi login
  const refreshAuth = () => {
    updateAuthState();
  };

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
    refreshAuth,
    logout,
  };
};
