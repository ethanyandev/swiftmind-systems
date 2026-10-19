import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { prefersReducedMotion } from '../lib/motion'
import { DEMO, DEMO_HOLD, DEMO_STEPS } from '../data/demo'

const money = n => `$${n.toLocaleString('en-US')}`
const ALL = DEMO_STEPS.length

// Plays one real SaveVia answer step by step: question, lookup, per-category maths, ranking.
export default function HeroDemo() {
  const { language: lang } = useLanguage()
  const ref = useRef(null)
  const [step, setStep] = useState(() => (prefersReducedMotion() ? ALL : 0))

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStep(ALL)
      return undefined
    }
    let timers = []
    let visible = true
    const clear = () => {
      timers.forEach(clearTimeout)
      timers = []
    }
    const run = () => {
      clear()
      setStep(0)
      DEMO_STEPS.forEach((at, i) => timers.push(setTimeout(() => setStep(i + 1), at)))
      timers.push(setTimeout(() => (visible ? run() : clear()), DEMO_STEPS[ALL - 1] + DEMO_HOLD))
    }
    const observer = new IntersectionObserver(entries => {
      const now = entries[0]?.isIntersecting ?? true
      if (now && !visible) {
        visible = true
        run()
      } else if (!now) {
        visible = false
      }
    })
    if (ref.current) observer.observe(ref.current)
    run()
    return () => {
      clear()
      observer.disconnect()
    }
  }, [])

  const at = n => ({ 'data-step': n, className: step >= n ? 'is-in' : undefined })
  const max = DEMO.ranking[0].value

  return (
    <figure className="hero-stage surface demo" ref={ref}>
      <figcaption className="sr-only">{DEMO.caption[lang]}</figcaption>
      <div className="demo-visual" aria-hidden="true">
        <div className="demo-chat">
          <p {...at(1)} className={`demo-question ${at(1).className ?? ''}`}>
            {DEMO.question[lang]}
          </p>
          <p {...at(2)} className={`demo-status mono ${at(2).className ?? ''}`}>
            <span className="demo-who">{DEMO.who[lang]}</span>
            <span className="demo-pulse" />
            {DEMO.status[lang]}
          </p>
          <div {...at(3)} className={`demo-answer ${at(3).className ?? ''}`}>
            <div className="demo-card">
              <img src={DEMO.card.image} alt="" width="240" height="152" />
              <div>
                <p className="demo-card-name">{DEMO.card.name[lang]}</p>
                <p className="demo-card-meta mono">{DEMO.card.meta[lang]}</p>
              </div>
            </div>
            <ul className="demo-rows">
              {DEMO.rows.map((r, i) => (
                <li key={i} {...at(4 + i)}>
                  <span>{r.label[lang]}</span>
                  <span className="mono">{money(r.value)}</span>
                </li>
              ))}
              <li {...at(7)} className={`demo-total ${at(7).className ?? ''}`}>
                <span>{DEMO.total.label[lang]}</span>
                <span>{money(DEMO.total.value)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="demo-rank">
          <p className="demo-rank-title mono">{DEMO.rankingTitle[lang]}</p>
          <ol>
            {DEMO.ranking.map((c, i) => (
              <li key={c.name} {...at(8 + i)} style={{ '--w': `${(c.value / max) * 100}%` }}>
                <img className="demo-rank-art" src={c.image} alt="" width="240" height="152" />
                <span className="demo-rank-body">
                  <span className="demo-rank-head">
                    <span className="demo-rank-name">{c.name}</span>
                    <span className="demo-rank-value mono">{money(c.value)}</span>
                  </span>
                  <span className="demo-rank-bar">
                    <span />
                  </span>
                  <span className="demo-rank-fee mono faint">{c.fee[lang]}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="mono hero-tag faint">{DEMO.label[lang]}</p>
    </figure>
  )
}
