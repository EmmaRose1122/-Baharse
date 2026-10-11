import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { settingsAdminSchema } from "@/lib/validators";
import { isSupabaseConfigured, getSiteSettings } from "@/lib/supabase/data-service";
import { MOCK_SETTINGS } from "@/lib/supabase/mock-data";

export async function GET(req: NextRequest) {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = settingsAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      Object.assign(MOCK_SETTINGS, parsed.data);
      return NextResponse.json({ success: true, settings: MOCK_SETTINGS });
    }

    const admin = createAdminClient();
    // Get existing settings id
    const { data: existing } = await admin.from("site_settings").select("id").limit(1).single();

    let query;
    if (existing) {
      query = admin
        .from("site_settings")
        .update({
          ...parsed.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      query = admin
        .from("site_settings")
        .insert({
          ...parsed.data,
        })
        .select()
        .single();
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
