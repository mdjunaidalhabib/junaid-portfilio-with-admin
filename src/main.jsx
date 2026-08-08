import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PortfolioDataProvider } from './data/PortfolioDataContext'
import ErrorBoundary from './ErrorBoundary'
import './index.css'
import './pwa'

// AdminApp আলাদা চাঙ্কে lazy-load হয় — পাবলিক ভিজিটরদের (যারা /admin-এ
// যায় না) মূল বান্ডেলে অ্যাডমিন প্যানেলের কোড (Supabase auth, লুসাইড
// আইকন ইত্যাদি) ডাউনলোড করতে হয় না, ফলে সাইট দ্রুত লোড হয়
const AdminApp = lazy(() => import('./admin/AdminApp'))

const isAdminRoute = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminRoute ? (
        <Suspense fallback={null}>
          <AdminApp />
        </Suspense>
      ) : (
        <PortfolioDataProvider>
          <App />
        </PortfolioDataProvider>
      )}
    </ErrorBoundary>
  </React.StrictMode>
)
