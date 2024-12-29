import { Router } from "express";
import { jwtSignup } from "../controllers/authController";

const router = Router();

//JWT
router.post("/jwtSignup", jwtSignup);

//GOOGLE AUTH

export default router;
