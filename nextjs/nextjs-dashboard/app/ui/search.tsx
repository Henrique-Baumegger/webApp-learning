'use client'; // This is a Client Component, which means you can use event listeners and hooks.

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


/*
In this file, instead of storing the search term in useState, it goes in the URL. This gives you three things for free:

1. Shareable — copy the URL, paste it to someone, they see the same search
   /dashboard/invoices?query=bob  → shows results for "bob"

2. Bookmarkable — save the URL, come back later, same results

3. Server-readable — the server component (page.tsx) can read the URL params:
// page.tsx (server component)
export default async function Page({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query || '';
  const invoices = await fetchFilteredInvoices(query);  // DB query with search term
  return <Table invoices={invoices} />
}
*/


export default function Search({ placeholder }: { placeholder: string }) {
  
  /*
  searchParams → { query: "hello" }
  pathname     → "/dashboard/invoices"
  replace      → function that changes the URL without adding to browser history
  */
  const searchParams = useSearchParams();  // current URL query params
  const pathname = usePathname();          // current path
  const { replace } = useRouter();         // function to change the URL

  // useDebouncedCallback waits until the user stops typing for 300ms before running.
  // Must be called at the top level of the component (Rules of Hooks).
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    
    
    // Step 1: copy the current URL params into a mutable object
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Step 2: update or remove the "query" param
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Step 3: update the URL
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  
  /*
  User is at: /dashboard/invoices
  User types: "bob"

  Step 1: params = {} (no existing params)
  Step 2: params.set('query', 'bob') → params = { query: "bob" }
  Step 3: replace("/dashboard/invoices?query=bob")

  URL is now: /dashboard/invoices?query=bob
  */

  return (

    <div className="relative flex flex-1 flex-shrink-0">

      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}

        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        
        defaultValue={searchParams.get('query')?.toString()}
      />
      {/* "defaultValue" to keep the URL ab the input in sync */}


      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
