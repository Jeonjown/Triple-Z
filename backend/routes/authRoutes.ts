import { NextFunction, Router } from "express";
import passport from "passport";
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
import { createError } from "../utils/createError";

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
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(
    req,
    res,
    next
  );
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const { token }: any = req.user;

    if (token) {
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        domain:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : ".ondigitalocean.app",
        maxAge: 259200000,
      });

      res.redirect(`${process.env.FRONTEND_URL}`);
    } else {
      createError("Failed to retrieve token", 400);
    }
  }
);

export default router;
