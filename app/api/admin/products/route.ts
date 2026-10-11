import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { productAdminSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { MOCK_PRODUCTS } from "@/lib/supabase/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }

    return NextResponse.json({ products: data.length > 0 ? data : MOCK_PRODUCTS });
  } catch {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      const newProduct = {
        id: `p-${Date.now()}`,
        ...parsed.data,
        old_price: parsed.data.old_price ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_PRODUCTS.unshift(newProduct as any);
      return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .insert({
        ...parsed.data,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
