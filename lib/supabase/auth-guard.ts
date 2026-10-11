import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./data-service";
import {
  ADMIN_COOKIE_NAME,
  isAuthorizedAdminEmail,
  verifyAdminToken,
} from "@/lib/admin-auth";

export interface AdminAuthCheckResult {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  isDemo?: boolean;
}

/**
 * Strictly validates admin session on the server for route handlers.
 * Never allows unauthorized users or demo bypass into admin endpoints.
 */
export async function verifyAdminSession(req?: NextRequest): Promise<AdminAuthCheckResult> {
  try {
    // 1. Check custom signed admin session cookie
    let adminToken: string | undefined = undefined;

    if (req) {
      adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    }

    if (!adminToken) {
      try {
        const cookieStore = cookies();
        adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      } catch {
        // Ignored if outside request context
      }
    }

    if (adminToken) {
      const tokenCheck = await verifyAdminToken(adminToken);
      if (tokenCheck.valid && tokenCheck.email) {
        return {
          isAuthenticated: true,
          userId: "admin-secret-user",
          email: tokenCheck.email,
          isDemo: false,
        };
      }
    }

    // 2. Check Supabase user authentication if configured
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user?.email && isAuthorizedAdminEmail(user.email)) {
        return {
          isAuthenticated: true,
          userId: user.id,
          email: user.email,
          isDemo: false,
        };
      }
    }

    return { isAuthenticated: false };
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Admin auth verification error:", err);
    return { isAuthenticated: false };
  }
}
