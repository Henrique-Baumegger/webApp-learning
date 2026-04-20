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



// You can also include a metadata object from any layout.js 
// or page.js file to add additional page information like title and description. 
// Any metadata in layout.js will be inherited by all pages that use it.
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
