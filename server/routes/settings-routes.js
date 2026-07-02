import { Router } from "express";
import { checkAuthenticated } from "../middleware/auth-helper.js";
import settingsController from "../controllers/settings-controller.js";

const settingsRouter = Router();

settingsRouter.patch("/", settingsController.updateSettings);

settingsRouter.get("/", settingsController.getSettings);

export { settingsRouter };
