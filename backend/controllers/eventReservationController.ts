import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import { EventSettings } from "../models/eventSettingsModel";
import {
  addHours,
  differenceInDays,
  format,
  isBefore,
  parse,
  subHours,
} from "date-fns";
import { createNotification } from "./notificationController";
import { GroupReservation } from "../models/groupReservationModel";
import { createPayment } from "./paymentController";

// createReservation

export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // --- 1. Validate User ID in URL ---
    const { userId } = req.params;
    if (!userId) {
      return next(createError("UserId is required in URL parameters.", 400));
    }
    // Optional: Validate userId format if using Mongoose ObjectId
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //      return next(createError("Invalid UserId format.", 400));
    // }

    // --- 2. Destructure Fields from Request Body ---
    // Define the expected structure for clarity, although runtime checks follow.
    const {
      date, // string "YYYY-MM-DD"
      fullName, // string
      contactNumber, // string
      startTime, // string "h:mm AM/PM" or "hh:mm AM/PM"
      estimatedEventDuration, // number (hours)
      partySize, // number
      eventType, // string
      cart, // Array<{ _id: string, title: string, quantity: number, price: number, totalPrice: number, image: string, size?: string }>
      specialRequest, // string (optional)
      isCorkage, // boolean
      paymentAmountOption, // string ("full" or "partial") - only relevant for online
      paymentMethod, // "cash" | "online payment"
    } = req.body;

    // --- 3. Perform Specific Missing Field Checks ---
    // Check for null, undefined, or empty strings for string fields
    if (!date) return next(createError("Missing required field: date.", 400));
    if (!fullName)
      return next(createError("Missing required field: fullName.", 400));
    if (!contactNumber)
      return next(createError("Missing required field: contactNumber.", 400));
    if (!startTime)
      return next(createError("Missing required field: startTime.", 400));
    if (!eventType)
      return next(createError("Missing required field: eventType.", 400));
    if (!paymentMethod)
      return next(createError("Missing required field: paymentMethod.", 400));

    // Check for undefined or null for potentially number/boolean fields before type checking
    if (estimatedEventDuration === undefined || estimatedEventDuration === null)
      return next(
        createError("Missing required field: estimatedEventDuration.", 400)
      );
    if (partySize === undefined || partySize === null)
      return next(createError("Missing required field: partySize.", 400));
    if (isCorkage === undefined || isCorkage === null)
      return next(createError("Missing required field: isCorkage.", 400));

    // Check for cart being present and an array
    if (!cart || !Array.isArray(cart)) {
      return next(
        createError("Missing required field: cart (must be an array).", 400)
      );
    }
    // Add validation for cart items structure/content
    if (
      !cart.every(
        (
          item: any // Use a more specific type if possible for 'item'
        ) =>
          item &&
          typeof item._id === "string" &&
          typeof item.title === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0 &&
          typeof item.price === "number" &&
          item.price >= 0 &&
          typeof item.totalPrice === "number" &&
          item.totalPrice >= 0 &&
          typeof item.image === "string" // Add more checks if needed (e.g., size is optional string)
      )
    ) {
      console.error("Invalid cart item structure detected:", cart);
      return next(createError("Invalid cart item structure or values.", 400));
    }

    // --- 4. Validate Payment Method and Options ---
    // Validate paymentMethod value
    if (paymentMethod !== "cash" && paymentMethod !== "online payment") {
      return next(createError("Invalid payment method selected.", 400));
    }

    // paymentAmountOption is only required for online payment
    if (paymentMethod === "online payment") {
      if (!paymentAmountOption) {
        return next(
          createError(
            "Missing required field: paymentAmountOption for online payment.",
            400
          )
        );
      }
      // Validate paymentAmountOption value if provided for online
      if (paymentAmountOption !== "full" && paymentAmountOption !== "partial") {
        return next(
          createError(
            "Invalid payment amount option selected for online payment.",
            400
          )
        );
      }
    }
    // Note: If paymentMethod is 'cash', paymentAmountOption is not validated here.

    // --- 5. Perform Type and Value Validation Checks (continued) ---
    if (
      typeof estimatedEventDuration !== "number" ||
      estimatedEventDuration <= 0
    ) {
      return next(
        createError("Estimated event duration must be a positive number.", 400)
      );
    }

    if (typeof partySize !== "number" || partySize <= 0) {
      return next(createError("Party size must be a positive number.", 400));
    }

    // Check for boolean type of isCorkage
    if (typeof isCorkage !== "boolean") {
      return next(
        createError("Invalid value for isCorkage (must be boolean).", 400)
      );
    }

    // --- 6. Fetch Event Settings ONCE ---
    // Fetch settings before date/time validation as minDaysPrior is needed
    const eventSettings = await EventSettings.findOne();
    if (!eventSettings) {
      return next(createError("Event settings not found.", 500)); // Exit if settings are missing
    }

    // Validate fee values after fetching settings (ensure they are numbers before use)
    const eventFee = Number(eventSettings.eventFee);
    const corkageFee = Number(eventSettings.eventCorkageFee);
    if (isNaN(eventFee) || isNaN(corkageFee)) {
      console.error(
        "Event settings fee values are not numbers:",
        eventSettings
      );
      return next(createError("Invalid fee values in event settings.", 500));
    }
    const minDaysPrior = Number(eventSettings.eventMinDaysPrior) || 0; // Default to 0 if setting missing/invalid

    // --- 7. Date and Time Parsing and Validation ---
    let startDate: Date;
    let endTime: string;
    let dateOnly: Date; // Declare dateOnly here

    try {
      // Parse date string - Date constructor is lenient, additional checks recommended
      startDate = new Date(date);
      // Check if date parsing resulted in a valid date
      if (isNaN(startDate.getTime())) {
        return next(createError("Invalid date format provided.", 400));
      }
      // Calculate dateOnly (date part only)
      dateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      // Add minDaysPrior check here using the fetched minDaysPrior and calculated dateOnly
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + minDaysPrior);
      const minDateOnly = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate()
      );
      if (dateOnly < minDateOnly) {
        return next(
          createError(
            `Reservation date must be at least ${minDaysPrior} days in advance.`,
            400
          )
        );
      }

      // Parse time string "h:mm AM/PM" or "hh:mm AM/PM"
      const timeMatch = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!timeMatch) {
        return next(
          createError("Invalid start time format. Use HH:MM AM/PM.", 400)
        );
      }
      let startHour = parseInt(timeMatch[1], 10);
      const startMinute = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();

      // Convert 12-hour to 24-hour format
      if (ampm === "PM" && startHour !== 12) startHour += 12;
      else if (ampm === "AM" && startHour === 12) startHour = 0; // 12 AM is 0 hours (midnight)
      // No need for else if (ampm !== "AM" && ampm !== "PM") check here, regex already validated AM/PM

      // Basic hour and minute range check
      if (
        startHour < 0 ||
        startHour > 23 ||
        startMinute < 0 ||
        startMinute > 59
      ) {
        return next(
          createError("Invalid hour or minute value in start time.", 400)
        );
      }

      // Set hours and minutes on the parsed date
      startDate.setHours(startHour, startMinute, 0, 0);

      // Final check if the resulting start date/time is valid
      if (isNaN(startDate.getTime())) {
        console.error(
          `Date setHours resulted in invalid date: ${date} ${startTime}`
        );
        return next(createError("Failed to set start time on date.", 400));
      }

      // Calculate end time
      // Ensure estimatedEventDuration is treated as hours when adding
      const endDate = addHours(startDate, estimatedEventDuration); // Assuming addHours from date-fns

      // Format endTime from endDate object
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const endAMPM = endHour < 12 || endHour === 24 ? "AM" : "PM";
      const formattedEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
      endTime = `${formattedEndHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")} ${endAMPM}`;
    } catch (parseError: any) {
      console.error("Error processing date or start time:", parseError);
      // Return a generic time/date error if specific parsing failed
      return next(
        createError(
          `Error processing date or start time: ${parseError.message || ""}`,
          400
        )
      );
    }

    // --- 8. User and Existing Reservation Checks ---
    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // Check for an upcoming reservation for this user (from the date provided, date part only)
    // Use dateOnly here - should be defined now after successful parsing
    const existingUnpaid = await EventReservation.findOne({
      userId,
      date: { $gte: dateOnly }, // Use the date part of the selected date for comparison
      paymentStatus: { $ne: "Paid" }, // Check if *not* 'Paid'
    });

    if (existingUnpaid) {
      return next(
        createError(
          "You already have an upcoming reservation that isn’t paid yet. Please complete or cancel it before creating a new one.",
          400
        )
      );
    }

    // --- 9. Calculation ---
    const cartTotal = cart.reduce(
      (sum: number, item: any /* Use a more specific type if possible */) =>
        sum + item.totalPrice,
      0
    );

    // eventFee and corkageFee are already fetched and validated

    const totalReservationPrice =
      cartTotal + eventFee + (isCorkage ? corkageFee : 0);

    // --- 10. Payment Processing ---
    let paymentData: any = null; // Will store gateway response for online
    // Initialize payment status to Not Paid by default
    let paymentStatus: "Not Paid" | "Partially Paid" | "Paid" = "Not Paid";
    let amountToPayGateway = 0; // Amount for the gateway (in cents)
    let balanceDue = totalReservationPrice; // Initial balance due is the total price

    if (paymentMethod === "online payment") {
      let description = `Event Reservation for ${fullName} on ${format(
        // Assuming 'format' is imported
        startDate, // Use the Date object for formatting
        "MMMM dd,yyyy" // Use full year format
      )} from ${startTime} to ${endTime} - User ID: ${userId}`;

      // paymentAmountOption validation is done above, now use the value
      if (paymentAmountOption === "full") {
        amountToPayGateway = totalReservationPrice * 100; // amount in cents
        balanceDue = 0; // If paying full online, balance due is 0 *after* payment clears
      } else if (paymentAmountOption === "partial") {
        amountToPayGateway = eventFee * 100; // Use eventFee (is number)
        description += " (Partial Payment)";
        balanceDue = totalReservationPrice - eventFee; // Balance after partial payment clears
      }
      // Note: paymentStatus is still "Not Paid" here, updated by webhook

      // Add a check for amountToPayGateway being positive for online payments
      if (amountToPayGateway <= 0) {
        console.error(
          `Online payment amount calculated as non-positive: ${amountToPayGateway}`
        );
        return next(
          createError(
            "Payment amount must be positive for online payment.",
            400
          )
        );
      }

      try {
        // Call your payment gateway function (e.g., PayMongo)
        // Ensure createPayment is a function that handles data/req/res as expected or adjust call
        const paymongoResponse = await createPayment(
          {
            body: { amount: amountToPayGateway, currency: "PHP", description },
            // Add any other necessary fields for your createPayment function (e.g., redirect URLs)
          } as Request,
          res
        ); // Pass res if needed by createPayment

        if (
          paymongoResponse &&
          paymongoResponse.attributes &&
          paymongoResponse.attributes.checkout_url
        ) {
          paymentData = paymongoResponse; // Store the full response
          // paymentStatus remains 'Not Paid' here until confirmed by gateway/webhook
          // balanceDue remains calculated above, will be confirmed after payment
        } else {
          console.error(
            "PayMongo create payment link failed or returned unexpected structure:",
            paymongoResponse
          );
          // Return an error if link generation failed, as online payment cannot proceed
          return next(
            createError(
              "Failed to generate payment link for online payment. Please try again.",
              500
            )
          );
        }
      } catch (error: any) {
        console.error("Error calling PayMongo create payment link:", error);
        // Check specific error types if possible
        return next(
          createError(
            `Payment gateway error: ${
              error.message || "Failed to create payment link."
            }`,
            500
          )
        );
      }
    } else if (paymentMethod === "cash") {
      // --- Correct Cash Payment Handling ---
      // Payment status is always 'Not Paid' initially for cash
      paymentStatus = "Not Paid";
      paymentData = null; // No gateway data
      // paymentLink will be null due to paymentData being null
      balanceDue = totalReservationPrice; // Full amount due in cash later
      // paymentAmountOption from frontend is irrelevant here and safely ignored
    }

    // --- 11. Create and Save Reservation ---
    const newReservation = new EventReservation({
      userId,
      fullName,
      contactNumber,
      partySize,
      date: startDate, // Save as Date object
      startTime, // Save as string
      endTime, // Calculated endTime string
      estimatedEventDuration, // Save as number
      eventType, // Save as string
      cart, // Save the cart array
      specialRequest, // Save optional string
      eventFee: eventFee, // Store as number
      corkageFee: isCorkage ? corkageFee : 0, // Store actual corkage applied (number)
      subtotal: cartTotal, // Cart total only (number)
      // FIX: Assign to totalPayment to match schema requirement
      totalPayment: totalReservationPrice, // Store total reservation cost (number)
      paymentStatus, // Use the calculated/set status (will be "Not Paid" for cash initially)
      reservationType: "Event", // Save type
      paymentLink: paymentData?.attributes?.checkout_url || null, // Will be null for cash, link for online (pending)
      paymentData: paymentData, // Will be null for cash, object for online (pending)
      paymentMethod, // Save paymentMethod
      balanceDue: balanceDue, // Save the calculated initial balance due (number)
    });

    await newReservation.save();

    // --- 12. Populate and Send Response ---
    // Populate the saved reservation for the response
    const populatedReservation = await EventReservation.findById(
      newReservation._id
    ).populate("userId", "username email", User); // Assuming User model

    // Adjust status codes and messages based on payment method and success of gateway call
    if (paymentMethod === "online payment" && paymentData) {
      // For online payment, send 200 OK and the payment link/reservation
      res.status(200).json({
        message: "Reservation created successfully! Proceeding to payment.",
        paymentLink: paymentData.attributes.checkout_url, // Explicitly return the link for frontend redirection
        reservation: populatedReservation, // Return the full populated reservation
      });
    } else if (paymentMethod === "cash") {
      // For cash payment, send 201 Created and a cash-specific message
      res.status(201).json({
        message:
          "Reservation created successfully! Payment is due in cash upon arrival.",
        reservation: populatedReservation,
      });
    } else {
      // Fallback response for unexpected scenarios (should ideally be caught by validation)
      console.warn(
        "Reservation saved but payment method was unexpected or link generation failed:",
        paymentMethod
      );
      // Decide appropriate status, maybe 500 if link was mandatory for online
      res.status(paymentMethod === "online payment" ? 500 : 201).json({
        message:
          paymentMethod === "online payment"
            ? "Reservation created but failed to get payment link."
            : "Reservation created successfully! Please check details.",
        reservation: populatedReservation,
      });
    }
  } catch (error: any) {
    console.error("Reservation creation top-level error:", error); // Log the full error details

    // --- 13. Specific Error Handling ---
    // Check for errors specifically thrown with specific messages
    if (error.message && typeof error.message === "string") {
      // Include checks for messages intentionally thrown earlier
      if (error.message.includes("UserId is required"))
        return next(createError(error.message, 400));
      if (error.message.includes("Missing required field:"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid payment method selected"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid payment amount option selected"))
        return next(createError(error.message, 400));
      if (error.message.includes("Estimated event duration must be"))
        return next(createError(error.message, 400));
      if (error.message.includes("Party size must be"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid value for isCorkage"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid cart item structure"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid date"))
        return next(createError(error.message, 400));
      if (error.message.includes("Invalid start time"))
        return next(createError(error.message, 400));
      if (error.message.includes("Error processing date or start time"))
        return next(createError(error.message, 400));
      if (error.message.includes("Reservation date must be at least"))
        return next(createError(error.message, 400));
      if (error.message.includes("User not found"))
        return next(createError(error.message, 404));
      if (error.message.includes("already have an upcoming reservation"))
        return next(createError(error.message, 400));
      if (error.message.includes("Event settings not found"))
        return next(createError(error.message, 500));
      if (error.message.includes("Invalid fee values in event settings"))
        return next(createError(error.message, 500));
      if (error.message.includes("Payment amount must be positive"))
        return next(createError(error.message, 400));
      if (
        error.message.includes(
          "Failed to generate payment link for online payment"
        )
      )
        return next(createError(error.message, 500)); // Error from PayMongo call
      if (error.message.includes("Payment gateway error"))
        return next(createError(error.message, 500)); // Error calling PayMongo

      // If the frontend sends "Only 2 reservations are allowed" in the error message (less likely backend throws this string)
      if (error.message.includes("Only 2 reservations are allowed")) {
        return next(createError(error.message, 400));
      }
      // Mongoose Validation Errors (other than duplicate key)
      if (error.name === "ValidationError") {
        console.error(
          "Mongoose Validation Error:",
          error.message,
          error.errors
        );
        // Extract validation errors and return
        const errors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return next(
          createError(`Validation failed: ${errors.join(", ")}`, 400)
        );
      }
    }

    // --- 14. Mongoose Duplicate Key Error ---
    if (error.code === 11000) {
      // Attempt to extract the specific field from the duplicate key error message
      const field = error.message.match(/index: (.+?)_/)?.[1] || "field"; // Regex to find field name from index name in error message
      const value = error.keyValue
        ? Object.values(error.keyValue)[0]
        : "unknown"; // Get the value from keyValue object
      console.error(
        `Duplicate key error details: field=${field}, value=${value}`,
        error
      );
      return next(
        createError(
          `Duplicate entry: A reservation with this ${field} (${value}) already exists.`,
          400
        )
      );
    }

    // --- 15. Generic/Unhandled Error ---
    // For any other unexpected errors not specifically caught above
    console.error("Unhandled reservation creation error:", error);
    next(
      createError(
        `Failed to create reservation: ${
          error.message || "An unexpected error occurred."
        }`,
        500
      )
    );
  }
};

// Controller to get all reservations with auto‑update and notifications
export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();

    // --- Process Confirmed Reservations (Auto-Complete) ---
    // Conditions: date is past, eventStatus is "Confirmed", and paymentStatus is "Paid".
    const confirmedReservations = await EventReservation.find({
      date: { $lt: now },
      eventStatus: "Confirmed",
      paymentStatus: "Paid",
    });
    if (confirmedReservations.length > 0) {
      const confirmedIds = confirmedReservations.map((r) => r._id);
      await EventReservation.updateMany(
        { _id: { $in: confirmedIds } },
        { eventStatus: "Completed" }
      );
      console.log(
        `Auto-updated ${confirmedReservations.length} confirmed reservations to Completed.`
      );
      for (const reservation of confirmedReservations) {
        const fakeReq = {
          body: {
            title: "Reservation Completed",
            description: `Your reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been automatically marked as Completed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({
            json: () => {},
          }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // --- Process Pending Reservations (Auto-Cancel) ---
    // Conditions: date is past, eventStatus is "Pending", and paymentStatus is NOT "Paid" nor "Partially Paid".
    const pendingReservations = await EventReservation.find({
      date: { $lt: now },
      eventStatus: "Pending",
      paymentStatus: { $nin: ["Paid", "Partially Paid"] },
    });
    if (pendingReservations.length > 0) {
      const pendingIds = pendingReservations.map((r) => r._id);
      await EventReservation.updateMany(
        { _id: { $in: pendingIds } },
        { eventStatus: "Cancelled" }
      );
      console.log(
        `Auto-updated ${pendingReservations.length} pending reservations to Cancelled.`
      );
      for (const reservation of pendingReservations) {
        const fakeReq = {
          body: {
            title: "Reservation Cancelled",
            description: `Your reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been automatically cancelled as it was not confirmed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({
            json: () => {},
          }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // Fetch all reservations after auto-updates
    const reservations = await EventReservation.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email", User);

    res.status(200).json({
      message: "Reservations fetched successfully!",
      reservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch reservations.", 500));
  }
};
// Update a reservation's status (confirming, canceling, or completing)
export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventStatus, reservationId } = req.body;

    if (
      !["Pending", "Confirmed", "Completed", "Cancelled"].includes(eventStatus)
    ) {
      return next(
        createError(
          "Invalid status. Valid statuses are: Pending, Confirmed, Completed, or Cancelled.",
          400
        )
      );
    }

    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { eventStatus },
      { new: true }
    );

    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation status updated successfully!",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to update reservation status.", 500));
  }
};

