import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css';
import logo from '../assets/empodera-logo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        documentNumber: '',
        phone: '',
        birthDate: '',
        city: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingrese un email válido');
            return false;
        }

        // Validar que todos los campos requeridos estén llenos
        const requiredFields = ['name', 'lastName', 'email', 'documentNumber', 'phone', 'birthDate', 'city', 'password'];
        for (let field of requiredFields) {
            if (!formData[field].trim()) {
                setError('Todos los campos marcados con * son obligatorios');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Preparar datos para enviar (sin confirmPassword)
            const { confirmPassword, ...userData } = formData;

            await register(userData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Registro exitoso. Ya puede iniciar sesión con sus credenciales.'
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('Registration error:', err);

            if (err.response?.status === 400) {
                const errorMessage = err.response.data?.message || err.response.data;
                if (typeof errorMessage === 'string' && errorMessage.includes('email')) {
                    setError('Este email ya está registrado. Por favor use otro email.');
                } else {
                    setError('Error en los datos proporcionados. Por favor verifique la información.');
                }
            } else if (err.response?.status === 409) {
                setError('Ya existe un usuario con este email o número de documento.');
            } else {
                setError('Error al registrar usuario. Por favor intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="success-message">
                        <h2>¡Registro Exitoso!</h2>
                        <p>Su cuenta ha sido creada correctamente. Será redirigido al login en unos segundos...</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <section className="logo-section">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="EmpoderaT Logo" className="logo-image" />
                    </Link>
                </div>
            </section>

            <div className="auth-container">
                <div className="auth-tabs">
                    <Link to="/login" className="auth-tab">Ingresar</Link>
                    <Link to="/register" className="auth-tab active">Registrarse</Link>
                </div>

                <div className="auth-welcome">
                    <h2>¡Bienvenida a Empodera T!</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombres *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Apellidos *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={handleChange}
                            placeholder="Número de documento *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Número telefónico *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            name="birthDate"
                            required
                            className="date-input"
                            onChange={handleChange}
                            value={formData.birthDate}
                            min="1900-01-01"
                            max={new Date().toISOString().split('T')[0]}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Ciudad *"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña *"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmar contraseña *"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;