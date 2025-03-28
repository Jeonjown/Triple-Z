import { Request, Response, NextFunction } from "express";

import Subscription from "../models/subscriptionModel";
import { createError } from "../utils/createError";
import admin from "../utils/firebase";
import {
  registerFcmToken,
  removeFcmToken,
} from "../controllers/subscriptionController";

jest.mock("../models/subscriptionModel");
jest.mock("../utils/createError");
jest.mock("../utils/firebase");

describe("FCM Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("registerFcmToken", () => {
    it("should return error if token missing", async () => {
      req.body = { user: { role: "user", _id: "user1" } };
      await registerFcmToken(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
    it("should register token successfully", async () => {
      req.body = { token: "token123", user: { role: "user", _id: "user1" } };
      (Subscription.findOne as jest.Mock).mockResolvedValue(null);
      (Subscription.create as jest.Mock).mockResolvedValue({
        _id: "sub1",
        tokens: [{ token: "token123" }],
      });
      await registerFcmToken(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Token registered successfully" })
      );
    });
  });

  describe("removeFcmToken", () => {
    it("should return error if token missing", async () => {
      req.body = {};
      await removeFcmToken(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
    it("should remove token successfully", async () => {
      req.body = { token: "token123" };
      (Subscription.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: "sub1",
      });
      await removeFcmToken(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "FCM token removed successfully.",
      });
    });
    it("should return 404 if token not found", async () => {
      req.body = { token: "token123" };
      (Subscription.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      await removeFcmToken(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Token not found." });
    });
  });
});