// Update payment status
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentStatus, reservationId } = req.body;

    if (!["Not Paid", "Partially Paid", "Paid"].includes(paymentStatus)) {
      return next(
        createError(
          "Invalid payment status. Valid statuses are: Not Paid, Partially Paid, or Paid.",
          400
        )
      );
    }

    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { paymentStatus },
      { new: true }
    );
    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation payment status updated successfully!",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to update reservation payment status.", 500));
  }
};

// Delete a reservation
export const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.body;

    const deletedReservation = await EventReservation.findByIdAndDelete(
      reservationId
    );

    if (!deletedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation deleted successfully!",
      reservation: deletedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to delete reservation.", 500));
  }
};

// Admin controller to update a user reservation (notification removed)
export const adminRescheduleEventReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reservationId, ...updateData } = req.body;
    if (!reservationId) {
      return next(
        createError("ReservationId is required in the request body.", 400)
      );
    }

    // Step 1: Fetch the current reservation for comparison.
    const currentReservation = await EventReservation.findById(reservationId);
    if (!currentReservation) {
      return next(createError("Reservation not found.", 404));
    }

    // Step 2: Filter only the scheduling-related fields for rescheduling.
    const allowedUpdates = ["date", "startTime", "endTime"];
    const filteredUpdates = Object.keys(updateData).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Step 3: Update the reservation.
    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { $set: filteredUpdates },
      { new: true }
    );
    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    // Step 4: Determine what scheduling fields have changed.
    let changes: string[] = [];
    Object.keys(filteredUpdates).forEach((key) => {
      // Cast currentReservation to any for dynamic property access.
      const oldValue = String((currentReservation as any)[key]);
      const newValue = String(filteredUpdates[key]);
      if (oldValue !== newValue) {
        changes.push(`${key} changed from "${oldValue}" to "${newValue}"`);
      }
    });

    const changesDescription = changes.length
      ? `The following changes were made: ${changes.join(", ")}.`
      : "No changes were detected.";
    console.log(changesDescription);

    // Step 5: Populate the reservation with user details and return it.
    const populatedReservation = await EventReservation.findById(
      updatedReservation._id
    ).populate("userId", "username email", User);

    res.status(200).json({
      message: "Reservation rescheduled successfully!",
      reservation: populatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to reschedule reservation.", 500));
  }
};

