import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { submitContactMessage } from "@/lib/supabase/data-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "global-ip";
    const rateCheck = checkRateLimit(`contact-${ip}`, 3, 60000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait 1 minute before retrying." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await submitContactMessage(parseResult.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send message." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received! Our support team will respond shortly.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
