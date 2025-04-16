// src/controllers/webhookController.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { EventReservation } from "../models/eventReservationModel";

// Optional: Add your webhook secret from env (if verifying signature)
// const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET || "your-secret";

export const handlePaymongoWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Optional: Verify signature here before processing the payload
  // For example:
  // const signature = req.headers["paymongo-signature"] as string;
  // const rawBody = req.body; // Remember: this is a Buffer
  // ... verify using crypto ...

  const event = req.body.data; // Assumes payload includes { data: { ... } }

  // Basic validation of event structure.
  if (!event || !event.type || !event.attributes || !event.attributes.data) {
    console.warn("Incomplete webhook payload:", req.body);
    res.status(200).send("Webhook received but payload incomplete.");
    return;
  }

  console.log(`Received PayMongo event: ${event.type}`);

  // Process only "link.payment.paid" events.
  if (event.attributes.type === "link.payment.paid") {
    const linkPaymentData = event.attributes.data;
    const paymentLinkId = linkPaymentData.id;
    const paymentStatus: string | undefined =
      linkPaymentData.attributes?.status;

    if (!paymentLinkId) {
      console.warn("Missing payment link ID in event data:", linkPaymentData);
      res.status(200).send("Webhook received but link ID missing.");
      return;
    }

    console.log(
      `Processing payment for link ID: ${paymentLinkId}, Status: ${paymentStatus}`
    );

    if (paymentStatus === "paid") {
      try {
        // Adjust the field name based on your schema.
        const reservation = await EventReservation.findOne({
          "paymentData.id": paymentLinkId,
        });
        if (!reservation) {
          console.warn(`Reservation not found for link ID: ${paymentLinkId}`);
          res.status(200).send("Webhook acknowledged, reservation not found.");
          return;
        }

        // Only update if not already marked as Paid.
        if (reservation.paymentStatus !== "Paid") {
          const paidAmount: number =
            (linkPaymentData.attributes?.amount || 0) / 100; // Converting cents to currency

          // Determine new status based on business logic
          let finalPaymentStatus: "Not Paid" | "Partially Paid" | "Paid" =
            reservation.paymentStatus;

          if (paidAmount >= reservation.totalPayment) {
            finalPaymentStatus = "Paid";
          } else if (paidAmount > 0) {
            finalPaymentStatus = "Partially Paid"; // Any positive amount less than total
          } else {
            console.warn(
              `Zero or invalid amount (${paidAmount}) for link ${paymentLinkId}`
            );
          }

          reservation.paymentStatus = finalPaymentStatus;
          await reservation.save();
          console.log(
            `Reservation ${reservation._id} updated to ${finalPaymentStatus}.`
          );
        } else {
          console.log(
            `Reservation ${reservation._id} already marked as Paid. Skipping update.`
          );
        }
      } catch (dbError) {
        console.error(
          `Error updating reservation for link ${paymentLinkId}:`,
          dbError
        );
        res
          .status(200)
          .send("Webhook acknowledged, internal processing error.");
        return;
      }
    } else {
      console.log(
        `Non-paid status (${paymentStatus}) for link ${paymentLinkId}. No action taken.`
      );
    }
  } else {
    console.log(`Unhandled event type: ${event.attributes.type}`);
  }

  res.status(200).send("Webhook received successfully.");
};
