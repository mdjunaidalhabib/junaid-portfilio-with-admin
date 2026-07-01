import { useReveal } from '../hooks/useReveal'
import { FaEnvelope, FaPhone, FaMapMarker, FaFacebook, FaYoutube, FaTelegram } from 'react-icons/fa'
import { usePortfolioData } from '../data/PortfolioDataContext'
import { BRAND, CONTACT_COLORS } from '../data/brandColors'

const iconMap = {
  fb_id:    <FaFacebook size={16} />,
  fb_page:  <FaFacebook size={16} />,
  youtube:  <FaYoutube size={16} />,
  telegram: <FaTelegram size={16} />,
}

const BRAND_KEY = {
  fb_id:    'facebook',
  fb_page:  'facebook',
  youtube:  'youtube',
  telegram: 'telegram',
}

export default function Contact() {
  const { contactInfo, socialLinks } = usePortfolioData()
  const ref = useReveal()

  const directContacts = [
    { icon: <FaPhone size={14} />,     label: 'মোবাইল', value: contactInfo.phone,    href: contactInfo.phoneTel, key: 'phone' },
    { icon: <FaEnvelope size={14} />,  label: 'ইমেইল',  value: contactInfo.email,    href: `mailto:${contactInfo.email}`, key: 'mail' },
    { icon: <FaMapMarker size={14} />, label: 'ঠিকানা', value: contactInfo.location,                              key: 'location' },
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
        <div className="bg-white border border-slate-900/7 rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)] p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
          <div className="font-['Tiro_Bangla'] text-[1.1rem] text-slate-900 font-semibold mb-5">প্রত্যক্ষ যোগাযোগ</div>
          <div className="flex flex-col gap-4">
            {directContacts.map(({ icon, label, value, href, key }) => {
              const c = CONTACT_COLORS[key]
              return (
                <div key={label} className="flex items-start gap-3 p-2.5 rounded-[10px] transition-colors"
                  style={{ '--hover-bg': c.bg }}
                  onMouseOver={e => { e.currentTarget.style.background = c.bg }}
                  onMouseOut={e => { e.currentTarget.style.background = '' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-[.65rem] font-bold uppercase tracking-[.14em] mb-0.5" style={{ color: c.color }}>{label}</div>
                    {href
                      ? <a href={href} className="text-[.9rem] text-slate-900 no-underline font-medium transition-colors"
                          onMouseOver={e => { e.currentTarget.style.color = c.color }}
                          onMouseOut={e => { e.currentTarget.style.color = '' }}>{value}</a>
                      : <span className="text-[.9rem] text-slate-900 font-medium">{value}</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-slate-900/7 rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)] p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
          <div className="font-['Tiro_Bangla'] text-[1.1rem] text-slate-900 font-semibold mb-5">সামাজিক মাধ্যম</div>
          <div className="flex flex-col gap-3">
            {socialLinks.map(s => {
              const b = BRAND[BRAND_KEY[s.platform]] || BRAND.facebook
              return (
                <a key={s.label} href={s.href}
                  className="flex items-center gap-3 px-3.5 py-3 border rounded-[11px] no-underline
                    text-slate-600 transition-all duration-200 hover:translate-x-1"
                  style={{ borderColor: 'rgba(15,23,42,.08)' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = b.border; e.currentTarget.style.background = b.bg }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,.08)'; e.currentTarget.style.background = '' }}>
                  <span className="text-[1.1rem] flex-shrink-0" style={{ color: b.color }}>{iconMap[s.platform]}</span>
                  <span className="text-[.9rem] font-medium">{s.label}</span>
                  <span className="ml-auto opacity-35 text-[.9rem]">→</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
