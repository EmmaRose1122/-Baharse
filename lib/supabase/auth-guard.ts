import { NextRequest } from "next/server";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./data-service";

export interface AdminAuthCheckResult {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  isDemo?: boolean;
}

/**
 * Validates admin session on the server for route handlers
 */
export async function verifyAdminSession(req?: NextRequest): Promise<AdminAuthCheckResult> {
  // If Supabase is not yet configured, allow demo admin session
  if (!isSupabaseConfigured()) {
    return {
      isAuthenticated: true,
      userId: "demo-admin-id",
      email: "admin@importedgoods.pk",
      isDemo: true,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
      isDemo: false,
    };
  } catch (err) {
    console.error("Auth verification error:", err);
    return { isAuthenticated: false };
  }
}
