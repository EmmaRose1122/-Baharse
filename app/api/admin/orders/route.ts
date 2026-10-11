import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { MOCK_ORDERS } from "@/lib/supabase/mock-data";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("payment_status");
  const search = searchParams.get("search");

  if (!isSupabaseConfigured()) {
    let orders = [...MOCK_ORDERS];
    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }
    if (paymentStatus && paymentStatus !== "all") {
      orders = orders.filter((o) => o.payment_status === paymentStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          (o.transaction_id && o.transaction_id.toLowerCase().includes(q))
      );
    }
    return NextResponse.json({ orders });
  }

  try {
    const admin = createAdminClient();
    let query = admin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%,transaction_id.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || MOCK_ORDERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
