import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setError('');

        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError('Error al registrarse. Por favor intente nuevamente.');
            console.error('Registration error:', err);
        }
    };

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
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            required
                            className="date-input"
                            onChange={handleChange}
                            value={formData.birthdate || ''}
                            min="1900-01-01"
                            max={new Date().toISOString().split('T')[0]}
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
                        />
                    </div>

                    <button type="submit" className="auth-button">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default Register;