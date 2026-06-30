import choiceController from "../../../controllers/stories/content/choice-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { storyRouter } from "../story-routes.js";

storyRouter.post(
  "/:storyId/choice/new",
  checkAuthenticated,
  choiceController.postNewChoice,
);

storyRouter.patch(
  "/:storyId/choice/:choiceId/update",
  checkAuthenticated,
  choiceController.updateChoice,
);

storyRouter.patch(
  "/:storyId/choice/:choiceId/update-sort",
  checkAuthenticated,
  choiceController.updateChoiceSortOrder,
);

storyRouter.delete(
  "/:storyId/choice/:choiceId/delete",
  checkAuthenticated,
  choiceController.deleteChoice,
);
