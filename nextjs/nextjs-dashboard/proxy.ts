
//proxy.ts functions as a network boundary to intercept requests before they reach routes. 
// It enables lightweight tasks such as redirects, header manipulation, and authentication 
// utilizing the full Node.js runtime.



import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};