import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Register.css';
import logo from '../assets/empodera-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('authToken', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor intente nuevamente.');
      console.error('Login error:', err);
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
          <Link to="/login" className="auth-tab active">Ingresar</Link>
          <Link to="/register" className="auth-tab">Registrarse</Link>
        </div>

        <div className="auth-welcome">
          <h2>¡Bienvenida a Empodera T!</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>

          <button type="submit" className="auth-button">Entrar</button>

          <div className="auth-links">
            <Link to="/forgot-password" className="forgot-password-link">
              ¿Olvidó su contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;