import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaHome, FaUser, FaGraduationCap, FaBriefcase, FaPenNib, FaPaperPlane } from 'react-icons/fa'
import { usePortfolioData } from '../data/PortfolioDataContext'

const NAV_ICONS = {
  '#porichiti':  FaUser,
  '#shikkha':    FaGraduationCap,
  '#dayitto':    FaBriefcase,
  '#lekhalekhi': FaPenNib,
}

export default function Navbar() {
  const { personalInfo, navItems } = usePortfolioData()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active,   setActive]   = useState('#home')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const ids = ['porichiti','shikkha','dayitto','lekhalekhi','jogajog']
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = '#home'
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 140) cur = '#' + id
      })
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [menuOpen])

  const goHome = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActive('#home')
    setMenuOpen(false)
  }

  return (
    <>
      {/* Fixed header — সব সময় সবার উপরে থাকবে */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/92 backdrop-blur-2xl border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-md md:bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 md:py-2.5 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" onClick={goHome} className="flex items-center gap-2 md:gap-2.5 no-underline min-w-0">
            <div className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-[9px] md:rounded-[10px] bg-green-500/7 border border-green-500/22 flex items-center justify-center overflow-hidden flex-shrink-0">
              {!imgError
                ? <img src={personalInfo.profileImage} alt="logo" onError={() => setImgError(true)} className="w-full h-full object-cover rounded-[9px] md:rounded-[10px]" />
                : <span className="font-['Tiro_Bangla'] text-green-700 text-[.82rem] md:text-[.9rem] font-bold">জু</span>
              }
            </div>
            <div className="min-w-0">
              <div className="font-['Tiro_Bangla'] text-slate-900 text-[.92rem] md:text-[1rem] font-semibold leading-tight truncate">{personalInfo.name}</div>
              <div className="hidden sm:block text-[.58rem] text-green-600 tracking-[.12em] uppercase">{personalInfo.tagline}</div>
            </div>
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" onClick={goHome}
              className={`relative text-slate-500 no-underline font-medium text-[.875rem] transition-colors duration-250 pb-0.5
                after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5
                after:bg-gradient-to-r after:from-green-400 after:to-green-300 after:rounded-sm
                after:scale-x-0 after:origin-left after:transition-transform after:duration-300
                hover:text-green-700 hover:after:scale-x-100
                ${active==='#home' ? 'text-green-700 after:scale-x-100' : ''}`}>
              হোম
            </a>
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
          <button className={`md:hidden p-2 rounded-lg border-0 cursor-pointer transition-colors text-slate-600 ${menuOpen ? 'bg-green-500/8' : 'bg-transparent'}`}
            aria-label="মেনু" onClick={() => setMenuOpen(true)}>
            <FaBars size={18} />
          </button>
        </div>
      </header>

      {/* Spacer — fixed header-এর জায়গা পূরণ করে, যাতে content নিচে নেমে না যায় */}
      <div className="h-12 md:h-[58px]" />

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Side drawer — বাম পাশ থেকে smooth ভাবে আসবে */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[78%] max-w-[300px] bg-white
          shadow-[10px_0_40px_rgba(15,23,42,.18)] transition-transform duration-[400ms] will-change-transform
          flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-500/10 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-green-500/10 border border-green-500/25 flex items-center justify-center overflow-hidden flex-shrink-0">
              {!imgError
                ? <img src={personalInfo.profileImage} alt="logo" className="w-full h-full object-cover" />
                : <span className="font-['Tiro_Bangla'] text-green-700 text-[.82rem] font-bold">জু</span>
              }
            </div>
            <div className="min-w-0">
              <div className="font-['Tiro_Bangla'] text-slate-900 text-[.9rem] font-semibold leading-tight truncate">{personalInfo.name}</div>
              <div className="text-[.55rem] text-green-600 tracking-[.12em] uppercase">{personalInfo.tagline}</div>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="বন্ধ করুন"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500/8 text-green-700
              hover:bg-green-500/16 transition-colors flex-shrink-0">
            <FaTimes size={15} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            <a href="#home" onClick={goHome}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl no-underline text-[.92rem] font-medium transition-colors
                ${active==='#home' ? 'bg-green-500/10 text-green-700' : 'text-slate-600 hover:bg-green-500/6 hover:text-green-700'}`}>
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                ${active==='#home' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-green-500/8 text-green-600'}`}>
                <FaHome size={15} />
              </span>
              হোম
            </a>
            {navItems.map(i => {
              const Icon = NAV_ICONS[i.href] || FaUser
              const isActive = active === i.href
              return (
                <a key={i.href} href={i.href} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl no-underline text-[.92rem] font-medium transition-colors
                    ${isActive ? 'bg-green-500/10 text-green-700' : 'text-slate-600 hover:bg-green-500/6 hover:text-green-700'}`}>
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isActive ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-green-500/8 text-green-600'}`}>
                    <Icon size={15} />
                  </span>
                  {i.label}
                </a>
              )
            })}
          </div>
        </nav>

        {/* CTA footer */}
        <div className="px-4 py-4 border-t border-green-500/10">
          <a href="#jogajog" onClick={() => setMenuOpen(false)}
            className="flex justify-center items-center gap-2 bg-gradient-to-br from-green-400 to-green-600
              text-white py-3 px-6 rounded-full font-bold text-[.9rem] no-underline w-full
              shadow-[0_4px_14px_rgba(34,197,94,.3)]">
            <FaPaperPlane size={13} /> যোগাযোগ করুন
          </a>
        </div>
      </aside>
    </>
  )
}
