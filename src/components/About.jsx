import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

// বাংলা অক্ষরে কনজাংক্ট/মাত্রা (যেমন 'জু' এর 'ু') আলাদা কোড-পয়েন্ট হিসেবে থাকে।
// সাধারণ স্ট্রিং স্প্রেড দিয়ে ভাঙলে প্রথম অক্ষরের সাথে মাত্রাটা বিচ্ছিন্ন হয়ে যায়
// (যেমন: 'জুনাইদ' থেকে শুধু 'জ' আলাদা হয়ে 'ু' পরের অংশে চলে যায়)।
// তাই Intl.Segmenter দিয়ে প্রকৃত গ্রাফিম (visual character) আলাদা করা হচ্ছে।
function splitFirstGrapheme(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('bn', { granularity: 'grapheme' })
    const first = segmenter.segment(str)[Symbol.iterator]().next().value
    if (first) return [first.segment, str.slice(first.segment.length)]
  }
  return [str[0] || '', str.slice(1)]
}

export default function About() {
  const { personalInfo } = usePortfolioData()
  const ref = useReveal()
  const [firstChar, restText] = splitFirstGrapheme(personalInfo.bio[0] || '')

  return (
    <section id="porichiti" ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-14
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ পরিচিতি
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 dark:text-slate-100 mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        আমার সম্পর্কে
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-9" />

      <div className="text-base leading-loose text-slate-600 dark:text-slate-300">
        <p className="mb-4 text-[1.02rem] text-slate-900 dark:text-slate-100">
          <span className="font-['Tiro_Bangla'] text-[3.4rem] float-left leading-[.85] pr-3 pt-1.5 text-green-400">
            {firstChar}
          </span>
          {restText}
        </p>
        {personalInfo.bio.slice(1).map((para, i) => (
          <p key={i} className={i < personalInfo.bio.length - 2 ? 'mb-4' : ''}>{para}</p>
        ))}
      </div>
    </section>
  )
}
