// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const updateUserInfo = (newUserInfo) => {
    // Actualizar el estado del usuario
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserInfo,
    }));

    // Actualizar la información en localStorage
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const updatedUserInfo = {
      ...storedUserInfo,
      ...newUserInfo,
    };
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = {
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      // Limpiar estado local incluso si hay error
      setUser(null);
    }
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const isAdmin = () => hasRole("ADMIN");
  const isAprendiz = () => hasRole("APRENDIZ");

  // Eliminar la definición de value y usar directamente el objeto en el Provider
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        isAprendiz,
        isAuthenticated: !!user,
        loading,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
