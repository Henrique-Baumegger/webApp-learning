# Next.js — Personal Reference Guide

> Distilled from the 15-chapter **Next.js Foundations** tutorial (App Router, Next.js 14/15).
> Built as a long-term lookup doc: scan the TOC, jump to the topic, get the signal, leave.

---

## How to use this doc

- Topics are **numbered** (`§1` … `§51`). Inline `see §X` references are jumplinks.
- Section length is proportional to how often you'll realistically need to re-read it — not to how important the concept is in the abstract. Things you'll Google in 5 seconds are one line; things that will genuinely bite you later get paragraphs.
- Code blocks show the **pattern**, not full files.
- `⚠️` callouts flag footguns.
- Alphabetical **Quick-lookup index** at the bottom.

---

## Table of Contents

**Part 1 — Foundation & Tooling**
§1 What Next.js is · §2 `create-next-app` · §3 Folder structure · §4 `package.json` scripts · §5 TypeScript · §6 Tailwind · §7 CSS Modules vs Tailwind · §8 `clsx`

**Part 2 — Routing & Layouts**
§9 File-system routing · §10 Special files · §11 Nested layouts & partial rendering · §12 Root layout · §13 Dynamic routes · §14 Route groups · §15 `<Link>` · §16 `usePathname` · §17 `useRouter`

**Part 3 — Rendering (Server vs Client)**
§18 Server vs Client Components · §19 What you can't do in Server Components · §20 Cost of `'use client'` · §21 Static vs Dynamic Rendering · §22 Partial Prerendering · §23 Streaming & Suspense · §24 Skeletons · §25 Scoping `loading.tsx`

**Part 4 — Data & Mutations**
§26 Fetching in Server Components · §27 Postgres on Vercel · §28 Waterfalls vs parallel fetches · §29 Server Actions · §30 `revalidatePath` / `revalidateTag` · §31 Zod validation · §32 `redirect` · §33 `useActionState` · §34 Progressive enhancement

**Part 5 — Search, URL State & UX**
§35 URL search params as state · §36 Debouncing · §37 Pagination

**Part 6 — Optimizations**
§38 `next/image` · §39 `next/font` · §40 Metadata API · §41 Error handling · §42 Accessibility

**Part 7 — Auth & Middleware**
§43 NextAuth.js v5 · §44 `middleware.ts` · §45 Credentials + bcrypt · §46 `authorized` callback

**Part 8 — Deployment & Security**
§47 Deploying to Vercel · §48 Environment variables · §49 `.gitignore` for secrets

**Part 9 — Nice-to-knows**
§50 Route Handlers · §51 `.bind()` for Server Actions

---

## Part 1 — Foundation & Tooling

### §1 What Next.js is
React is a UI library; Next.js is a full-stack React framework on top of it. It adds a file-system router, built-in rendering modes (server/client/static/dynamic), image/font/metadata optimizations, and server-side primitives (Server Components, Server Actions, middleware) so the frontend and backend live in the same codebase.

### §2 `create-next-app`
`npx create-next-app@latest`.

### §3 Folder structure
`/app` — routes, components, server logic (where you mostly work). `/app/lib` — data-fetching and utility functions. `/app/ui` — presentational components. `/public` — static assets. `/scripts` — one-off tasks (e.g. DB seeding).

### §4 `package.json` scripts
`dev` · `build` · `start` · `lint`.

### §5 TypeScript
Built-in. `tsconfig.json` is preconfigured.

### §6 Tailwind CSS
Utility-first: `className="flex items-center gap-2 rounded-md bg-sky-500"`. No context-switch to a `.css` file, but strings get long — mitigate with `clsx` (§8) and extracting components early.

### §7 CSS Modules vs Tailwind
Default to Tailwind for almost everything (fast, colocated, theme-consistent). Reach for CSS Modules (`foo.module.css`) only when you need scoped traditional CSS — complex pseudo-selectors, keyframes, or anything that feels hostile in utility form.

