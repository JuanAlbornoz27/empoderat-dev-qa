import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/HeaderIndex.css";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import empoderatLogo from "../assets/empodera-logo.png";
import profileIcon from "../assets/profile-icon.png";

const Header = ({ texto1, texto2, texto3, texto4 }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

    const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  return (
    <div className="header">
      <div className="logo">
        <img src={empoderatLogo} alt="Empoderat" />
      </div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {texto1}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {texto2}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/modules"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {texto3}
            </NavLink>
          </li>
          <li>
            <NavLink>
              {texto4}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-actions">
        <div className="notification-container">
          <button className="notification-btn" onClick={toggleNotifications}>
            <FontAwesomeIcon
              icon={faBell}
              style={{ color: "#815896", fontSize: "1.5rem" }}
            />
          </button>
          {showNotifications && <NotificationDropdown />}
        </div>

        <div className="user-container">
          <div className="user-info">
            <span className="user-name">Administrador</span>
            <span className="user-role">Juanita</span>
          </div>
          <button className="perfil-btn" onClick={toggleUserMenu}>
            <img src={profileIcon} alt="Perfil" />
          </button>
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <span className="user-role">Administrador</span>
                <span className="user-name">Juanita</span>
              </div>
              <button className="logout-btn">Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
