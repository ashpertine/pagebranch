import storyController from "../../controllers/stories/story-controller.js";
import { checkAuthenticated } from "../../middleware/auth-helper.js";
import { Router } from "express";

const storyRouter = Router();

storyRouter.get("/", checkAuthenticated, storyController.getUserStories);

storyRouter.post("/new", checkAuthenticated, storyController.postNewStory);

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

export { storyRouter };
