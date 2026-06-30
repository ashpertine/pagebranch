import passageQueries from "../../queries/stories/content/passage-queries.js";
import choiceQueries from "../../queries/stories/content/choice-queries.js";
import storyQueries from "../../queries/stories/story-queries.js";
import { validationResult, matchedData } from "express-validator";

async function getStoryContent(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;

    const passagesResults = await passageQueries.getPassagesByStoryId(
      userId,
      storyId,
    );
    const choicesResults = await choiceQueries.getChoicesByStoryId(
      userId,
      storyId,
    );

    if (passagesResults === null && choicesResults === null) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    }
    return res.status(200).json({
      passages: passagesResults,
      choices: choicesResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function getUserStories(req, res) {
  try {
    const userId = req.session.passport.user;
    const results = await storyQueries.getAllStoriesByUser(userId);
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
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //handle errors
      const errors = result.mapped();
      return res.status(400).json({
        errorMsg: errors.story_title.msg,
      });
    }
    const userId = req.session.passport.user;

    const { story_title } = matchedData(req);

    const results = await storyQueries.createNewStory(userId, story_title);
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

    const results = await storyQueries.updateStoryById(
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

    const results = await storyQueries.deleteStoryById(userId, storyId);
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
  getStoryContent,
  getUserStories,
  postNewStory,
  updateStory,
  deleteStory,
};