### §8 `clsx`
Conditional-class joiner:
```tsx
clsx('rounded-md px-3', { 'bg-sky-500 text-white': active })
```

---

## Part 2 — Routing & Layouts

### §9 File-system routing
In the App Router, **folders define URL segments and files define UI**. `app/dashboard/invoices/page.tsx` → route `/dashboard/invoices`. Only special filenames (`page`, `layout`, `loading`, `error`, `not-found`, `route`, `template`) are treated as route building blocks — everything else in a folder (components, helpers, hooks) is safely colocated and will never become a URL. Internalize "folders = paths, special files = UI roles" once and routing stops being something you look up.

### §10 Special files
Each special file plays a role that composes with the others:

| File | Role |
|---|---|
| `page.tsx` | The route's UI. **Required** for the segment to be publicly routable. |
| `layout.tsx` | Wraps `page.tsx` and every nested segment. Receives `children`. |
| `loading.tsx` | Automatic `<Suspense>` fallback for the segment. |
| `error.tsx` | Error boundary for the segment. Must be a Client Component. |
| `not-found.tsx` | Rendered by `notFound()` or when no segment matches. |
| `route.ts` | HTTP endpoint (replaces `pages/api`). |

Mix and match per segment.

### §11 Nested layouts & partial rendering
Layouts nest by folder. `app/layout.tsx` wraps everything; `app/dashboard/layout.tsx` wraps only `/dashboard/*`. When navigating *within* a shared layout (e.g. `/dashboard` → `/dashboard/invoices`), the layout **does not re-render** — only the inner `page.tsx` swaps. This is **partial rendering**, and it's why sidebars don't flicker between dashboard pages. Practical consequence: state, animations, or expensive setup in a layout persists across its child routes for free.

### §12 Root layout
`app/layout.tsx` is the single layout every page inherits. It's the only place `<html>` and `<body>` tags live, and where global fonts (§39) and global CSS are attached.

### §13 Dynamic routes
`app/invoices/[id]/page.tsx` matches `/invoices/123` and receives `params: { id: string }`. `[...slug]` = catch-all; `[[...slug]]` = optional catch-all.

### §14 Route groups
`(folder)` groups without adding to the URL.

### §15 `<Link>`
From `next/link`. Client-side navigation (no full reload) + automatic prefetching of links in the viewport. Most of the "feels like an SPA" experience comes from just using it instead of `<a>`.

### §16 `usePathname()`
From `next/navigation`. Returns the current URL path — used to highlight active nav links. Client-only.

### §17 `useRouter()`
Programmatic client-side navigation.

---

## Part 3 — Rendering (Server vs Client)

### §18 Server vs Client Components
**Default: every component in `app/` is a Server Component.** It runs on the server, never ships JS to the browser, and can directly `await` database calls, read `process.env` secrets, and import Node-only libraries. The output is serialized as HTML + a compact React payload.

You opt a component into the browser by adding `'use client'` at the top of its file. From that file *and everything it imports*, you get browser APIs, event handlers (`onClick`, `onChange`), and React state/effect hooks — the "traditional" React experience.

**Mental model:** Server Components for fetching data and rendering structure; Client Components for interactivity. A typical page is a Server Component that fetches data and passes it to a small Client Component for the interactive pieces (search input, dropdown, chart). No API layer is needed between them — the Server Component talks to the DB directly, because it *is* the backend.

**Composition rule:** a Server Component can import a Client Component (fine), but a Client Component can't import a Server Component directly — it can only receive one via the `children` prop. That's why you often see structures like `<ClientShell>{serverChildren}</ClientShell>`.

| | Server Component | Client Component |
|---|---|---|
| Marker | *(default)* | `'use client'` at top of file |
| Where it runs | Server only | Server (for initial HTML) **and** browser |
| Can `await` DB | ✅ | ❌ |
| Can use `useState`/`useEffect` | ❌ | ✅ |
| Can have `onClick` etc. | ❌ | ✅ |
| Ships JS to browser | ❌ | ✅ |
| Can read `process.env` secrets | ✅ | ❌ (only `NEXT_PUBLIC_*`) |

