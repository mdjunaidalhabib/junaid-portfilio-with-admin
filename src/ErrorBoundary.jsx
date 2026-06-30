import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('অ্যাপে সমস্যা হয়েছে:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '8px', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif',
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>পেজ লোড করতে সমস্যা হয়েছে</h1>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '420px' }}>
            একটু পর আবার চেষ্টা করুন, অথবা ব্রাউজার কনসোল (F12) থেকে ত্রুটির বিস্তারিত দেখুন।
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
