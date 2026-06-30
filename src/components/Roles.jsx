import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Roles() {
  const { roles } = usePortfolioData()
  const ref = useReveal()
  return (
    <section id="dayitto" ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ দায়িত্ব
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        কর্মক্ষেত্র ও দায়িত্ব
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-9" />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {roles.map((r, i) => (
          <div key={i} className={`relative overflow-hidden bg-white border border-slate-900/7 rounded-2xl
            shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)] p-6 sm:p-7 cursor-default
            transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,.09)] ${r.hoverBg}
            group`}>
            <div className="absolute top-3 left-3 w-[18px] h-[18px] border-t border-l border-green-400/30 rounded-tl-[3px]" />
            <div className="text-3xl mb-4 mt-2">{r.icon}</div>
            <div className="font-['Tiro_Bangla'] text-[1.2rem] text-slate-900 mb-2.5">{r.title}</div>
            <p className="text-[.875rem] leading-7 text-slate-500">{r.desc}</p>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${r.accentFrom} ${r.accentTo} via-transparent
              scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100 rounded-b-2xl`} />
          </div>
        ))}
      </div>
    </section>
  )
}
