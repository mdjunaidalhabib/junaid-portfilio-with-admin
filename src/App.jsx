import Navbar    from './components/Navbar'
import Hero      from './components/Hero'
import Stats     from './components/Stats'
import About     from './components/About'
import Education from './components/Education'
import Roles     from './components/Roles'
import Writings  from './components/Writings'
import Quote     from './components/Quote'
import Contact   from './components/Contact'
import Footer    from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Stats />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <About />
        <div className="h-px bg-gradient-to-r from-transparent via-green-400/14 to-transparent" />
        <Education />
        <div className="h-px bg-gradient-to-r from-transparent via-green-400/14 to-transparent" />
        <Roles />
        <div className="h-px bg-gradient-to-r from-transparent via-green-400/14 to-transparent" />
        <Writings />
        <Quote />
        <div className="h-px bg-gradient-to-r from-transparent via-green-400/14 to-transparent" />
        <Contact />
      </div>
      <Footer />
    </div>
  )
}
