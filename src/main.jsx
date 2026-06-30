import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './admin/AdminApp'
import { PortfolioDataProvider } from './data/PortfolioDataContext'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

const isAdminRoute = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminRoute ? (
        <AdminApp />
      ) : (
        <PortfolioDataProvider>
          <App />
        </PortfolioDataProvider>
      )}
    </ErrorBoundary>
  </React.StrictMode>
)
