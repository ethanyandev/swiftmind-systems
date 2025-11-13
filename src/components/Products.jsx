import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const Products = () => {
  const { language } = useLanguage()

  const products = [
    {
      key: 'skillgrove',
      statusColor: 'bg-[#34D399]',
      gradientFrom: 'from-[#34D399]',
      gradientTo: 'to-[#10B981]',
      image: '/skillgrove.png',
      logo: '/skillgrove-logo.png',
      website: 'https://skillgrove.ca',
    },
    {
      key: 'vamerchant',
      statusColor: 'bg-[#60A5FA]',
      gradientFrom: 'from-[#60A5FA]',
      gradientTo: 'to-[#3B82F6]',
      image: '/vamerchant.png',
      logo: '/vamerchant-logo.png',
      website: 'https://vamerchant.app',
    },
    {
      key: 'moodtini',
      statusColor: 'bg-[#FBBF24]',
      gradientFrom: 'from-[#FBBF24]',
      gradientTo: 'to-[#FCD34D]',
      image: '/moodtini.png',
      logo: '/moodtini-logo.png',
      website: null,
    },
  ]

  return (
    <section id="products" className="py-24 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#2563EB]">{t('products.badge', language)}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#1E3A8A]">{t('products.title1', language)}</span>
            <span className="text-[#10B981]">{t('products.title2', language)}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('products.subtitle', language)}
          </p>
        </div>

        <div className="space-y-16">
          {products.map((product, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
            >
              {/* Content Column */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-20 h-20 rounded-2xl ${product.logo ? 'bg-white border-2 border-gray-200' : `bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo}`} flex items-center justify-center text-white shadow-lg p-2`}>
                      {product.logo ? (
                        <img src={product.logo} alt={`${product.name} Logo`} className="w-full h-full object-contain" />
                      ) : (
                        product.icon
                      )}
                    </div>
                    <span className={`${product.statusColor} text-white px-4 py-1.5 rounded-full text-sm font-semibold`}>
                      {t(`products.${product.key}.status`, language)}
                    </span>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {t(`products.${product.key}.name`, language)}
                    {product.website && (
                      <a
                        href={product.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </h3>
                  <p className={`text-lg font-semibold bg-gradient-to-r ${product.gradientFrom} ${product.gradientTo} bg-clip-text text-transparent mb-2`}>
                    {t(`products.${product.key}.tagline`, language)}
                  </p>
                  {product.website && (
                    <a
                      href={product.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
                    >
                      {product.website.replace('https://', '')}
                    </a>
                  )}
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t(`products.${product.key}.description`, language)}
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">{t('products.coreFeatures', language)}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo} p-4 rounded-xl shadow-md`}
                      >
                        <p className="text-white font-semibold">{t(`products.${product.key}.features.feature${i}`, language)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image/Video Column */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video border-4 border-gray-100">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={`${t(`products.${product.key}.name`, language)} ${language === 'zh' ? '产品展示' : 'Product Demo'}`}
                      className="w-full h-full object-cover"
                    />
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

export default Products