### §19 What you can't do in Server Components
No `useState`, `useEffect`, or any hook depending on client state. No event handlers (they'd have nothing to hook into on the server). No `window`, `document`, `localStorage`. No Context (you can *read* from it, but providers must be Client Components). If you need any of these, either mark the file `'use client'` or extract the interactive piece into its own Client Component and render it as a child.

### §20 Cost of `'use client'`
The component and everything it imports gets bundled and shipped to the browser — so no direct DB access, no server secrets, and a bigger JS payload. **Push `'use client'` as far down the tree as possible.**

### §21 Static vs Dynamic Rendering
**Static:** the HTML is generated once at build time (or at revalidation), cached, and served to everyone. Fast, cheap, but can't show per-user or per-request data. **Dynamic:** the page is rendered on every request — needed for user-specific dashboards, real-time data, etc. A route becomes dynamic automatically when it reads `cookies()`, `headers()`, `searchParams`, or uses a non-cached `fetch`. You rarely configure this explicitly — the framework infers from what your code does.

### §22 Partial Prerendering (PPR)
Experimental. Serves a *static shell* instantly and streams in the *dynamic holes* (wrapped in `<Suspense>`) as they resolve. Gives you both rendering modes on the same page.

### §23 Streaming & Suspense
Instead of blocking the whole page on the slowest query, wrap slow components in `<Suspense fallback={<Skeleton />}>`. The server sends the shell immediately and streams each Suspense boundary's HTML as its data resolves. A `loading.tsx` file is just a shortcut that wraps the segment's `page.tsx` in a Suspense boundary automatically. Result: user sees layout + skeletons *immediately* and content fills in progressively — a perceived-performance win even when total load time is identical.

### §24 Skeletons
Placeholder UI during loading (pulsing gray blocks).

### §25 Scoping `loading.tsx`
Put `loading.tsx` inside a route group `(overview)/loading.tsx` to scope the skeleton narrowly.

---

## Part 4 — Data & Mutations

### §26 Fetching in Server Components
Because Server Components run on the server, you `await` DB queries directly in the component body — no `useEffect`, no `/api` route, no `getServerSideProps`:

```tsx
async function Page() {
  const invoices = await sql`SELECT * FROM invoices`;
  return <Table rows={invoices} />;
}
```

The "backend" is colocated with the UI that uses it, and none of that code ships to the client.

### §27 Postgres on Vercel
Vercel provides a managed Postgres instance; connection string goes in `.env.local` (and the Vercel env dashboard in production). Query with `postgres` (`sql\`SELECT...\``) or an ORM like Prisma.

### §28 Waterfalls vs parallel fetches
A **waterfall** is when each `await` waits for the previous one to finish:

```tsx
const a = await fetchA();  // waits
const b = await fetchB();  // only starts now, even though it doesn't need `a`
```

Fix with `Promise.all`:

```tsx
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

Parallelism is often the single biggest performance win on a dashboard, because most queries are independent. Keep the sequential form **only** when a later fetch genuinely needs the earlier one's result.

### §29 Server Actions
Server Actions are async functions marked `'use server'` that run on the server but can be called directly from forms or Client Components — **no `/api` route, no client-side `fetch`**:

```tsx
// app/lib/actions.ts
'use server';
export async function createInvoice(formData: FormData) {
  const amount = formData.get('amount');
  await sql`INSERT INTO invoices (amount) VALUES (${amount})`;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

```tsx
// the form
<form action={createInvoice}> ... </form>
```

Under the hood, Next.js creates a POST endpoint, handles CSRF, and invokes the function. Because it's "just a function," it composes naturally with validation (§31), auth, and rollbacks — write it the way you'd write any server function.

Two important properties fall out of this design:

1. **Progressive enhancement** (§34) — forms work even if JavaScript hasn't loaded, because the action is a real POST endpoint.
2. **No client-server type skew** — you call the function directly, so TypeScript sees the same signature on both sides. Rename a field, the caller breaks at compile time.

⚠️ Server Actions always run on a request, so anything stateful (file uploads, multi-step wizards) still benefits from a client-side orchestrator. And because they mutate, you almost always pair them with `revalidatePath` or `revalidateTag` (§30) to invalidate the cached page that displays the mutated data.

### §30 `revalidatePath` / `revalidateTag`
`revalidatePath('/dashboard/invoices')` invalidates the Next.js cache for that specific route. `revalidateTag('invoices')` invalidates every fetch tagged `'invoices'`. Use the former for route-scoped pages, the latter when the same data feeds many routes.

### §31 Zod validation
Schema library used inside Server Actions to parse + validate `FormData` before touching the DB. `schema.safeParse(raw)` returns either a typed object or a structured error list you can feed back to the form UI via `useActionState` (§33).

### §32 `redirect`
`redirect('/url')` from `next/navigation` — works from Server Components and Server Actions.

### §33 `useActionState`
Client hook that wraps a Server Action and exposes the action's previous return value (typically validation errors) plus a `pending` flag for spinners. Lets the form show inline errors without the action having to throw.

### §34 Progressive enhancement
A `<form action={serverAction}>` submits as a plain POST if JavaScript fails to load, because Server Actions are real HTTP endpoints under the hood. Stays usable on slow connections, older browsers, and during hydration — you get this for free by not building forms around `onSubmit`.

---

## Part 5 — Search, URL State & UX

### §35 URL search params as state
For filters, search queries, and pagination, **the URL is your state store**, not React state. Server Components read `searchParams` directly as a prop; Client Components use `useSearchParams()`. Benefits: state is shareable (copy the URL), bookmarkable, survives reload, SSR-friendly (no hydration flicker). Typical flow: user types in a search box → Client Component calls `router.replace(\`?query=\${value}\`)` → the Server Component higher in the tree re-runs with the new `searchParams` and refetches. Keeping filter state in `useState` becomes an anti-pattern in this model.

### §36 Debouncing
`use-debounce` wraps the input callback.

### §37 Pagination
Driven by `?page=N` in the URL (same pattern as search). Server Component reads the param, queries with `LIMIT`/`OFFSET`, returns the slice; a client `<Pagination>` component only renders links.

---

## Part 6 — Optimizations

### §38 `next/image`
Drop-in replacement for `<img>` with automatic sizing (prevents CLS), lazy loading, responsive `srcset`, and modern formats (WebP/AVIF). You **must** supply `width` + `height` (or `fill`) so the browser reserves space before the image loads.

### §39 `next/font`
Downloads fonts at build time and self-hosts them alongside your assets — no runtime request to Google Fonts, no layout shift when the font swaps in. Import once in `app/layout.tsx` and attach the class to `<body>`.

### §40 Metadata API
Export a `metadata` object (or async `generateMetadata` for dynamic titles) from any `layout.tsx` or `page.tsx`; Next.js merges them into `<head>`. Template pattern: root sets `title: { template: '%s | My App', default: 'My App' }`, child pages set `title: 'Invoices'` → renders `Invoices | My App`.

### §41 Error handling
`error.tsx` catches runtime errors in its segment (must be a Client Component; receives `error` + `reset` props). `notFound()` from `next/navigation` triggers the nearest `not-found.tsx`.

### §42 Accessibility
`eslint-plugin-jsx-a11y` catches common a11y mistakes at lint time.

---

## Part 7 — Auth & Middleware

### §43 NextAuth.js v5
The config is deliberately **split across two files** because middleware runs on the edge runtime and can't ship Node-only code like `bcrypt`:

- `auth.config.ts` — edge-safe: `pages`, `callbacks` (including `authorized`), no DB imports. Imported by `middleware.ts`.
- `auth.ts` — full config: adds providers like `Credentials`, DB lookups, `bcrypt`. Exports `auth`, `signIn`, `signOut`.

The `authorized` callback is the access-control policy — return `true` / `false` / `Response` to allow, deny, or redirect. Once this is set up, protecting a route is just putting it under a folder covered by the middleware matcher; calling `auth()` in a Server Component gives you the current session.

### §44 `middleware.ts`
Runs on every matching request **before** the route handler — ideal for auth checks and redirects. Configure which paths it runs on:
```ts
export const config = { matcher: ['/dashboard/:path*'] };
```

### §45 Credentials + bcrypt
The `Credentials` provider takes an `authorize(creds)` function where you look up the user and `bcrypt.compare(plain, hash)` against the stored hash. Return the user object on success, `null` on failure.

### §46 `authorized` callback
Gatekeeper. Returns `true` / `false` / `Response`.

---

## Part 8 — Deployment & Security

### §47 Deploying to Vercel
Import the GitHub repo in Vercel; auto-deploys on push to `main`.

### §48 Environment variables
`.env.local` for local secrets (gitignored by default — **verify** before first commit). Vercel's Environment Variables dashboard for production. Variables prefixed `NEXT_PUBLIC_` are exposed to the browser bundle; everything else stays server-only.

⚠️ **Rotate any secret the moment it touches git history** — even in a deleted commit, even in a force-pushed branch. `git log`, GitHub's raw-blob URLs, and third-party scrapers preserve everything. Automated scanners find public-repo leaks within minutes of the push.

Practical habit before every commit:
```bash
git status                    # stray .env* files?
cat .gitignore | grep .env    # actually ignored?
```

This is the single setup step most worth obsessing over — leaks are silent, fast to exploit, and painful to undo.

### §49 `.gitignore` for secrets
`.env*.local` must be in there. Verify before first push.

---

## Part 9 — Nice-to-knows

### §50 Route Handlers
`app/api/foo/route.ts` — export `GET`, `POST`, etc.

### §51 `.bind()` for Server Actions
`action={updateInvoice.bind(null, id)}` passes extra args to the action.

---

## Quick-lookup index

| Keyword | Section |
|---|---|
| Accessibility | §42 |
| `authorized` callback | §46 |
| Authentication | §43–§46 |
| `.bind()` | §51 |
| Cache invalidation | §30 |
| Client Components | §18, §19, §20 |
| CLS (layout shift) | §38, §39 |
| `clsx` | §8 |
| `cookies()` / `headers()` | §21 |
| `create-next-app` | §2 |
| Credentials provider | §45 |
| CSS Modules | §7 |
| Data fetching | §26, §27, §28 |
| Debouncing | §36 |
| Deployment | §47 |
| Dynamic routes | §13 |
| Environment variables | §48 |
| Error boundaries | §41 |
| File-system routing | §9, §10 |
| Folder structure | §3 |
| Forms | §29, §33, §34 |
| Layouts (nested) | §11, §12 |
| `<Link>` | §15 |
| `loading.tsx` | §10, §23, §25 |
| Metadata | §40 |
| Middleware | §44 |
| NextAuth.js | §43 |
| `next/font` | §39 |
| `next/image` | §38 |
| `notFound()` | §41 |
| Pagination | §37 |
| Parallel fetches | §28 |
| Partial prerendering | §22 |
| Partial rendering (layouts) | §11 |
| Postgres | §27 |
| Progressive enhancement | §34 |
| `redirect()` | §32 |
| `revalidatePath` / `revalidateTag` | §30 |
| Root layout | §12 |
| Route groups | §14, §25 |
| Route Handlers | §50 |
| `searchParams` | §35 |
| Server Actions | §29, §51 |
| Server Components | §18, §19, §26 |
| Skeletons | §24 |
| Special files | §10 |
| Static vs Dynamic Rendering | §21 |
| Streaming | §23 |
| Suspense | §23 |
| Tailwind | §6 |
| TypeScript | §5 |
| URL state | §35 |
| `useActionState` | §33 |
| `use client` | §18, §20 |
| `usePathname()` | §16 |
| `useRouter()` | §17 |
| `use server` | §29 |
| Vercel | §47, §48 |
| Waterfall (data) | §28 |
| Zod | §31 |
