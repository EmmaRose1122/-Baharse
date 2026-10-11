import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators";
import { processNewOrder } from "@/lib/supabase/data-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Basic rate limiting by IP (max 5 orders per 1 minute per IP)
    const ip = req.headers.get("x-forwarded-for") || req.ip || "global-ip";
    const rateCheck = checkRateLimit(`order-${ip}`, 5, 60000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before submitting again.",
        },
        { status: 429 }
      );
    }

    // 2. Validate request body with Zod
    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 3. Process order with server-side pricing and atomic inventory decrement
    const result = await processNewOrder(parseResult.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Could not process order." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        order: result.order,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order processing error:", err);
    return NextResponse.json(
      { error: "Internal server error while processing order." },
      { status: 500 }
    );
  }
}
