import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isAuthorizedAdminEmail,
  signAdminToken,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let isAuthorized = false;

    // 1. First check secret credentials from .env
    if (verifyAdminCredentials(cleanEmail, password)) {
      isAuthorized = true;
    }

    // 2. Alternatively check Supabase user authentication if configured
    if (!isAuthorized && isSupabaseConfigured()) {
      try {
        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data?.user?.email && isAuthorizedAdminEmail(data.user.email)) {
          isAuthorized = true;
        }
      } catch {
        // Fall through
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Invalid admin credentials. Access is restricted to authorized administrators." },
        { status: 401 }
      );
    }

    // Generate signed secure session token
    const token = await signAdminToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      email: cleanEmail,
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "An error occurred during authentication." },
      { status: 500 }
    );
  }
}
