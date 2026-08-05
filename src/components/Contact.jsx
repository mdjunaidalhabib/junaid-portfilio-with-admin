import { useReveal } from '../hooks/useReveal'
import { FaEnvelope, FaPhone, FaMapMarker } from 'react-icons/fa'
import { usePortfolioData } from '../data/PortfolioDataContext'
import { BRAND, CONTACT_COLORS, PLATFORM_ICONS, detectPlatform } from '../data/brandColors'
import { telHref } from '../lib/phone'

export default function Contact() {
  const { contactInfo, socialLinks } = usePortfolioData()
  const ref = useReveal()

  const directContacts = [
    { icon: <FaPhone size={15} />,     label: 'মোবাইল', value: contactInfo.phone,    href: telHref(contactInfo.phone), key: 'phone' },
    { icon: <FaEnvelope size={15} />,  label: 'ইমেইল',  value: contactInfo.email,    href: `mailto:${contactInfo.email}`, key: 'mail' },
    { icon: <FaMapMarker size={15} />, label: 'ঠিকানা', value: contactInfo.location,                              key: 'location' },
  ]

  return (
    <section id="jogajog" ref={ref}
      className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ যোগাযোগ
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        যোগাযোগ করুন
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-9" />

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Direct contact */}
        <div className="bg-white border border-slate-900/7 rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)] p-6 sm:p-7 relative overflow-hidden
          transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,.09)]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-500/10 border border-yellow-400/30 text-yellow-600">
              <FaPaperPlaneIcon />
            </span>
            <div className="font-['Tiro_Bangla'] text-[1.1rem] text-slate-900 font-semibold">প্রত্যক্ষ যোগাযোগ</div>
          </div>
          <div className="flex flex-col gap-2">
            {directContacts.map(({ icon, label, value, href, key }, i) => {
              const c = CONTACT_COLORS[key]
              return (
                <div key={label} style={{ animationDelay: `${i * 90}ms` }} className="stagger-item flex items-center gap-3.5 p-3 rounded-[14px] transition-all duration-200"
                  onMouseOver={e => { e.currentTarget.style.background = c.bg }}
                  onMouseOut={e => { e.currentTarget.style.background = '' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-[1.5px]"
                    style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[.62rem] font-bold uppercase tracking-[.16em] mb-0.5" style={{ color: c.color }}>{label}</div>
                    {href
                      ? <a href={href} className="text-[.92rem] text-slate-900 no-underline font-semibold transition-colors truncate block"
                          onMouseOver={e => { e.currentTarget.style.color = c.color }}
                          onMouseOut={e => { e.currentTarget.style.color = '' }}>{value}</a>
                      : <span className="text-[.92rem] text-slate-900 font-semibold truncate block">{value}</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-slate-900/7 rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)] p-6 sm:p-7 relative overflow-hidden
          transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,.09)]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/10 border border-green-400/30 text-green-600">
              <FaShareIcon />
            </span>
            <div className="font-['Tiro_Bangla'] text-[1.1rem] text-slate-900 font-semibold">সামাজিক মাধ্যম</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((s, i) => {
              const platform = detectPlatform(s.href)
              const b = BRAND[platform]
              const Icon = PLATFORM_ICONS[platform]
              return (
                <a key={s.label} href={s.href}
                  className="stagger-item flex flex-col items-center text-center gap-2 px-3 py-4 border rounded-2xl no-underline
                    text-slate-600 transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,.07)]"
                  style={{ borderColor: 'rgba(15,23,42,.08)', animationDelay: `${i * 90}ms` }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = b.border; e.currentTarget.style.background = b.bg }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,.08)'; e.currentTarget.style.background = '' }}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: b.bg, color: b.color }}><Icon size={17} /></span>
                  <span className="text-[.78rem] font-semibold leading-tight">{s.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function FaPaperPlaneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function FaShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
