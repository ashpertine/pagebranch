import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth-controller.js";
import { registerValidation } from "../middleware/auth-helper.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerValidation,
  authController.registerNewUserPost,
);

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/loginStatus",
    failureRedirect: "/api/loginStatus",
    failureMessage: true,
  }),
);

authRouter.post("/logOut", authController.logOutPost);

authRouter.get("/loginStatus", authController.getLoginStatus);

export { authRouter };
