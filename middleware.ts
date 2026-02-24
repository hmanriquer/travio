import NextAuth from 'next-auth';

import authConfig from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all API routes and everything except login/register
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};
