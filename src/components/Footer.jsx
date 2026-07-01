import { FaFacebook, FaYoutube, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { usePortfolioData } from '../data/PortfolioDataContext'
import { BRAND } from '../data/brandColors'

export default function Footer() {
  const { personalInfo, contactInfo, socialLinks, footerDua } = usePortfolioData()
  const footerIcons = [
    { label: 'ফেসবুক',       platform: 'facebook', icon: <FaFacebook size={16} />, href: socialLinks.find(s => s.platform === 'fb_page')?.href || '#' },
    { label: 'ইউটিউব',       platform: 'youtube',  icon: <FaYoutube size={16} />,  href: socialLinks.find(s => s.platform === 'youtube')?.href  || '#' },
    { label: 'হোয়াটসঅ্যাপ', platform: 'whatsapp', icon: <FaWhatsapp size={16} />, href: contactInfo.whatsapp },
    { label: 'ইমেইল',        platform: 'email',    icon: <FaEnvelope size={16} />, href: `mailto:${contactInfo.email}` },
  ]
  return (
    <footer className="bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
        {/* Dua block */}
        <div className="relative inline-block px-[52px] py-7 mx-auto">
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[.65rem] text-green-400/35">✦</span>
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[.65rem] text-green-400/35">✦</span>
          <div className="w-[120px] h-px mx-auto mb-4 bg-gradient-to-r from-transparent via-green-400/45 to-transparent" />
          <div dir="rtl" className="font-['Amiri'] text-green-700 leading-[1.5] tracking-[.04em] mb-1.5"
            style={{ fontSize:'clamp(2rem,5vw,2.8rem)', textShadow:'0 2px 20px rgba(34,197,94,.18)' }}>
            {footerDua.arabic}
          </div>
          <div className="font-['Hind_Siliguri'] text-[.78rem] font-semibold tracking-[.2em] uppercase text-green-400 mb-1.5">
            {footerDua.transliterate}
          </div>
          <div className="font-['Tiro_Bangla'] text-[.95rem] text-slate-500 italic">{footerDua.translation}</div>
          <div className="w-[120px] h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-green-400/45 to-transparent" />
        </div>

        {/* Name */}
        <div className="font-['Tiro_Bangla'] text-[1.5rem] text-slate-900 mb-1 mt-7">{personalInfo.name}</div>
        <div className="text-[.82rem] text-slate-400 mb-6">{personalInfo.roles.join(' · ')}</div>

        {/* Social icons */}
        <div className="flex justify-center gap-3 mb-8">
          {footerIcons.map((s, i) => {
            const b = BRAND[s.platform]
            return (
              <a key={i} href={s.href} aria-label={s.label}
                className="w-[42px] h-[42px] rounded-full border-[1.5px] flex items-center justify-center
                  no-underline hover:-translate-y-1 hover:scale-110 transition-all duration-300"
                style={{ borderColor: b.border, background: b.bg, color: b.color }}
                onMouseOver={e => { e.currentTarget.style.background = b.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = `0 8px 20px ${b.border}` }}
                onMouseOut={e => { e.currentTarget.style.background = b.bg; e.currentTarget.style.color = b.color; e.currentTarget.style.boxShadow = 'none' }}>
                {s.icon}
              </a>
            )
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-green-400/35" />
          <div className="text-[.9rem] text-green-400/40">✦</div>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-green-400/35" />
        </div>

        <div className="text-[.78rem] text-slate-400">{personalInfo.copyright}</div>
      </div>
    </footer>
  )
}
