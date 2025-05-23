import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/HeaderLearner.css';
import profileIcon from '../assets/profileIcon.png';
import empoderatLogo from '../assets/empodera-Logo.png';

const Header = ({texto1, texto2, texto3, texto4}) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/perfil');
    };

    return (
        <div className="header">
            <div className="logo">
                <img src={empoderatLogo} alt="Empoderat" />
            </div>
            <nav className="nav">
                <ul>
                    <li><NavLink to="/cursos" className={({isActive}) => isActive ? "active-link" : ""}>{texto1}</NavLink></li>
                    <li><NavLink to="/mis-cursos" className={({isActive}) => isActive ? "active-link" : ""}>{texto2}</NavLink></li>
                    <li><NavLink to="/modulos" className={({isActive}) => isActive ? "active-link" : ""}>{texto3}</NavLink></li>
                    <li><NavLink to="/contacto" className={({isActive}) => isActive ? "active-link" : ""}>{texto4}</NavLink></li>
                </ul>
            </nav>
            <div className="perfil">
                <button className="perfil-btn" onClick={handleProfileClick}>
                    <img src={profileIcon} alt="Perfil" />
                </button>
            </div>
        </div>
    );
};

export default Header;