import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.post("/register", authController.registerNewUserPost);

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/loginStatus",
    failureRedirect: "/api/loginStatus",
    failureMessage: true,
  }),
);

authRouter.get("/loginStatus", authController.getLoginStatus);

export { authRouter };
