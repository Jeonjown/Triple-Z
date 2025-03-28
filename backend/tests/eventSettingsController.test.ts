// eventSettingsController.test.ts
import { Request, Response } from "express";
import {
  createOrUpdateEventSettings,
  getEventSettings,
  deleteEventSettings,
} from "../controllers/eventSettingsController";
import { EventSettings } from "../models/eventSettingsModel";

jest.mock("../models/eventSettingsModel");

describe("Event Settings Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createOrUpdateEventSettings", () => {
    it("should update event settings and return status 200", async () => {
      req.body = { settingKey: "value" };
      (EventSettings.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: "id",
        settingKey: "value",
      });
      await createOrUpdateEventSettings(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "id", settingKey: "value" },
      });
    });
  });

  describe("getEventSettings", () => {
    it("should return 404 if no settings found", async () => {
      (EventSettings.findOne as jest.Mock).mockResolvedValue(null);
      await getEventSettings(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteEventSettings", () => {
    it("should return 404 if settings to delete are not found", async () => {
      (EventSettings.findOneAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteEventSettings(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
