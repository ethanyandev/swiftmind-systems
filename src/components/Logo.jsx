import React from 'react'

const Logo = ({ className = "h-10" }) => {
  return (
    <img
      src="/logo.png"
      alt="SwiftMind Systems"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default Logo
