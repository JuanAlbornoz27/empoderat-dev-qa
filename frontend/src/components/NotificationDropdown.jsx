import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import '../styles/NotificationDropdown.css';
import { notifications } from '../data/userData';

const NotificationDropdown = () => {
    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <FontAwesomeIcon 
                    icon={faBell} 
                    className="notification-header-icon" 
                />
                <span>NOTIFICACIONES</span>
            </div>
            <div className="notification-content">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <div className="notification-icon">
                            <FontAwesomeIcon 
                                icon={faBell} 
                                style={{color: "#666", fontSize: "0.875rem"}}
                            />
                        </div>
                        <p className="notification-text">{notification.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;