import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DDayProvider } from './store/DDayContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DDayProvider>
      <App />
    </DDayProvider>
  </StrictMode>,
)
