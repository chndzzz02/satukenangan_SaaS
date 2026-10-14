import { NextRequest, NextResponse } from "next/server";
import { getEvent, updatePaymentStatus, updateGuestLimit } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { slug, topUpGuestLimit, priceAmount } = await req.json();
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json({ success: false, error: "Slug acara wajib diisi." }, { status: 400 });
    }

    const event = await getEvent(slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Acara tidak ditemukan." },
        { status: 404 }
      );
    }

    const isTopUp = typeof topUpGuestLimit === "number" && topUpGuestLimit > event.guestLimit;
    const finalGuestLimit = isTopUp ? topUpGuestLimit : event.guestLimit;
    const amount = typeof priceAmount === "number" ? priceAmount : event.price;

    if (amount === 0) {
      await updatePaymentStatus(slug, "free");
      if (isTopUp) {
        await updateGuestLimit(slug, finalGuestLimit, 0);
      }
      return NextResponse.json({
        success: true,
        message: "Acara gratis berhasil diaktifkan.",
        redirectUrl: `/payment/success?order_id=FREE-${slug}&status=success`,
      });
    }

    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderId = isTopUp
      ? `SATUKENANGAN-TOPUP-${slug}-${finalGuestLimit}-${Date.now()}`
      : `SATUKENANGAN-${slug}-${Date.now()}`;

    if (midtransServerKey) {
      const authHeader = Buffer.from(`${midtransServerKey}:`).toString("base64");
      const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions";

      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: {
          first_name: event.hostName,
          email: event.hostEmail,
        },
        item_details: [
          {
            id: isTopUp ? `TOPUP-${finalGuestLimit}` : `PAKET-${event.guestLimit}`,
            price: amount,
            quantity: 1,
            name: isTopUp
              ? `satukenangan - Upgrade ${finalGuestLimit} Tamu`
              : `satukenangan - Paket ${event.guestLimit} Tamu`,
          },
        ],
        callbacks: {
          finish: `${appBaseUrl}/payment/success?order_id=${orderId}&slug=${slug}`,
          unfinish: `${appBaseUrl}/payment/failed?order_id=${orderId}&slug=${slug}&reason=unfinished`,
          error: `${appBaseUrl}/payment/failed?order_id=${orderId}&slug=${slug}&reason=error`,
        },
        enabled_payments: [
          "qris",
          "gopay",
          "bank_transfer",
          "bca_va",
          "bri_va",
          "bni_va",
          "credit_card",
          "shopeepay",
        ],
      };

      const response = await fetch(midtransUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.token) {
        return NextResponse.json({
          success: true,
          snapToken: data.token,
          redirectUrl: data.redirect_url,
          orderId,
        });
      }
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Midtrans Server Key belum dikonfigurasi." }, { status: 503 });
    }

    // Fallback Mock Midtrans Transaction for local testing
    const mockSnapToken = `SNAP-MOCK-${Date.now()}`;
    return NextResponse.json({
      success: true,
      snapToken: mockSnapToken,
      redirectUrl: `/payment/success?order_id=${orderId}&slug=${slug}&is_mock=true`,
      isMock: true,
      orderId,
      message: "Menggunakan Mock Midtrans Payment untuk pengujian lokal.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
