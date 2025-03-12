import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendEmail = (req: Request, res: Response): void => {
  const { fullName, contacts, email, message } = req.body;

  // Create a transporter using basic authentication.
  // For basic auth, the "pass" field is necessary.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.BUSINESS_EMAIL,
      pass: process.env.BUSINESS_EMAIL_PASS,
    },
    logger: true, // Enable logging
    debug: true, // Include SMTP traffic in the logs
  });

  const mailOptions = {
    from: email, // sender's email from the form
    to: process.env.BUSINESS_EMAIL, // business email where you want to receive messages
    subject: "New Contact Form Submission",
    text: `Full Name: ${fullName}\nContacts: ${contacts}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email.");
    } else {
      res.send("Email sent successfully!");
    }
  });
};
