import React from 'react'
import { ARCHIVE, PRODUCTS, STATUS } from '../data/products'
import { useLanguage } from '../contexts/LanguageContext'
import { useReveal } from '../lib/useReveal'
import { t } from '../translations'
import ProductRow from './ProductRow'
import SectionHead from './SectionHead'
import Surface from './Surface'

export default function Products() {
  const { language } = useLanguage()
  const ref = useReveal()
  const ordered = [...PRODUCTS].sort((a, b) => a.order - b.order)
  return (
    <section id="products" className="section products" ref={ref}>
      <div className="wrap">
        <div className="reveal">
          <SectionHead title={t('products.heading', language)} body={t('products.intro', language)} />
        </div>
        <div className="product-list">
          {ordered.map(p => (
            <ProductRow key={p.slug} product={p} />
          ))}
        </div>
        <h3 className="mono archive-heading muted">{t('products.archiveHeading', language)}</h3>
        <ul className="archive">
          {ARCHIVE.map(a => (
            <Surface as="li" small key={a.slug} className="archive-card reveal">
              <span className="archive-name">{t(`products.${a.slug}.name`, language)}</span>
              <span className="muted">{t(`products.${a.slug}.tagline`, language)}</span>
              <span className="mono faint">{t(`products.status.${STATUS.retired}`, language)}</span>
            </Surface>
          ))}
        </ul>
      </div>
    </section>
  )
}
