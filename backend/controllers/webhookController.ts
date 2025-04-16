// src/controllers/webhookController.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { EventReservation } from "../models/eventReservationModel";
import { createError, ResponseError } from "../utils/createError";

const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET!;

export const handlePaymongoWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract signature header
    const sigHeader = req.headers["paymongo-signature"] as string;
    if (!sigHeader) {
      throw createError("Missing Paymongo-Signature header", 400);
    }

    // 2. Split into t, te, li
    const sigMap: Record<string, string> = {};
    sigHeader.split(",").forEach((part) => {
      const [k, v] = part.split("=").map((s) => s.trim());
      if (k && v) sigMap[k] = v;
    });

    const timestamp = sigMap["t"];
    const expectedSig = sigMap["te"]; // test mode; switch to "li" for live
    if (!timestamp || !expectedSig) {
      throw createError("Invalid signature format", 400);
    }

    // 3. Compute HMAC-SHA256
    const rawBody = req.body as Buffer;
    const signedPayload = `${timestamp}.${rawBody.toString()}`;
    const hmac = crypto
      .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    if (hmac !== expectedSig) {
      throw createError("Invalid signature", 400);
    }

    // 4. Parse JSON payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString());
    } catch (err) {
      throw createError("Invalid JSON payload", 400);
    }

    // 5. Validate event structure
    const resourceType = payload.data?.type;
    const webhookEvent = payload.data?.attributes?.type;
    const eventData = payload.data?.attributes?.data;

    if (!resourceType || !webhookEvent || !eventData) {
      // A 2xx tells PayMongo you received it, even if incomplete
      res.status(200).send("Payload incomplete");
      return;
    }

    console.log(`Received PayMongo webhook: ${webhookEvent}`);

    // 6. Handle link.payment.paid
    if (webhookEvent === "link.payment.paid") {
      const linkId = eventData.id;
      const status = eventData.attributes?.status;
      if (status === "paid" && linkId) {
        const reservation = await EventReservation.findOne({
          "paymentData.id": linkId,
        });
        if (reservation && reservation.paymentStatus !== "Paid") {
          const paidAmt = (eventData.attributes.amount || 0) / 100;
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
      }
    }

    // 7. Acknowledge receipt
    res.status(200).send("Webhook processed");
  } catch (err) {
    // Pass errors to your error handler
    next(err as ResponseError);
  }
};
