import passageController from "../../../controllers/stories/content/passage-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { storyRouter } from "../story-routes.js";

storyRouter.patch(
  "/:storyId/update-start/",
  checkAuthenticated,
  passageController.updateStartPassage,
);

storyRouter.get(
  "/:storyId/get-start/",
  checkAuthenticated,
  passageController.getStartPassage,
);

storyRouter.post(
  "/:storyId/passage/new",
  checkAuthenticated,
  passageController.postNewPassage,
);

storyRouter.patch(
  "/:storyId/passage/update",
  checkAuthenticated,
  passageController.updatePassages,
);

storyRouter.delete(
  "/:storyId/passage/:passageId/delete",
  checkAuthenticated,
  passageController.deletePassage,
);
