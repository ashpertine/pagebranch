import ratingQueries from "../../../queries/stories/rating/rating-queries.js";

async function postNewRating(req, res) {
  try {
    const userId = req.session.passport.user;
    const { storyId, rating, description } = req.body;

    const results = await ratingQueries.insertNewRating(
      storyId,
      userId,
      rating,
      description,
    );
    if (results.queryError) {
      return res.status(400).json({
        errorMsg: results.queryError,
      });
    }

    return res.status(200).json({
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function getRatings(req, res) {
  try {
    const userId = req.session.passport ? req.session.passport.user : null;
    const isLoggedIn = userId !== null ? true : false;
    const storyId = req.params.storyId;

    const results = await ratingQueries.getRatingsByStoryId(
      storyId,
      isLoggedIn,
    );

    const hasSubmittedRating =
      userId !== null
        ? await ratingQueries.getHasSubmittedRating(storyId, userId)
        : false;

    return res.status(200).json({
      results: results,
      is_logged_in: isLoggedIn,
      has_submitted_rating: hasSubmittedRating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

export default {
  postNewRating,
  getRatings,
};
