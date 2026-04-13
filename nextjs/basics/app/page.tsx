import Link from 'next/link'

// page.tsx is a Next.js naming convention — this file becomes the route.
// app/page.tsx → "/"
// Server component by default — renders on the server, sends finished HTML to browser.
// No useState, no onClick — the server has no browser.


// Server component  →  data fetching, static content, navigation. Enabled by default
// Client component  →  useState, events, anything the user interacts with. Enabled with 'use client'
// layout.tsx        →  persistent shell (navbar, footer)
// page.tsx          →  what renders at this route
// [param]/          →  dynamic routes, value available via params
// _folder/          →  not a route, just organization


export default function Home() {
  return (
  <div>

  <h1>Welcome to this small NEXT project</h1>
  <br/>
  <p>
    This component is the "export default" from the "app/page.tsx". Since "page.tsx" are seen by NEXT
    as the thing to load, and the routes start at "/app": its route is simply "/"
  </p>
  <br/>
  <p>
    If you want to go to another page, you can route yourself with "/games", or the following "Link" element can do that:
  </p>
  <Link href="/games">Go to games page</Link>

  </div>
  )
}
