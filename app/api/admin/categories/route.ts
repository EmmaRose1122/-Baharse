import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryAdminSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { MOCK_CATEGORIES } from "@/lib/supabase/mock-data";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ categories: MOCK_CATEGORIES });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = categoryAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      const newCat = {
        id: `c-${Date.now()}`,
        ...parsed.data,
        image_url: parsed.data.image_url || null,
        description: parsed.data.description || null,
        created_at: new Date().toISOString(),
      };
      MOCK_CATEGORIES.push(newCat);
      return NextResponse.json({ success: true, category: newCat }, { status: 201 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .insert({
        name: parsed.data.name,
        slug: parsed.data.slug,
        image_url: parsed.data.image_url || null,
        description: parsed.data.description || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
