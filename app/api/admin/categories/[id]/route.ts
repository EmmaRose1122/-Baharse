import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryAdminSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { MOCK_CATEGORIES } from "@/lib/supabase/mock-data";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

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
      const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) {
        MOCK_CATEGORIES[idx] = {
          ...MOCK_CATEGORIES[idx],
          name: parsed.data.name,
          slug: parsed.data.slug,
          image_url: parsed.data.image_url || null,
          description: parsed.data.description || null,
        };
        return NextResponse.json({ success: true, category: MOCK_CATEGORIES[idx] });
      }
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .update({
        name: parsed.data.name,
        slug: parsed.data.slug,
        image_url: parsed.data.image_url || null,
        description: parsed.data.description || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  if (!isSupabaseConfigured()) {
    const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) {
      MOCK_CATEGORIES.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: "Category deleted" });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("categories").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
