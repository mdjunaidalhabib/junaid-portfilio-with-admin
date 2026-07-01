import { useEffect, useState } from 'react'
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaDownload, FaPaperPlane, FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { usePortfolioData } from '../data/PortfolioDataContext'
import { BRAND, CONTACT_COLORS } from '../data/brandColors'

export default function Hero() {
  const { personalInfo, contactInfo, socialLinks } = usePortfolioData()
  const heroSocials = [
    { label: 'ফেসবুক',       platform: 'facebook',  href: socialLinks.find(s => s.platform === 'fb_id')?.href || '#' },
    { label: 'হোয়াটসঅ্যাপ', platform: 'whatsapp',  href: contactInfo.whatsapp },
  ]
  const [vis, setVis] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => { setTimeout(() => setVis(true), 100) }, [])

  const iconMap = { facebook: <FaFacebook size={15} />, whatsapp: <FaWhatsapp size={15} /> }

  const directContacts = [
    { icon: <FaPhoneAlt size={12} />,     label: contactInfo.phone,    href: contactInfo.phoneTel, key: 'phone' },
    { icon: <FaMapMarkerAlt size={13} />, label: contactInfo.location,                              key: 'location' },
    { icon: <FaEnvelope size={12} />,     label: contactInfo.email,    href: `mailto:${contactInfo.email}`, key: 'mail' },
  ]

  return (
    <section className="relative flex items-center overflow-hidden bg-white min-h-[calc(100vh-48px)] md:min-h-0">
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:`radial-gradient(circle at 15% 50%,rgba(34,197,94,.06) 0%,transparent 45%),radial-gradient(circle at 85% 20%,rgba(34,197,94,.04) 0%,transparent 40%),radial-gradient(circle at 60% 85%,rgba(74,222,128,.03) 0%,transparent 35%)` }} />
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{ backgroundImage:`linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)`, backgroundSize:'48px 48px' }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none translate-x-[30%] -translate-y-[30%]"
        style={{ background:'radial-gradient(circle,rgba(34,197,94,.07) 0%,transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none -translate-x-[30%] translate-y-[30%]"
        style={{ background:'radial-gradient(circle,rgba(74,222,128,.04) 0%,transparent 65%)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">

          {/* LEFT: PHOTO */}
          <div className="flex justify-center items-center md:pr-[52px] md:border-r md:border-green-500/10 pb-10 md:pb-0"
            style={{ opacity:vis?1:0, transform:vis?'translateX(0)':'translateX(-40px)', transition:'all .8s cubic-bezier(.22,1,.36,1) .3s' }}>
            <div className="relative inline-block">
              <div className="absolute rounded-full border border-dashed border-green-400/28 animate-spin-slow" style={{ inset:'-14px' }} />
              <div className="absolute rounded-full border border-green-400/10 animate-spin-slow-rev" style={{ inset:'-26px' }} />
              <div className="relative w-[300px] h-[300px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden border-[3px] border-green-400/20
                bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-10
                shadow-[0_0_0_8px_rgba(34,197,94,.04),0_20px_50px_rgba(34,197,94,.12)] hover:border-green-400/50 transition-[border-color] duration-300">
                {!imgError
                  ? <img src={personalInfo.profileImage} alt="প্রোফাইল" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                  : <div className="text-center select-none">
                      <div className="font-['Tiro_Bangla'] text-[5.5rem] leading-none text-green-600/25">জু</div>
                      <div className="text-[.65rem] text-green-600/35 mt-2 tracking-[.05em]">ছবি যোগ করুন</div>
                    </div>
                }
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600
                text-white text-[.68rem] font-bold px-5 py-1.5 rounded-full whitespace-nowrap z-20
                shadow-[0_5px_16px_rgba(34,197,94,.35)] tracking-[.05em]">
                ✦ {personalInfo.title}
              </div>
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="flex flex-col justify-center md:pl-[52px] pt-8 md:pt-0"
            style={{ opacity:vis?1:0, transform:vis?'translateX(0)':'translateX(40px)', transition:'all .8s cubic-bezier(.22,1,.36,1) .5s' }}>
            <h1 className="font-['Tiro_Bangla'] mb-[18px] block"
              style={{ fontSize:'clamp(2.2rem,5vw,3.4rem)', lineHeight:1.35,
                background:'linear-gradient(135deg,#0f172a 0%,#16a34a 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {personalInfo.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-5">
              {personalInfo.roles.map(r => (
                <span key={r} className="text-[.78rem] font-semibold px-[13px] py-1 rounded-full bg-green-500/7 text-green-700 border border-green-400/20">
                  {r}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 mb-5">
              {directContacts.map((item, i) => {
                const c = CONTACT_COLORS[item.key]
                return (
                  <div key={i} className="flex items-center gap-2.5 text-[.85rem]">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border"
                      style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                      {item.icon}
                    </div>
                    {item.href
                      ? <a href={item.href} className="text-green-700 no-underline font-medium">{item.label}</a>
                      : <span className="text-slate-600">{item.label}</span>
                    }
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {heroSocials.map(({ label, platform, href }) => {
                const b = BRAND[platform]
                return (
                  <a key={label} href={href} aria-label={label}
                    className="w-[42px] h-[42px] rounded-full border-[1.5px] flex items-center justify-center
                      no-underline hover:-translate-y-1 hover:scale-110 transition-all duration-300"
                    style={{ borderColor: b.border, background: b.bg, color: b.color }}
                    onMouseOver={e => { e.currentTarget.style.background = b.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = `0 8px 20px ${b.border}` }}
                    onMouseOut={e => { e.currentTarget.style.background = b.bg; e.currentTarget.style.color = b.color; e.currentTarget.style.boxShadow = 'none' }}>
                    {iconMap[platform]}
                  </a>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#jogajog" className="inline-flex items-center gap-1.5 bg-gradient-to-br from-green-400 to-green-600
                text-white py-3 px-[26px] rounded-full font-bold text-[.88rem] no-underline
                shadow-[0_4px_14px_rgba(34,197,94,.3)] hover:shadow-[0_7px_24px_rgba(34,197,94,.44)]
                hover:-translate-y-0.5 transition-all duration-300">
                <FaPaperPlane size={13} /> যোগাযোগ করুন
              </a>
              <a href={personalInfo.cvUrl || '/cv.pdf'} download
                className="inline-flex items-center gap-1.5 bg-transparent text-slate-900 border-[1.5px] border-slate-900/14
                py-3 px-[26px] rounded-full font-semibold text-[.88rem] no-underline
                hover:border-green-400 hover:text-green-700 hover:bg-green-500/5 hover:-translate-y-0.5 transition-all duration-300">
                <FaDownload size={13} /> জীবনবৃত্তান্ত
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
