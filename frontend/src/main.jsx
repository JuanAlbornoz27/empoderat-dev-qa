import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudArrowUp, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'

// Añadir iconos a la biblioteca
library.add(faCloudArrowUp, faBell, faCircleUser)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)