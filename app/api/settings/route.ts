import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/supabase/data-service";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
