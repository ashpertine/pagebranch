import storiesQueries from "../queries/stories-queries.js";

async function getUserStories(req, res) {
  try {
    const userId = req.session.passport.user;
    const results = await storiesQueries.getAllStoriesByUser(userId);
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function postNewStory(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyTitle = req.body.story_title;
    if (!userId || !storyTitle) {
      return res.status(400).json({
        errorMsg: "story title is undefined!",
      });
    }

    const results = await storiesQueries.createNewStory(userId, storyTitle);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function updateStory(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const storyTitle = req.body.story_title;
    if (!storyId) {
      return res.status(400).json({
        errorMsg: "story id is undefined!",
      });
    }

    if (!storyTitle) {
      return res.status(400).json({
        errorMsg: "story title is undefined!",
      });
    }

    const results = await storiesQueries.updateStoryById(
      userId,
      storyId,
      storyTitle,
    );
    if (results.length === 0) {
      return res.status(404).json({ errorMsg: "Story not found" });
    }
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function deleteStory(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    if (!storyId) {
      return res.status(400).json({
        errorMsg: "story id is undefined!",
      });
    }

    const results = await storiesQueries.deleteStoryById(userId, storyId);
    if (results.length === 0) {
      return res.status(404).json({ errorMsg: "Story not found" });
    }
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

export default {
  getUserStories,
  postNewStory,
  updateStory,
  deleteStory,
};
