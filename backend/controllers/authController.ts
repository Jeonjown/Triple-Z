import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/userModel";

//JWT AUTH
export const jwtSignup = async (req: Request, res: Response) => {
  try {
    console.log("from backend", req.body);
    const { name, email, password } = req.body;

    res.json({ message: `received: ${name} ${email} ${password}` });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
