import storiesController from "../controllers/storiesController.js";
import { checkAuthenticated } from "../middleware/authHelper.js";
import { Router } from "express";

const storiesRouter = Router();

storiesRouter.get(
  "/stories",
  checkAuthenticated,
  storiesController.getUserStories,
);

storiesRouter.post(
  "/stories/new",
  checkAuthenticated,
  storiesController.postNewStory,
);

storiesRouter.put(
  "/stories/:storyId/update",
  checkAuthenticated,
  storiesController.updateStory,
);

storiesRouter.delete(
  "/stories/:storyId/delete",
  checkAuthenticated,
  storiesController.deleteStory,
);

export { storiesRouter };
