export { default } from 'next-auth/middleware';

// Protect this routes and redirect to sign-in page if unauthorized
export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
};
