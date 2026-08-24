import { NextRequest, NextResponse } from "next/server";
import store from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json({ success: false, error: "Slug acara wajib diisi." }, { status: 400 });
    }
    const event = store.getEvent(slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Acara tidak ditemukan." },
        { status: 404 }
      );
    }

    if (event.price === 0) {
      store.updatePaymentStatus(slug, "free");
      return NextResponse.json({
        success: true,
        message: "Acara gratis berhasil diaktifkan.",
        redirectUrl: `/events/${slug}`,
      });
    }

    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;

    if (midtransServerKey) {
      // Production / Sandbox Midtrans Snap Integration
      const authHeader = Buffer.from(`${midtransServerKey}:`).toString("base64");
      const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions";

      const payload = {
        transaction_details: {
          order_id: `SATUKENANGAN-${slug}-${Date.now()}`,
          gross_amount: event.price,
        },
        customer_details: {
          first_name: event.hostName,
          email: event.hostEmail,
        },
        item_details: [
          {
            id: `PAKET-${event.guestLimit}`,
            price: event.price,
            quantity: 1,
            name: `satukenangan - Paket ${event.guestLimit} Tamu`,
          },
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
        });
      }
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Midtrans belum dikonfigurasi." }, { status: 503 });
    }

    // Fallback Mock Midtrans Transaction for local testing
    const mockSnapToken = `SNAP-MOCK-${Date.now()}`;
    return NextResponse.json({
      success: true,
      snapToken: mockSnapToken,
      redirectUrl: `/dashboard/${slug}?payment=mock_success`,
      isMock: true,
      message: "Menggunakan Mock Midtrans Payment untuk pengujian lokal.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
