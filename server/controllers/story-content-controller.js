import storyContentQueries from "../queries/story-content-queries.js";

async function updateStartPassage(req, res) {
  try {
    const userId = req.session.passport.user;
    const startPassageId = req.body.passageId;
    const storyId = req.params.storyId;
    if (!startPassageId) {
      return res.status(400).json({
        errorMsg: "startPassageId is undefined!",
      });
    }

    const results = await storyContentQueries.setStartPassage(
      userId,
      storyId,
      startPassageId,
    );

    if (results === null) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    } else if (results.length === 0) {
      return res.status(404).json({
        errorMsg: "Passage likely does not exist",
      });
    }

    return res.status(200).json({
      okMsg: `new start passage id set: ${startPassageId}`,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function getStoryContent(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;

    const passagesResults = storyContentQueries.getPassagesByStoryId(
      userId,
      storyId,
    );
    const choicesResults = storyContentQueries.getChoicesByStoryId(
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

async function newPassagePost(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    let { title, description } = req.body;
    title = title ?? null;
    description = description ?? null;

    const results = await storyContentQueries.insertNewPassage(
      userId,
      storyId,
      title,
      description,
    );

    if (results === null) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function updatePassage(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const passageId = req.params.passageId;
    let { title, description } = req.body;
    title = title ?? null;
    description = description ?? null;

    const results = await storyContentQueries.updatePassageById(
      userId,
      storyId,
      passageId,
      title,
      description,
    );
    if (results === null) {
      return res.status(404).json({
        errorMsg: "Passage not found",
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function deletePassage(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const passageId = req.params.passageId;

    const results = await storyContentQueries.deletePassageById(
      userId,
      storyId,
      passageId,
    );

    if (results.length === 0) {
      return res.status(404).json({
        errorMsg: "Passage not found",
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function newChoicePost(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const { label, from_passage_id, to_passage_id } = req.body;
    if (!from_passage_id || !to_passage_id) {
      return res.status(400).json({
        errorMsg: "from/to_passage_id need to be defined!",
      });
    }

    const results = await storyContentQueries.insertNewChoice(
      userId,
      storyId,
      label,
      from_passage_id,
      to_passage_id,
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function updateChoice(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const choiceId = req.params.choiceId;
    const { label, from_passage_id, to_passage_id } = req.body;

    if (!from_passage_id || !to_passage_id) {
      return res.status(400).json({
        errorMsg: "from/to_passage_id need to be defined!",
      });
    }

    const results = storyContentQueries.updateChoiceById(
      userId,
      storyId,
      choiceId,
      label,
      from_passage_id,
      to_passage_id,
    );

    if (results === null) {
      return res.status(404).json({
        errorMsg: "Choice not found",
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function deleteChoice(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const choiceId = req.params.choiceId;

    const results = storyContentQueries.deleteChoiceById(
      userId,
      storyId,
      choiceId,
    );
    if (results === null) {
      return res.status(404).json({
        errorMsg: "Choice not found",
      });
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
  updateStartPassage,
  getStoryContent,
  newPassagePost,
  updatePassage,
  deletePassage,
  newChoicePost,
  updateChoice,
  deleteChoice,
};
