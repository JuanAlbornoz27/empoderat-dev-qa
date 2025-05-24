import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseInfo from './pages/CourseInfo';
import ModuleManagement from './pages/ModuleManagement';
import CourseManagement from './pages/CourseManagement';
import CategoryManagement from './pages/CategoryManagement'; 


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses/:id" element={<CourseInfo />} />
                
                {/* Rutas de administración de cursos */}
                <Route path="/admin/courses" element={<CourseManagement />} />
                <Route path="/admin/courses/create" element={<CourseManagement />} />
                <Route path="/admin/courses/edit/:id" element={<CourseManagement />} />
                
                {/* Rutas de administración de módulos */}
                <Route path="/admin/modules" element={<ModuleManagement />} />
                <Route path="/admin/modules/course/:courseId" element={<ModuleManagement />} />

                {/* Rutas de administración de categorías */}
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/categories/create" element={<CategoryManagement />} />
                <Route path="/admin/categories/edit/:id" element={<CategoryManagement />} />
            </Routes>
        </Router>
    );
}