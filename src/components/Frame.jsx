import React from 'react'

// Decorative page frame: two hairlines at the container edges, drawn under the content.
export default function Frame() {
  return (
    <div className="frame" aria-hidden="true">
      <span className="frame-line frame-line-l" />
      <span className="frame-line frame-line-r" />
    </div>
  )
}

// Horizontal divider between sections, with a dot where it meets each frame line.
export function SectionRule() {
  return (
    <div className="wrap" aria-hidden="true">
      <div className="section-rule" />
    </div>
  )
}
