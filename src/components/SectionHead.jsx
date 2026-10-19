import React from 'react'

// Two-column section opener: heading left, one paragraph right.
export default function SectionHead({ title, body }) {
  return (
    <div className="section-head">
      <h2 className="display section-title">{title}</h2>
      {body ? <p className="section-body muted">{body}</p> : null}
    </div>
  )
}
