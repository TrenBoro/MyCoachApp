import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styling/styles.css'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
    </AuthProvider>
)
