import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Education() {
  const { educations } = usePortfolioData()
  const ref = useReveal()
  return (
    <section id="shikkha" ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ শিক্ষাজীবন
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        শিক্ষাগত যোগ্যতা
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-9" />

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 hidden sm:block w-0.5 bg-gradient-to-b from-green-400/40 to-green-400/6" />
        <div className="flex flex-col gap-5">
          {educations.map((edu, i) => (
            <div key={i} className="flex items-start gap-5 sm:gap-6">
              <div className="hidden sm:flex flex-col items-center flex-shrink-0 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${edu.highlight
                  ? 'bg-green-400 shadow-[0_0_0_4px_rgba(34,197,94,.15),0_0_12px_rgba(34,197,94,.25)]'
                  : 'bg-green-400/30 shadow-[0_0_0_4px_rgba(34,197,94,.08)]'}`} />
              </div>
              <div className={`bg-white border rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)]
                p-5 sm:p-6 flex-1 flex items-center gap-4 sm:gap-5 transition-all duration-300
                hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,.09),0_0_0_1px_rgba(34,197,94,.18)] hover:border-green-400/22
                ${edu.highlight ? 'border-l-[2px] border-l-green-400 border-slate-900/7 rounded-tl-sm rounded-bl-sm' : 'border-green-400/20 border-l-[2px] border-l-green-400/20 rounded-tl-sm rounded-bl-sm'}`}>
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-center
                  ${edu.highlight ? 'bg-green-500/10 border border-green-400/30' : 'bg-green-500/4 border border-green-400/10'}`}>
                  <span className={`text-[.66rem] font-bold leading-tight text-center ${edu.highlight ? 'text-green-600' : 'text-green-400/40'}`}>
                    {edu.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Tiro_Bangla'] text-[1.1rem] text-slate-900 mb-1">{edu.degree}</div>
                  <div className="text-[.85rem] text-slate-500 mb-1.5">{edu.inst}</div>
                  {edu.badge && (
                    <span className="text-[.7rem] font-semibold px-2.5 py-0.5 rounded-full text-green-600 border border-green-400/25 bg-green-500/7">
                      ✓ {edu.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
