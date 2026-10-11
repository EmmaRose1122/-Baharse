import { NextRequest, NextResponse } from "next/server";
import { trackOrderSchema } from "@/lib/validators";
import { trackOrder } from "@/lib/supabase/data-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = trackOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const order = await trackOrder(
      parseResult.data.order_number,
      parseResult.data.phone
    );

    if (!order) {
      return NextResponse.json(
        {
          error:
            "No order found matching this order number and phone number. Please verify your details or contact customer support.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (err: any) {
    console.error("Track order error:", err);
    return NextResponse.json(
      { error: "Could not track order. Please try again." },
      { status: 500 }
    );
  }
}
