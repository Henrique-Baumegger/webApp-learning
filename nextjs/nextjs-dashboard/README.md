# Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


# My learning notes

## Next.js vs FastAPI

- **Next.js fullstack** = one server handles frontend (HTML) + backend (API) + routing + bundling
- **FastAPI** = replaces only the API layer (~20-30% of what Next.js does)
- Separated stack (React + Vite + FastAPI) is better for **learning fundamentals** (you see every HTTP request explicitly)
- Next.js fullstack is better for **shipping real apps** solo (one repo, one deploy, one language)

```
Next.js alone:    [Browser] → [Next.js: routing + SSR + API + bundling]
Separated:        [Browser] → [Vite/React] → fetch() → [FastAPI: API only]
```

---

## File-System Routing

Create a file, get a route. No config.

```
app/
  page.tsx              → /
  about/page.tsx        → /about
  blog/[id]/page.tsx    → /blog/123 (dynamic)
```

---

## Special File Names

```
page.tsx       → UI for the route
layout.tsx     → wraps page + child routes, persists across navigation
loading.tsx    → shown while page is loading (auto Suspense boundary)
error.tsx      → shown if page throws an error
not-found.tsx  → 404 page
route.ts       → API endpoint (returns JSON, not HTML)
template.tsx   → like layout but re-mounts on every navigation
default.tsx    → fallback for parallel routes
```

A folder can have `page.tsx` OR `route.ts`, not both.

---

## page.tsx vs route.ts

- `page.tsx` = **frontend route**. Renders React, returns HTML for the user to see.
- `route.ts` = **backend route**. Returns JSON for code to consume.

```ts
// route.ts — export function names matching HTTP methods
export async function GET(request: Request) {
  return Response.json({ users: [...] })
}
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ ok: true })
}
```

---

## Server Components vs Client Components

**Server component (default, no directive):**
- Runs on the server
- Can access DB, env vars, filesystem directly
- Browser receives only HTML — no JS shipped

**Client component (`"use client"`):**
- Runs in the browser
- Full JS source code shipped to the browser
- Needed for: `onClick`, `useState`, `useEffect`, `window`, etc.

```
Need onClick/onChange/onSubmit?     → "use client"
Need useState or useReducer?       → "use client"
Need useEffect?                    → "use client"
Need window/document/localStorage? → "use client"
None of the above?                 → leave as server component
```

---

## What's Exposed vs Secure

**Server component (secure):**
- Source code: hidden
- Env vars: hidden
- DB queries: hidden
- Browser only sees the resulting HTML values

**Client component (exposed):**
- Source code: visible in DevTools → Sources
- `NEXT_PUBLIC_*` env vars: baked into JS bundle
- Props passed from server: serialized as JSON, visible in page source
- State, fetch requests, localStorage: all visible

**Key rule:** only pass to client components what you'd be comfortable showing in view-source.

---

## Env Vars

```env
# Server only (default) — browser NEVER sees these
DATABASE_URL=postgres://...
API_SECRET=sk-12345

# Public (opt-in with prefix) — browser CAN see
NEXT_PUBLIC_API_URL=https://api.mysite.com
```

No `NEXT_PUBLIC_` prefix = server only. Simple.

---

## Rendering Modes

| Mode | Where | When | Data Access |
|------|-------|------|-------------|
| Static (SSG) | Server | Build time | Direct DB |
| Dynamic (SSR) | Server | Request time | Direct DB |
| Client (CSR) | Browser | After JS loads | fetch() only |

Next.js decides automatically: if your page calls a DB, reads cookies, or uses searchParams → dynamic. Otherwise → static.

---

## Server Components Calling Data Functions

This is NOT an API call. It's a direct function call on the server:

```tsx
// page.tsx — server component
import { fetchRevenue } from '@/app/lib/data'

export default async function Page() {
  const revenue = await fetchRevenue() // direct call, same process, no HTTP
  return <h1>{revenue}</h1>
}
```

Both `page.tsx` and `data.ts` run on the server. No network request between them.

---

## Promise.all — Parallel Queries

Sequential (slow):
```ts
const a = await fetchRevenue()        // wait 200ms
const b = await fetchLatestInvoices() // wait 200ms
const c = await fetchCardData()       // wait 200ms
// Total: ~600ms
```

Parallel (fast):
```ts
const [a, b, c] = await Promise.all([
  fetchRevenue(),
  fetchLatestInvoices(),
  fetchCardData(),
])
// Total: ~200ms (slowest one)
```

Only parallelize independent queries. If one depends on another's result, keep it sequential.

---

## Tagged Template Literals (the sql`` syntax)

```ts
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const data = await sql`SELECT * FROM users WHERE id = ${userId}`
```

- `sql` before backticks is a **tag function** that intercepts the template
- `${}` values become parameterized (prevents SQL injection)
- Not string concatenation — the library handles values safely

---

## useEffect (like Godot's _ready)

```ts
useEffect(() => { ... }, [])          // runs once on mount (≈ _ready)
useEffect(() => { ... }, [userId])    // runs when userId changes
useEffect(() => { ... })              // runs on every render

useEffect(() => {
  return () => { /* cleanup */ }      // runs on unmount (≈ _exit_tree)
}, [])
```

---

## JS/TS Syntax Quick Reference

```ts
"hello" and 'hello'          // identical, no difference
`hello ${name}`              // template literal, embeds expressions
??                           // nullish coalescing: null ?? 'fallback' → 'fallback'
!                            // after a value: non-null assertion (trust me, it exists)
{ name }                     // shorthand for { name: name }
$                            // no special meaning, only inside `${}` in backticks
@                            // not JS syntax, used by frameworks (Angular) and npm scoping
```

---

## loading.tsx Behavior

```tsx
// loading.tsx
export default function Loading() {
  return <p>Loading...</p>
}
```

Next.js auto-wraps your page in Suspense:
```
1. User visits page
2. Instantly sees loading.tsx content
3. Server finishes data fetching
4. Streams real HTML, replaces loading content
```