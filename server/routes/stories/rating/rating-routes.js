import { check } from "express-validator";
import ratingController from "../../../controllers/stories/rating/rating-controller.js";
import { checkAuthenticated } from "../../../middleware/auth-helper.js";
import { Router } from "express";

const ratingRouter = Router();

ratingRouter.get("/:storyId", ratingController.getRatings);
ratingRouter.post("/new", checkAuthenticated, ratingController.postNewRating);

export { ratingRouter };
