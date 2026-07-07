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
    const fromUserId = req.session.passport ? req.session.passport.user : null;
    const isLoggedIn = fromUserId !== null ? true : false;
    const storyId = req.params.storyId;

    const results = await ratingQueries.getRatingsByStoryId(
      storyId,
      fromUserId,
    );

    if (results.queryError) {
      return res.status(results.code).json({
        errorMsg: results.queryError,
      });
    }

    const hasSubmittedRating =
      fromUserId !== null
        ? await ratingQueries.getHasSubmittedRating(storyId, fromUserId)
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

async function getTotalRatingStat(req, res) {
  try {
    const userId = req.session.passport.user;
    const results = await ratingQueries.getTotalRatingsByUser(userId);
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

export default {
  postNewRating,
  getRatings,
  getTotalRatingStat,
};
