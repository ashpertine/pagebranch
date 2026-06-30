import passageController from "../../../controllers/stories/content/passage-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { Router } from "express";

const passageRouter = Router();

passageRouter.patch(
  "/:storyId/update-start",
  checkAuthenticated,
  passageController.updateStartPassage,
);

passageRouter.get(
  "/:storyId/get-start",
  checkAuthenticated,
  passageController.getStartPassage,
);

passageRouter.post(
  "/:storyId/passage/new",
  checkAuthenticated,
  passageController.postNewPassage,
);

passageRouter.patch(
  "/:storyId/passage/update",
  checkAuthenticated,
  passageController.updatePassages,
);

passageRouter.delete(
  "/:storyId/passage/:passageId/delete",
  checkAuthenticated,
  passageController.deletePassage,
);

export { passageRouter };
