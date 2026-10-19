import React from 'react'
import { ARCHIVE, PRODUCTS, STATUS } from '../data/products'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import ProductRow from './ProductRow'

export default function Products() {
  const { language } = useLanguage()
  const ordered = [...PRODUCTS].sort((a, b) => a.order - b.order)
  return (
    <section id="products" className="section products">
      <div className="wrap">
        <h2 className="display section-title">{t('products.heading', language)}</h2>
        {ordered.map((p, i) => (
          <ProductRow key={p.slug} product={p} index={i} />
        ))}
        <h3 className="mono archive-heading muted">{t('products.archiveHeading', language)}</h3>
        <ul className="archive mono">
          {ARCHIVE.map(a => (
            <li key={a.slug} className="hairline">
              <span className="archive-name">{t(`products.${a.slug}.name`, language)}</span>
              <span className="muted">{t(`products.${a.slug}.tagline`, language)}</span>
              <span className="muted">{t(`products.status.${STATUS.retired}`, language)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
