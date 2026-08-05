import { Fragment } from 'react'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import Stats          from './components/Stats'
import About          from './components/About'
import Education      from './components/Education'
import Roles          from './components/Roles'
import Writings       from './components/Writings'
import Quote          from './components/Quote'
import Contact        from './components/Contact'
import Footer         from './components/Footer'
import { usePortfolioData } from './data/PortfolioDataContext'

const Divider = () => <div className="h-px bg-gradient-to-r from-transparent via-green-400/14 to-transparent" />

export default function App() {
  const { sectionVisibility: v } = usePortfolioData()

  // অ্যাডমিন প্যানেল থেকে যে সেকশন বন্ধ করা হয়েছে সেটা এখানে বাদ পড়ে যায়।
  // লেখালেখি ও উক্তি — দুটো একসাথে একটা ব্লক হিসেবে গণ্য হয় (মাঝে কোনো
  // বিভাজন রেখা থাকে না), তাই একসাথে/আলাদাভাবে বন্ধ করা যায়।
  const blocks = [
    v.about && <About key="about" />,
    v.education && <Education key="education" />,
    v.roles && <Roles key="roles" />,
    (v.writings || v.quote) && (
      <Fragment key="writings-quote">
        {v.writings && <Writings />}
        {v.quote && <Quote />}
      </Fragment>
    ),
    v.contact && <Contact key="contact" />,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      {v.stats && <Stats />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {blocks.map((block, i) => (
          <Fragment key={i}>
            {i > 0 && <Divider />}
            {block}
          </Fragment>
        ))}
      </div>
      <Footer />
    </div>
  )
}
