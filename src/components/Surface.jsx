import React from 'react'

// Rounded card container. `as` picks the element; `small` picks the 16px radius variant.
export default function Surface({ as: Tag = 'div', className = '', small = false, children, ...rest }) {
  const cls = ['surface', small ? 'surface-sm' : '', className].filter(Boolean).join(' ')
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}
