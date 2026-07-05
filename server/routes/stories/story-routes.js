import storyController from "../../controllers/stories/story-controller.js";
import { checkAuthenticated } from "../../middleware/auth-helper.js";
import { Router } from "express";
import { newStoryValidation } from "../../middleware/validation-helper.js";

const storyRouter = Router();

storyRouter.get("/", checkAuthenticated, storyController.getUserStories);

storyRouter.post(
  "/new",
  checkAuthenticated,
  newStoryValidation,
  storyController.postNewStory,
);

storyRouter.patch(
  "/:storyId/update",
  checkAuthenticated,
  storyController.updateStory,
);

storyRouter.delete(
  "/:storyId/delete",
  checkAuthenticated,
  storyController.deleteStory,
);

storyRouter.get(
  "/:storyId",
  checkAuthenticated,
  storyController.getStoryContent,
);

storyRouter.get(
  "/info/:storyId",
  checkAuthenticated,
  storyController.getUserStoryById,
);

storyRouter.patch(
  "/:storyId/pin",
  checkAuthenticated,
  storyController.updateStoryPin,
);

storyRouter.patch(
  "/:storyId/privacy",
  checkAuthenticated,
  storyController.toggleStoryPrivacy,
);

export { storyRouter };
