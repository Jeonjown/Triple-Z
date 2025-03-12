import { Request, Response } from "express";
import { EventSettings } from "../models/eventSettingsModel";

/**
 * Create or Update Event Settings (Ensures only one document exists)
 */
export const createOrUpdateEventSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventSettings = await EventSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: eventSettings });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Event Settings
 */
export const getEventSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventSettings = await EventSettings.findOne();
    if (!eventSettings) {
      res
        .status(404)
        .json({ success: false, message: "Event settings not found" });
      return;
    }
    res.status(200).json({ success: true, data: eventSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Event Settings
 */
export const deleteEventSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventSettings = await EventSettings.findOneAndDelete();
    if (!eventSettings) {
      res
        .status(404)
        .json({ success: false, message: "Event settings not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Event settings deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
