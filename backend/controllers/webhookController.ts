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
  console.log("Received Paymongo-Signature header:", signatureHeader);

  if (!signatureHeader) {
    console.warn("Missing Paymongo-Signature header");
    res.status(400).send("Missing signature");
    return;
  }

  const signatureParts = signatureHeader.split(",");
  const signatureMap: Record<string, string> = {};
  for (const part of signatureParts) {
    const [key, value] = part.split("=");
    if (key && value) {
      signatureMap[key.trim()] = value.trim();
    } else if (part.trim() !== "") {
      console.warn("Invalid part in signature header:", part);
    }
  }

  const timestamp = signatureMap["t"];
  const expectedSignature = signatureMap["te"];

  if (!timestamp || !expectedSignature) {
    console.warn(
      'Invalid signature format - missing "t" or "te"',
      signatureMap
    );
    res.status(400).send("Invalid signature");
    return;
  }

  const rawBody = req.body as Buffer;
  if (!rawBody) {
    console.warn("Missing raw body for signature verification");
    res.status(400).send("Missing raw body");
    return;
  }

  const signedPayload = `${timestamp}.${rawBody.toString()}`;
  const hmac = crypto
    .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  if (hmac !== expectedSignature) {
    console.warn("Signature verification failed", { hmac, expectedSignature });
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
