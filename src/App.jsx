import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
// import CoreValues from './components/CoreValues'
import Products from './components/Products'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        {/* <CoreValues /> */}
        <Products />
        <About />
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App
