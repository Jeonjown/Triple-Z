import axios from "axios";
import { Request, Response } from "express";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, description } = req.body;
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    const base64SecretKey = Buffer.from(secretKey + ":").toString("base64");

    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      {
        data: {
          attributes: {
            amount: Number(amount),
            currency,
            description,
            redirect: {
              success: "https://yourwebsite.com/success",
              failed: "https://yourwebsite.com/failed",
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64SecretKey}`,
        },
      }
    );

    // Return the created payment link data
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error creating PayMongo link using Axios:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error:
        error.response?.data?.error?.message || "Failed to create payment link",
      details: error.response?.data?.error?.details,
    });
    return null; // Or throw the error if you prefer
  }
};
