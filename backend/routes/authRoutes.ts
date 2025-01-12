import { Router } from "express";
import { Response, Request } from "express";
import {
  checkAuth,
  jwtLogin,
  jwtSignup,
  logoutUser,
} from "../controllers/authController";
import { validateUsername } from "../middleware/validateUsername";
import { validateEmail } from "../middleware/validateEmail";
import { validatePassword } from "../middleware/validatePassword";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/logout", logoutUser);

router.get("/check-auth", verifyToken, checkAuth);
//JWT
router.post(
  "/jwt-signup",
  validateUsername,
  validateEmail,
  validatePassword,
  jwtSignup
);
router.post("/jwt-login", validateEmail, validatePassword, jwtLogin);

//GOOGLE AUTH

export default router;