export const getAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch individual event reservations.
    const eventReservations = await EventReservation.find().populate(
      "userId",
      "username email",
      User
    );

    // Fetch group reservations.
    const groupReservations = await GroupReservation.find().populate(
      "userId",
      "username email",
      User
    );

    // Merge both arrays.
    const allReservations = [...eventReservations, ...groupReservations];

    // Sort by the 'createdAt' field in descending order (most recent first).
    allReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({
      message: "Reservations fetched successfully!",
      reservations: allReservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch reservations.", 500));
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reservationId } = req.body;
    // Fetch the reservation (it can be Event or Group based on your implementation)
    let reservation = await EventReservation.findById(reservationId);
    let reservationType = "Event";
    if (!reservation) {
      reservation = await GroupReservation.findById(reservationId);
      reservationType = "Groups";
    }
    if (!reservation) {
      return next(createError("Reservation not found.", 404));
    }

    const now = new Date();
    const reservationDate = new Date(reservation.date);

    // Apply cancellation rules based on reservation type.
    if (reservationType === "Event") {
      // Check if the difference is at least 7 days.
      const daysDifference = differenceInDays(reservationDate, now);
      if (daysDifference < 7) {
        return next(
          createError(
            "Event reservations must be cancelled at least 1 week in advance.",
            400
          )
        );
      }
    } else if (reservationType === "Groups") {
      // For Groups, cancellation is allowed only if it's at least 3 hours before the openingHours.
      const eventSettings = await EventSettings.findOne();
      if (!eventSettings) {
        return next(createError("Event settings not found", 500));
      }
      // Parse openingHours (e.g., "4:00 PM") into a Date object based on the reservationDate.
      const openingTime = parse(
        eventSettings.openingHours,
        "h:mm a",
        reservationDate
      );
      // Calculate cutoff: 3 hours before openingTime.
      const cutoffTime = subHours(openingTime, 3);
      if (!isBefore(now, cutoffTime)) {
        return next(
          createError(
            "Group reservations can only be cancelled at least 3 hours before opening time.",
            400
          )
        );
      }
    }

    // If rules pass, update the reservation status to "Cancelled".
    reservation.eventStatus = "Cancelled";
    await reservation.save();

    res.status(200).json({
      message: "Reservation cancelled successfully!",
      reservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to cancel reservation.", 500));
  }
};

export const getAllReservationsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(createError("User ID is required in the URL.", 400));
    }

    // Fetch individual event reservations for the specific user.
    const eventReservations = await EventReservation.find({ userId }).populate(
      "userId",
      "username email",
      User
    );

    // Fetch group reservations for the specific user.
    const groupReservations = await GroupReservation.find({ userId }).populate(
      "userId",
      "username email",
      User
    );

    // Merge both arrays.
    const allReservations = [...eventReservations, ...groupReservations];

    // Sort by the 'createdAt' field in descending order (most recent first).
    allReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({
      message: "User reservations fetched successfully!",
      reservations: allReservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch user reservations.", 500));
  }
};
