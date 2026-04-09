'use client'
// 'use client' — this component runs in the browser, like non-Next React.
// Needed here because the user types → useState updates → list filters.
// With 'use client' (useState, onChange, synthetic events) works exactly the same.

// Convention: prefix folders with _ to mark them as non-routable (Next.js won't treat
// _components as a URL segment). (There is no page.tsx there to be routed to anyway)

import { useState } from 'react'

export default function FilterInput() {
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="No functionality"
    />
  )
}