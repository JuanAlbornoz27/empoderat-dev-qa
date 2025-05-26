import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css';
import logo from '../assets/empodera-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Redirigir a la página anterior o al dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      if (err.response?.status === 401) {
        setError('Credenciales inválidas. Por favor verifique su email y contraseña.');
      } else if (err.response?.status === 400) {
        setError('Datos de entrada inválidos. Por favor verifique la información ingresada.');
      } else {
        setError('Error al iniciar sesión. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>

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