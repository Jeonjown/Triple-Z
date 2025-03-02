import { Request, Response } from "express";
import { Message } from "../../models/messageModel";
import User from "../../models/userModel";
import mongoose from "mongoose";

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
      { $match: { sender: "user" } }, // Only consider user messages
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          latestMessage: { $first: "$$ROOT" },
        },
      },
      { $sort: { "latestMessage.createdAt": -1 } },
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

export interface SocketMessage {
  text: string;
  sender: "user" | "admin";
  roomId: string;
  userId: string;
}

export const saveUserMessage = async (messageData: SocketMessage) => {
  let username: string;
  let email: string;

  // Validate userId and fetch user details if available
  if (mongoose.Types.ObjectId.isValid(messageData.userId)) {
    const user = await User.findById(messageData.userId);
    if (user) {
      username = user.username;
      email = user.email;
    } else {
      username = "Guest";
      email = "No email";
    }
  } else {
    username = "Guest";
    email = "No email";
  }

  // Create and return the saved message
  return await Message.create({
    text: messageData.text,
    sender: messageData.sender,
    roomId: messageData.roomId,
    userId: messageData.userId,
    username,
    email,
  });
};

/**
 * Save an admin message.
 */
export const saveAdminMessage = async (messageData: SocketMessage) => {
  try {
    const [adminUser, originalUser] = await Promise.all([
      User.findById(messageData.userId),
      Message.findOne({ roomId: messageData.roomId, sender: "user" })
        .sort({ createdAt: 1 })
        .select("username userId"),
    ]);

    return await Message.create({
      text: messageData.text,
      sender: messageData.sender,
      roomId: messageData.roomId,
      userId: originalUser?.userId || messageData.userId,
      username: originalUser?.username || "User",
      adminUsername: adminUser?.username || "Admin",
    });
  } catch (error) {
    console.error("Error saving admin message:", error);
    throw error;
  }
};
