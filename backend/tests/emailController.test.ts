// tests/emailController.test.ts
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { sendEmail } from "../controllers/emailController";

jest.mock("nodemailer");

describe("sendEmail", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should send an email successfully", () => {
    req.body = {
      fullName: "John Doe",
      contacts: "123456",
      email: "john@example.com",
      message: "Hello!",
    };
    const sendMailMock = jest.fn((options, callback) => {
      callback(null, { response: "OK" });
    });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
    sendEmail(req as Request, res as Response);
    expect(sendMailMock).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith("Email sent successfully!");
  });

  it("should handle error when sending email fails", () => {
    req.body = {
      fullName: "John Doe",
      contacts: "123456",
      email: "john@example.com",
      message: "Hello!",
    };
    const error = new Error("Failed to send");
    const sendMailMock = jest.fn((options, callback) => {
      callback(error, null);
    });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
    sendEmail(req as Request, res as Response);
    expect(sendMailMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error sending email.");
  });
});
