import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudArrowUp, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'

// Añadir iconos a la biblioteca
library.add(faCloudArrowUp, faBell, faCircleUser)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)