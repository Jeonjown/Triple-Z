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
  const signatureHeader = req.headers["paymongo-signature"] as string;
  if (!signatureHeader) {
    console.warn("Missing Paymongo-Signature header");
    res.status(400).send("Missing signature");
    return;
  }

  // Signature is sent as "t=timestamp,v1=signature"
  const signatureParts = signatureHeader.split(",");
  const signatureMap: Record<string, string> = {};
  for (const part of signatureParts) {
    const [key, value] = part.split("=");
    signatureMap[key] = value;
  }

  const timestamp = signatureMap["t"];
  const expectedSignature = signatureMap["v1"];

  if (!timestamp || !expectedSignature) {
    console.warn("Invalid signature format");
    res.status(400).send("Invalid signature");
    return;
  }

  const rawBody = (req as any).rawBody as Buffer; // Must set raw body middleware
  const signedPayload = `${timestamp}.${rawBody.toString()}`;
  const hmac = crypto
    .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  if (hmac !== expectedSignature) {
    console.warn("Signature verification failed");
    res.status(400).send("Invalid signature");
    return;
  }

  const event = req.body.data;
  if (!event || !event.type || !event.attributes || !event.attributes.data) {
    console.warn("Incomplete webhook payload:", req.body);
    res.status(200).send("Webhook received but payload incomplete.");
    return;
  }

  console.log(`Received PayMongo event: ${event.type}`);

  if (event.attributes.type === "link.payment.paid") {
    const linkPaymentData = event.attributes.data;
    const paymentLinkId = linkPaymentData.id;
    const paymentStatus: string | undefined =
      linkPaymentData.attributes?.status;

    if (!paymentLinkId) {
      console.warn("Missing payment link ID");
      res.status(200).send("Link ID missing");
      return;
    }

    if (paymentStatus === "paid") {
      try {
        const reservation = await EventReservation.findOne({
          "paymentData.id": paymentLinkId,
        });

        if (!reservation) {
          console.warn(`Reservation not found for link ID: ${paymentLinkId}`);
          res.status(200).send("Reservation not found");
          return;
        }

        if (reservation.paymentStatus !== "Paid") {
          const paidAmount = (linkPaymentData.attributes?.amount || 0) / 100;

          let finalPaymentStatus: "Not Paid" | "Partially Paid" | "Paid" =
            reservation.paymentStatus;
          if (paidAmount >= reservation.totalPayment) {
            finalPaymentStatus = "Paid";
          } else if (paidAmount > 0) {
            finalPaymentStatus = "Partially Paid";
          }

          reservation.paymentStatus = finalPaymentStatus;
          await reservation.save();
          console.log(
            `Reservation ${reservation._id} updated to ${finalPaymentStatus}`
          );
        } else {
          console.log(`Reservation ${reservation._id} already marked as Paid`);
        }
      } catch (err) {
        console.error("DB update error:", err);
        res.status(200).send("Processing error");
        return;
      }
    } else {
      console.log(`Payment status is not paid: ${paymentStatus}`);
    }
  }

  res.status(200).send("Webhook processed");
};
