import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    timers.current[id] = setTimeout(() => removeToast(id), duration)
    return id
  }, [removeToast])

  const toast = {
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    info: (msg, duration) => showToast(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback no-op so components never crash if provider is missing
    return { success: () => {}, error: () => {}, info: () => {} }
  }
  return ctx
}

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: { bg: 'bg-green-600', icon: <CheckCircle2 size={18} /> },
    error: { bg: 'bg-red-600', icon: <XCircle size={18} /> },
    info: { bg: 'bg-slate-700', icon: <Info size={18} /> },
  }[toast.type]

  return (
    <div
      className={`${styles.bg} text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-2 animate-[toast-in_0.2s_ease-out]`}
    >
      <span className="mt-0.5 shrink-0">{styles.icon}</span>
      <p className="text-sm flex-1 leading-snug">{toast.message}</p>
      <button onClick={onClose} className="shrink-0 opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  )
}
