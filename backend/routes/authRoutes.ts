import { NextFunction, Router, Response, Request } from "express";
import passport from "passport";

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
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirectUri = req.query.redirect_uri as string; // Get redirect URI
  req.query.redirect_uri = redirectUri;
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: redirectUri, // ✅ Save redirectUri in state
  })(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const { token }: any = req.user;

    if (token) {
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 259200000,
      });
    } // ✅ Close the if block properly

    const redirectUri = req.query.state as string; // ✅ This is now correctly outside `if (token)`

    // ✅ Redirect only  if it was the intended destination
    if (
      redirectUri?.includes("/order-checkout") ||
      redirectUri?.includes("/schedule")
    ) {
      res.redirect(redirectUri);
    } else {
      res.redirect(process.env.FRONTEND_URL || "/");
    }
  }
);

export default router;
