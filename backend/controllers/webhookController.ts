// src/controllers/webhookController.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { EventReservation } from "../models/eventReservationModel";

const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET!;

export const handlePaymongoWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Extract signature header
  const sigHeader = req.headers["paymongo-signature"] as string;
  if (!sigHeader) {
    console.warn("Missing Paymongo-Signature header");
    res.status(400).send("Missing signature");
    return;
  }

  // 2. Split into t, te, li
  const parts = sigHeader.split(",");
  const sigMap: Record<string, string> = {};
  for (const part of parts) {
    const [k, v] = part.split("=").map((s) => s.trim());
    if (k && v) sigMap[k] = v;
  }

  const timestamp = sigMap["t"];
  // Use 'li' for live mode; if you're testing, use 'te'
  const expectedSig = sigMap["li"];
  if (!timestamp || !expectedSig) {
    console.warn("Invalid signature format", sigMap);
    res.status(400).send("Invalid signature format");
    return;
  }

  // 3. Compute HMAC-SHA256
  const rawBody = req.body as Buffer;
  const payload = `${timestamp}.${rawBody.toString()}`;
  const hmac = crypto
    .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  if (hmac !== expectedSig) {
    console.warn("Signature verification failed", { hmac, expectedSig });
    res.status(400).send("Invalid signature");
    return;
  }

  // 4. Parse JSON payload
  let parsed: any;
  try {
    parsed = JSON.parse(rawBody.toString());
  } catch (err) {
    console.warn("Failed to parse JSON", err);
    res.status(400).send("Invalid JSON");
    return;
  }

  // 5. Validate event structure
  const event = parsed.data;
  if (!event?.type || !event.attributes?.data) {
    console.warn("Incomplete webhook payload:", parsed);
    res.status(200).send("Payload incomplete");
    return;
  }

  console.log(`Received PayMongo event: ${event.type}`);

  // 6. Handle link.payment.paid
  if (event.type === "link.payment.paid") {
    const linkData = event.attributes.data;
    const linkId = linkData.id;
    const status = linkData.attributes?.status;

    if (status === "paid" && linkId) {
      try {
        const reservation = await EventReservation.findOne({
          "paymentData.id": linkId,
        });
        if (!reservation) {
          console.warn(`No reservation for link ID ${linkId}`);
        } else if (reservation.paymentStatus !== "Paid") {
          const paidAmt = (linkData.attributes.amount || 0) / 100;
          reservation.paymentStatus =
            paidAmt >= reservation.totalPayment
              ? "Paid"
              : paidAmt > 0
              ? "Partially Paid"
              : "Not Paid";
          await reservation.save();
          console.log(
            `Reservation ${reservation._id} updated to ${reservation.paymentStatus}`
          );
        }
      } catch (err) {
        console.error("DB update error:", err);
      }
    }
  }

  // 7. Acknowledge receipt
  res.status(200).send("Webhook processed");
};
