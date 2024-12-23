import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n.config";
import type { NextRequest } from "next/server";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

// Middleware function
export function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ]
};