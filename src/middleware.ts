import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Add any custom logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If there's a token, the user is authenticated
        if (token) return true;

        return false;
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * 1. /login
     * 2. / (home page)
     * 3. /api/auth (NextAuth.js authentication routes)
     * 4. /_next (Next.js internals)
     * 5. /static (static files)
     * 6. /favicon.ico, /sitemap.xml (SEO files)
     * 7. /privacy-policy
     * 8. Any .svg files
     */
    "/((?!login|privacy-policy|assets|api/auth|api/slack|_next|static|favicon.ico|sitemap.xml|.*\\.svg).*)",
  ],
};