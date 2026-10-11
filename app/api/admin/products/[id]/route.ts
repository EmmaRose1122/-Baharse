import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { productAdminSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { MOCK_PRODUCTS } from "@/lib/supabase/mock-data";

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
    const parsed = productAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS[idx] = {
          ...MOCK_PRODUCTS[idx],
          ...parsed.data,
          old_price: parsed.data.old_price ?? null,
          updated_at: new Date().toISOString(),
        } as any;
        return NextResponse.json({ success: true, product: MOCK_PRODUCTS[idx] });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
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
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: "Product deleted" });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
