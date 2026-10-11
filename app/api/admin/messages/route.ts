import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";
import { Message } from "@/types";

export const dynamic = "force-dynamic";

const mockAdminMessages: Message[] = [
  {
    id: "msg-demo-1",
    name: "Usman Ghani",
    phone: "03021234567",
    email: "usman.ghani@gmail.com",
    message: "Salam, do you have Club De Nuit Parfum in 200ml size or only 150ml? And can I get same-day delivery in Lahore?",
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "msg-demo-2",
    name: "Dr. Ayesha Malik",
    phone: "03348877665",
    email: "ayesha.malik@outlook.com",
    message: "Inquiring about Kirkland Glucosamine batch expiry date. Could you please confirm the expiration stamped on the bottle?",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ messages: mockAdminMessages });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data || mockAdminMessages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
