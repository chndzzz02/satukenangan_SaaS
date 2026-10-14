import { describe, it, expect } from "vitest";
import crypto from "crypto";

function generateMidtransSignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string): string {
  return crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
}

function mapMidtransStatus(transactionStatus: string, fraudStatus?: string): "paid" | "pending" | "failed" {
  if (transactionStatus === "settlement" || (transactionStatus === "capture" && fraudStatus === "accept")) {
    return "paid";
  }
  if (transactionStatus === "pending") {
    return "pending";
  }
  return "failed";
}

describe("Midtrans Webhook & Signature Logic", () => {
  it("should generate correct HMAC SHA512 signature key", () => {
    const orderId = "SATUKENANGAN-test-123";
    const statusCode = "200";
    const grossAmount = "149000.00";
    const serverKey = "SB-Mid-server-TESTKEY";

    const expected = crypto
      .createHash("sha512")
      .update("SATUKENANGAN-test-123200149000.00SB-Mid-server-TESTKEY")
      .digest("hex");

    const result = generateMidtransSignature(orderId, statusCode, grossAmount, serverKey);
    expect(result).toBe(expected);
  });

  it("should map settlement and accepted capture to paid status", () => {
    expect(mapMidtransStatus("settlement")).toBe("paid");
    expect(mapMidtransStatus("capture", "accept")).toBe("paid");
  });

  it("should map pending transaction to pending status", () => {
    expect(mapMidtransStatus("pending")).toBe("pending");
  });

  it("should map deny, cancel, expire, and failure to failed status", () => {
    expect(mapMidtransStatus("deny")).toBe("failed");
    expect(mapMidtransStatus("cancel")).toBe("failed");
    expect(mapMidtransStatus("expire")).toBe("failed");
    expect(mapMidtransStatus("failure")).toBe("failed");
  });
});
