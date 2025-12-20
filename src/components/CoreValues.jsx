import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CoreValues = () => {
  const sectionRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const valuesGridRef = useRef(null)
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: '技术创新',
      description: '持续投入研发，采用最前沿的技术栈，为客户提供领先的技术解决方案',
      color: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '敏捷开发',
      description: '采用敏捷开发方法论，快速迭代，及时响应需求变化，确保项目高效交付',
      color: '#10B981',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '用户体验',
      description: '以用户为中心，注重每个细节，打造简洁、直观、高效的产品体验',
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: '数据安全',
      description: '严格遵守数据保护规范，采用多层安全防护机制，保障用户数据安全',
      color: '#1E3A8A',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '持续学习',
      description: '鼓励团队不断学习新技术，分享知识经验，营造积极向上的技术氛围',
      color: '#F59E0B',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: '客户成功',
      description: '与客户建立长期合作关系，持续优化产品和服务，助力客户业务增长',
      color: '#10B981',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ]

  // GSAP Animations
  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial states
    gsap.set([badgeRef.current, titleRef.current, descRef.current], {
      opacity: 0,
      y: 20
    })

    if (valuesGridRef.current) {
      const cards = valuesGridRef.current.querySelectorAll('[data-value-card]')
      gsap.set(cards, {
        opacity: 0,
        y: 30
      })
    }

    // Create animations triggered by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    })

    // Animate header
    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0)

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.2)

    tl.to(descRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.35)

    // Animate value cards with stagger
    if (valuesGridRef.current) {
      const cards = valuesGridRef.current.querySelectorAll('[data-value-card]')
      tl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12
      }, 0.5)
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section id="values" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981] rounded-full filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2563EB] rounded-full filter blur-3xl opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-full mb-6" ref={badgeRef}>
            <span className="text-sm font-semibold text-[#2563EB]">Core Values</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" ref={titleRef}>
            <span className="text-[#1E3A8A]">核心</span>
            <span className="text-[#10B981]">价值</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" ref={descRef}>
            我们坚守的理念与承诺，驱动我们不断前进
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={valuesGridRef}>
          {values.map((value, index) => (
            <div
              key={index}
              className={`group ${value.bgColor} ${value.borderColor} border-2 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              data-value-card
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: value.color, color: 'white' }}
              >
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoreValues
