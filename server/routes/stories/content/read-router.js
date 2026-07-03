import readController from "../../../controllers/stories/content/read-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { Router } from "express";

const readRouter = Router();

readRouter.get("/:userId/:shareSlug", readController.getReadStoryContent);
export { readRouter };
