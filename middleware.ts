import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isAuthorizedAdminEmail,
  verifyAdminToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public admin auth routes that shouldn't be blocked
  const isPublicAdminRoute =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  // Only protect admin pages and admin API routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // 1. Check custom signed admin session cookie
  const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const authCheck = await verifyAdminToken(adminToken);
    if (authCheck.valid) {
      return NextResponse.next();
    }
  }

  // 2. Check Supabase session and ensure the logged-in user is an authorized admin
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("your-project");

  if (isSupabaseConfigured) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    try {
      const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Only allow access if the user exists AND their email matches an authorized admin
      if (user && isAuthorizedAdminEmail(user.email)) {
        return response;
      }
    } catch {
      // Fall through to unauthorized block
    }
  }

  // 3. Unauthorized access rejection
  if (isAdminApiRoute) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required. Please sign in with admin credentials." },
      { status: 401 }
    );
  }

  const redirectUrl = new URL("/admin/login", request.url);
  redirectUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
