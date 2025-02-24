import { Request, Response } from "express";
import { Message } from "../models/messageModel";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getRoomsWithLatestMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const results = await Message.aggregate([
      // Step 1: Sort messages by newest createdAt
      { $sort: { createdAt: -1 } },
      // Step 2: Group by roomId, capturing the entire newest message document
      {
        $group: {
          _id: "$roomId",
          latestMessage: { $first: "$$ROOT" },
        },
      },
      // Step 3: Sort the groups by the createdAt of the latest message
      { $sort: { "latestMessage.createdAt": -1 } },
      // Step 4: Project the output to include roomId and latestMessage info
      {
        $project: {
          roomId: "$_id",
          latestMessage: 1,
          _id: 0,
        },
      },
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room info" });
  }
};
