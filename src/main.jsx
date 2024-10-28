import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { AuthProvider } from './Component/context/AuthProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProSidebarProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>        
      </BrowserRouter>
    </ProSidebarProvider>
  </React.StrictMode>,
)
