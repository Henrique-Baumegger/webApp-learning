// layout.tsx wraps every page in the app — navbar, footer, global structure.
// Next.js requires a root layout. It receives {children} — the current page slots in there.
// This is a server component — no 'use client' needed, no interactivity here.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>Header for all pages</nav>
        <br/>
        <br/>
        
        {children}  {/* current page renders here */}

        <br/>
        <br/>
        <footer>Footer for all pages</footer>
      </body>
    </html>
  )
}