import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudArrowUp, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'

// Añadir iconos a la biblioteca
library.add(faCloudArrowUp, faBell, faCircleUser)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);