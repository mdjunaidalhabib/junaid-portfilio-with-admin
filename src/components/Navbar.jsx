import { useState, useEffect } from 'react'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Navbar() {
  const { personalInfo, navItems } = usePortfolioData()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active,   setActive]   = useState('')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const ids = ['porichiti','shikkha','dayitto','lekhalekhi','jogajog']
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = ''
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 140) cur = '#' + id
      })
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/92 backdrop-blur-2xl border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-green-500/7 border border-green-500/22 flex items-center justify-center overflow-hidden">
            {!imgError
              ? <img src={personalInfo.profileImage} alt="logo" onError={() => setImgError(true)} className="w-full h-full object-cover rounded-[10px]" />
              : <span className="font-['Tiro_Bangla'] text-green-700 text-[.9rem] font-bold">জু</span>
            }
          </div>
          <div>
            <div className="font-['Tiro_Bangla'] text-slate-900 text-[1rem] font-semibold leading-tight">{personalInfo.name}</div>
            <div className="text-[.58rem] text-green-600 tracking-[.12em] uppercase">{personalInfo.tagline}</div>
          </div>
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(i => (
            <a key={i.href} href={i.href}
              className={`relative text-slate-500 no-underline font-medium text-[.875rem] transition-colors duration-250 pb-0.5
                after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5
                after:bg-gradient-to-r after:from-green-400 after:to-green-300 after:rounded-sm
                after:scale-x-0 after:origin-left after:transition-transform after:duration-300
                hover:text-green-700 hover:after:scale-x-100
                ${active===i.href ? 'text-green-700 after:scale-x-100' : ''}`}>
              {i.label}
            </a>
          ))}
          <a href="#jogajog"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-green-400 to-green-600 text-white
              py-2.5 px-5 rounded-full font-bold text-[.82rem] no-underline
              shadow-[0_4px_14px_rgba(34,197,94,.3)] hover:shadow-[0_7px_24px_rgba(34,197,94,.44)]
              hover:-translate-y-0.5 transition-all duration-300">
            যোগাযোগ
          </a>
        </nav>

        {/* Hamburger */}
        <button className={`md:hidden p-2 rounded-lg border-0 cursor-pointer transition-colors text-slate-500 ${menuOpen ? 'bg-green-500/8' : 'bg-transparent'}`}
          aria-label="মেনু" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen
            ? <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white/97 backdrop-blur-xl border-t border-green-500/10 animate-nav-drop">
          <div className="flex flex-col gap-1">
            {navItems.map(i => (
              <a key={i.href} href={i.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl no-underline text-[.95rem] font-medium text-gray-700
                  hover:bg-green-500/7 hover:text-green-700 transition-colors">
                {i.label}
              </a>
            ))}
            <a href="#jogajog" onClick={() => setMenuOpen(false)}
              className="mt-2 flex justify-center items-center gap-2 bg-gradient-to-br from-green-400 to-green-600
                text-white py-3 px-6 rounded-full font-bold text-[.88rem] no-underline
                shadow-[0_4px_14px_rgba(34,197,94,.3)]">
              যোগাযোগ করুন
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
