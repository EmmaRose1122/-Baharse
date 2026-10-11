import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic"];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a receipt screenshot (JPG, PNG, WEBP)." },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Receipt image is too large. Maximum file size is 10MB." },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    if (!isSupabaseConfigured()) {
      // In demo mode without configured Supabase bucket, convert to base64 Data URL or return sample receipt image
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: file.name,
      });
    }

    const admin = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("payment-receipts")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Receipt upload error:", uploadError);
      // Fallback to data url if storage bucket isn't yet created in Supabase
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      return NextResponse.json({
        success: true,
        url: `data:${file.type};base64,${base64}`,
        fileName: file.name,
      });
    }

    const {
      data: { publicUrl },
    } = admin.storage.from("payment-receipts").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
    });
  } catch (err: any) {
    console.error("Receipt upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload payment receipt" },
      { status: 500 }
    );
  }
}
