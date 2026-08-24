import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getEvent, updatePaymentStatus } from "@/lib/data";

function statusForSignature(status: string) {
  return status === "capture" ? "capture" : status;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, gross_amount, signature_key } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    // Extract slug from order_id format: SATUKENANGAN-[slug]-[timestamp]
    const orderPrefix = "SATUKENANGAN-";
    if (!order_id.startsWith(orderPrefix)) {
      return NextResponse.json({ success: false, error: "Invalid order_id" }, { status: 400 });
    }
    const slug = order_id.slice(orderPrefix.length).replace(/-[^-]+$/, "");

    const event = await getEvent(slug);
    if (!event) {
      return NextResponse.json({ success: false, error: "Acara tidak ditemukan." }, { status: 404 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key) {
      const expectedSignature = crypto.createHash("sha512").update(`${order_id}${transaction_status}${gross_amount}${serverKey}`).digest("hex");
      if (expectedSignature !== signature_key) {
        return NextResponse.json({ success: false, error: "Signature webhook tidak valid." }, { status: 403 });
      }
    }

    if (transaction_status === "capture" || transaction_status === "settlement") {
      await updatePaymentStatus(slug, "paid");
      console.log(`[Midtrans Webhook] Event ${slug} set to PAID`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
