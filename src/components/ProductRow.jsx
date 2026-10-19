import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'
import { useLanguage } from '../contexts/LanguageContext'
import { prefersReducedMotion } from '../lib/motion'
import { t, translations } from '../translations'
import Surface from './Surface'

function featureKeys(slug) {
  return Object.keys(translations.products[slug].features ?? {})
}

export default function ProductRow({ product }) {
  const { language } = useLanguage()
  const ref = useRef(null)
  const base = `products.${product.slug}`
  const name = t(`${base}.name`, language)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.shots',
        { y: -16 },
        { y: 16, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    },
    { scope: ref },
  )

  return (
    <Surface as="article" className={`product-card reveal${product.links.length ? " has-link" : ""}`} ref={ref}>
      <div className="product-info">
        <p className="mono product-meta">
          <span className="dot" data-status={product.status} aria-hidden="true" />
          <span>{t(`products.status.${product.status}`, language)}</span>
        </p>
        <h3 className="display product-name">{name}</h3>
        <p className="product-tagline">{t(`${base}.tagline`, language)}</p>
        <p className="product-description muted">{t(`${base}.description`, language)}</p>
        <ul className="product-features">
          {featureKeys(product.slug).map(k => (
            <li key={k}>{t(`${base}.features.${k}`, language)}</li>
          ))}
        </ul>
        {product.links.length > 0 && (
          <p className="product-links">
            {product.links.map(link => (
              <a key={link.kind} className="btn-secondary" href={link.href} target="_blank" rel="noopener noreferrer">
                {t(`products.links.${link.kind}`, language)}
              </a>
            ))}
          </p>
        )}
      </div>
      <div className="board" data-palette={product.palette}>
        <div className={`shots shots-${product.screens.length > 1 ? 'pair' : 'single'}`}>
          {product.screens.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              width={s.w}
              height={s.h}
              loading="lazy"
              decoding="async"
              alt={t('products.screenshotAlt', language).replace('{name}', name).replace('{n}', String(i + 1))}
            />
          ))}
        </div>
      </div>
    </Surface>
  )
}
