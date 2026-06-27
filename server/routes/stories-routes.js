import storiesController from "../controllers/stories-controller.js";
import storyContentController from "../controllers/story-content-controller.js";
import { checkAuthenticated } from "../middleware/auth-helper.js";
import { Router } from "express";

const storiesRouter = Router();

/*
 * STORIES
 */

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

storiesRouter.patch(
  "/stories/:storyId/update",
  checkAuthenticated,
  storiesController.updateStory,
);

storiesRouter.delete(
  "/stories/:storyId/delete",
  checkAuthenticated,
  storiesController.deleteStory,
);

/*
 * STORY CONTENT
 */

storiesRouter.patch(
  "/stories/:storyId/update-start/",
  checkAuthenticated,
  storyContentController.updateStartPassage,
);

storiesRouter.get(
  "/stories/:storyId/get-start/",
  checkAuthenticated,
  storyContentController.getStartPassage,
);

storiesRouter.get(
  "/stories/:storyId",
  checkAuthenticated,
  storyContentController.getStoryContent,
);

storiesRouter.post(
  "/stories/:storyId/passage/new",
  checkAuthenticated,
  storyContentController.postNewPassage,
);

storiesRouter.patch(
  "/stories/:storyId/passage/update",
  checkAuthenticated,
  storyContentController.updatePassages,
);

storiesRouter.delete(
  "/stories/:storyId/passage/:passageId/delete",
  checkAuthenticated,
  storyContentController.deletePassage,
);

storiesRouter.post(
  "/stories/:storyId/choice/new",
  checkAuthenticated,
  storyContentController.postNewChoice,
);

storiesRouter.patch(
  "/stories/:storyId/choice/:choiceId/update",
  checkAuthenticated,
  storyContentController.updateChoice,
);

storiesRouter.delete(
  "/stories/:storyId/choice/:choiceId/delete",
  checkAuthenticated,
  storyContentController.deleteChoice,
);

export { storiesRouter };
