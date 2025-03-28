// tests/groupReservationController.test.ts
import { Request, Response, NextFunction } from "express";
import {
  createGroupReservation,
  getGroupReservations,
  updateGroupReservationStatus,
  updateGroupPaymentStatus,
  deleteGroupReservation,
} from "../controllers/groupReservationController";
import { GroupReservation } from "../models/groupReservationModel";
import { createError } from "../utils/createError";

// Mock dependencies
jest.mock("../models/groupReservationModel");
jest.mock("../models/userModel");
jest.mock("../utils/createError");

// Increase timeout if tests take longer
jest.setTimeout(10000);

describe("Group Reservation Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getGroupReservations", () => {
    it("should fetch group reservations and return status 200", async () => {
      // Fix chained mock: ensure find() returns an object with sort() and populate()
      (GroupReservation.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([]), // You can replace [] with fake data if needed.
        }),
      });
      await getGroupReservations(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("createGroupReservation", () => {
    it("should return error if userId is missing", async () => {
      req.params = {}; // Missing userId
      await createGroupReservation(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
    // Additional tests for successful creation can be added here by simulating GroupReservation.save() etc.
  });

  describe("updateGroupReservationStatus", () => {
    it("should return error for invalid eventStatus", async () => {
      req.body = { eventStatus: "Invalid", reservationId: "id1" };
      await updateGroupReservationStatus(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("updateGroupPaymentStatus", () => {
    it("should return error for invalid payment status", async () => {
      req.body = { paymentStatus: "Invalid", reservationId: "id1" };
      await updateGroupPaymentStatus(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("deleteGroupReservation", () => {
    it("should return error if reservation not found", async () => {
      req.body = { reservationId: "nonexistent" };
      (GroupReservation.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteGroupReservation(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
