import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getEvent, updatePaymentStatus, updateGuestLimit } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status_code, transaction_status, gross_amount, signature_key, fraud_status } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    const orderPrefix = "SATUKENANGAN-";
    if (!order_id.startsWith(orderPrefix)) {
      return NextResponse.json({ success: false, error: "Invalid order_id format" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key && status_code && gross_amount) {
      const payloadString = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const expectedSignature = crypto.createHash("sha512").update(payloadString).digest("hex");

      if (expectedSignature !== signature_key) {
        console.warn(`[Midtrans Webhook] Invalid signature key for order ${order_id}`);
        return NextResponse.json({ success: false, error: "Signature webhook tidak valid." }, { status: 403 });
      }
    }

    // Parse slug & topup limit if order_id format is SATUKENANGAN-TOPUP-[slug]-[newLimit]-[timestamp]
    const isTopUp = order_id.startsWith("SATUKENANGAN-TOPUP-");
    let slug = "";
    let topUpLimit = 0;

    if (isTopUp) {
      const parts = order_id.split("-");
      // SATUKENANGAN-TOPUP-[slug]-[limit]-[timestamp]
      if (parts.length >= 5) {
        topUpLimit = parseInt(parts[parts.length - 2], 10) || 0;
        slug = parts.slice(2, parts.length - 2).join("-");
      }
    } else {
      // SATUKENANGAN-[slug]-[timestamp]
      const parts = order_id.split("-");
      slug = parts.slice(1, parts.length - 1).join("-");
    }

    if (!slug) {
      return NextResponse.json({ success: false, error: "Gagal memproses slug dari order_id." }, { status: 400 });
    }

    const event = await getEvent(slug);
    if (!event) {
      return NextResponse.json({ success: false, error: "Acara tidak ditemukan." }, { status: 404 });
    }

    // Handle Midtrans transaction status
    const isPaid =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    const isPending = transaction_status === "pending";
    const isFailed =
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "failure";

    if (isPaid) {
      await updatePaymentStatus(slug, "paid");
      if (isTopUp && topUpLimit > event.guestLimit) {
        await updateGuestLimit(slug, topUpLimit, event.price);
        console.log(`[Midtrans Webhook] Event ${slug} guest limit upgraded to ${topUpLimit}`);
      }
      console.log(`[Midtrans Webhook] Event ${slug} status updated to PAID`);
    } else if (isPending) {
      await updatePaymentStatus(slug, "unpaid");
      console.log(`[Midtrans Webhook] Event ${slug} status is PENDING`);
    } else if (isFailed) {
      await updatePaymentStatus(slug, "unpaid");
      console.log(`[Midtrans Webhook] Event ${slug} payment FAILED/EXPIRED`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("[Midtrans Webhook Exception]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
