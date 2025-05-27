import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/empodera-logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Link to="/">
                            <img src={logo} alt="EmpoderaTé Logo" className="footer-logo-img" />
                        </Link>
                        <p className="footer-tagline">Pequeños avances, grandes transformaciones</p>
                    </div>

                    <div className="footer-links">
                       

                        <div className="footer-links-column">
                            <h4>Ayuda</h4>
                            <ul>
                                <li><Link to="/faq">Preguntas frecuentes</Link></li>
                                <li><Link to="/contact">Contacto</Link></li>
                                <li><Link to="/terms">Términos y condiciones</Link></li>
                                <li><Link to="/privacy">Política de privacidad</Link></li>
                            </ul>
                        </div>

                        <div className="footer-links-column">
                            <h4>Contáctanos</h4>
                            <p>Email: info@empodera-t.com</p>
                            <p>Teléfono: +57 123 456 7890</p>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fa fa-facebook"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fa fa-instagram"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fa fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} EmpoderaT. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
