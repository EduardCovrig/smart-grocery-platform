import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Toata aplicatia este in interiorul lui AuthProvider ca sa poata accesa datele de autentificare oriunde in aplicatie */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
//aici nu prea e de umblat