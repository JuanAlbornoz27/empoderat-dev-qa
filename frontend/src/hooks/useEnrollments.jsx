import { useState } from 'react';
import { enrollmentService } from '../services/api';

export const useEnrollments = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadEnrolledCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await enrollmentService.getEnrolledCourses();
            setEnrolledCourses(response.data || []);
        } catch (error) {
            console.error('Error al cargar los cursos inscritos:', error);
            setError('Error al cargar los cursos inscritos');
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const enrollInCourse = async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            await enrollmentService.enrollInCourse(courseId);
            // Recargar la lista después de inscribirse
            await loadEnrolledCourses();

            return { success: true };
        } catch (error) {
            console.error('Error al inscribirse en el curso:', error);
            setError('Error al inscribirse en el curso');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const unenrollFromCourse = async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            await enrollmentService.unenrollFromCourse(courseId);
            // Recargar la lista después de desinscribirse
            await loadEnrolledCourses();

            return { success: true };
        } catch (error) {
            console.error('Error al desinscribirse del curso:', error);
            setError('Error al desinscribirse del curso');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        enrolledCourses,
        loading,
        error,
        loadEnrolledCourses,
        enrollInCourse,
        unenrollFromCourse
    };
};