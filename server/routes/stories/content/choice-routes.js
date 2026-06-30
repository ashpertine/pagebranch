import choiceController from "../../../controllers/stories/content/choice-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { Router } from "express";

const choiceRouter = Router();

choiceRouter.post(
  "/:storyId/choice/new",
  checkAuthenticated,
  choiceController.postNewChoice,
);

choiceRouter.patch(
  "/:storyId/choice/:choiceId/update",
  checkAuthenticated,
  choiceController.updateChoice,
);

choiceRouter.patch(
  "/:storyId/choice/:choiceId/update-sort",
  checkAuthenticated,
  choiceController.updateChoiceSortOrder,
);

choiceRouter.delete(
  "/:storyId/choice/:choiceId/delete",
  checkAuthenticated,
  choiceController.deleteChoice,
);

export { choiceRouter };
