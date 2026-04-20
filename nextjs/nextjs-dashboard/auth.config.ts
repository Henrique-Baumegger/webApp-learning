import type { NextAuthConfig } from 'next-auth';

// Three ways to attach a type in TypeScript:
//   `: Type`         — annotation: checks value, but widens it to Type (loses literal info)
//   `as Type`        — assertion: "trust me, it's a Type" — weaker checking, can hide bugs
//   `satisfies Type` — checks value AND preserves the narrow/literal type (best of both)
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
// Trailing commas (the `,` before `}`) are purely stylistic
// (because other fields of that object could be added later — cleaner git diffs)
