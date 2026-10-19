import React, { forwardRef } from 'react'

// Rounded card container. `as` picks the element; `small` picks the 16px radius variant.
const Surface = forwardRef(function Surface({ as: Tag = 'div', className = '', small = false, children, ...rest }, ref) {
  const cls = ['surface', small ? 'surface-sm' : '', className].filter(Boolean).join(' ')
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  )
})

export default Surface
