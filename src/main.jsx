import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   //Enable Client side routing
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter must wrap the whole app so routing works everywhere */}
    <BrowserRouter>
      {/* AuthProvider must wrap App so every page can access auth state */}
      <AuthProvider>
        <App />
      </AuthProvider>  
    </BrowserRouter>
  </StrictMode>,
)
