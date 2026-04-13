// Side-effect import: loads global CSS with no returned value
import '@/app/ui/global.css';

// { inter } pulls just that named export from the file (not the whole module)
import { inter } from '@/app/ui/fonts';

// We can have other layouts, but only one root layout with <body>

// Next.js requires this file to export a default RootLayout — it wraps every page
export default function RootLayout( { children }: { children: React.ReactNode })
{
  return (
    <html lang="en">
      <body
        // Template literal combines two strings: inter's generated class + Tailwind's antialiased
        className={`${inter.className} antialiased`}
      >
        {/* children = the current page being visited */}
        {children}
      </body>
    </html>
  );
}
