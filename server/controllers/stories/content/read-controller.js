import passageQueries from "../../../queries/stories/content/passage-queries.js";
import choiceQueries from "../../../queries/stories/content/choice-queries.js";
import storyQueries from "../../../queries/stories/story-queries.js";

async function getReadStoryContent(req, res) {
  try {
    const viewUserId = req.params.userId;
    const shareSlug = req.params.shareSlug;

    const story = (
      await storyQueries.getStoryByUserAndSlug(viewUserId, shareSlug)
    ).rows[0];

    if (!story) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    }

    const isStoryPrivate = story.is_private;
    if (isStoryPrivate) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    }

    const storyId = story.id;

    const passagesResults = await passageQueries.getPassagesByStoryId(
      userId,
      storyId,
    );
    const choicesResults = await choiceQueries.getChoicesByStoryId(
      userId,
      storyId,
    );

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

export default {
  getReadStoryContent,
};
