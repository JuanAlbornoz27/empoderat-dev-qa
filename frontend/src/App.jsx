import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseInfo from "./pages/CourseInfo";
import ModuleManagementAll from "./pages/ModuleManagementAll";
import CourseManagement from "./pages/CourseManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ModuleManagement from "./pages/ModuleManagement";
import ModulesList from "./pages/ModulesList";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import Course from "./pages/Course";
import ProfileInfo from "./pages/ProfileInfo";
import Unauthorized from "./components/Unauthorized";
import { getCourses } from "./data/apiService";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los cursos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const DefaultRedirect = () => {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (user.role === "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role === "APRENDIZ") {
      return <Navigate to="/cursos" replace />;
    }

    return <Navigate to="/" replace />;
  };
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas generales */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseInfo />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute adminOnly>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/create"
            element={
              <ProtectedRoute adminOnly>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/modules"
            element={
              <ProtectedRoute adminOnly>
                <ModuleManagementAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/modules/course/:courseId"
            element={
              <ProtectedRoute adminOnly>
                <ModuleManagementAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute adminOnly>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para aprendiz */}
          <Route
            path="/cursos"
            element={
              <ProtectedRoute aprendizOnly>
                <Courses cursos={courses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-cursos"
            element={
              <ProtectedRoute aprendizOnly>
                <MyCourses cursos={courses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/curso/:cursoId"
            element={
              <ProtectedRoute aprendizOnly>
                <Course cursos={courses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modulos"
            element={
              <ProtectedRoute aprendizOnly>
                <ModulesList />
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
