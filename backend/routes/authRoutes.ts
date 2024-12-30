import { Router } from "express";
import { jwtSignup } from "../controllers/authController";
import { validateUsername } from "../middleware/validateUsername";
import { validateEmail } from "../middleware/validateEmail";
import { validatePassword } from "../middleware/validatePassword";

const router = Router();

//JWT
router.post(
  "/jwtSignup",
  validateUsername,
  validateEmail,
  validatePassword,
  jwtSignup
);

//GOOGLE AUTH

export default router;
