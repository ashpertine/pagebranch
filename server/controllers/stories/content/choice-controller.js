import choiceQueries from "../../../queries/stories/content/choice-queries.js";

async function postNewChoice(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const { label, from_passage_id, to_passage_id } = req.body;
    if (!from_passage_id || !to_passage_id) {
      return res.status(400).json({
        errorMsg: "from/to_passage_id need to be defined!",
      });
    }

    if (from_passage_id === to_passage_id) {
      return res.status(400).json({
        errorMsg: "from_passage_id cannot be the same as to_passage_id",
      });
    }

    const results = await choiceQueries.insertNewChoice(
      userId,
      storyId,
      label,
      from_passage_id,
      to_passage_id,
    );

    if (results === null) {
      return res.status(404).json({
        errorMsg: "Choice not found",
      });
    } else if (results.queryError) {
      return res.status(400).json({
        errorMsg: results.queryError,
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    if (error.code === "23503") {
      // foreign_key_violation
      return res
        .status(400)
        .json({ errorMsg: "referenced passage does not exist" });
    }
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function updateChoiceSortOrder(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    const choiceId = req.params.choiceId;

    const { sort_order } = req.body;
    const results = await choiceQueries.updateChoiceSortOrderById(
      userId,
      storyId,
      choiceId,
      sort_order,
    );

    if (results === null) {
      return res.status(404).json({
        errorMsg: "Choice not found",
      });
    } else if (results.queryError) {
      return res.status(400).json({
        errorMsg: results.queryError,
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

    if (from_passage_id === to_passage_id) {
      return res.status(400).json({
        errorMsg: "from_passage_id cannot be the same as to_passage_id",
      });
    }

    const results = await choiceQueries.updateChoiceById(
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
    } else if (results.queryError) {
      return res.status(400).json({
        errorMsg: results.queryError,
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    if (error.code === "23503") {
      // foreign_key_violation
      return res
        .status(400)
        .json({ errorMsg: "referenced passage does not exist" });
    }
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

    const results = await choiceQueries.deleteChoiceById(
      userId,
      storyId,
      choiceId,
    );

    if (results === null || results.length === 0) {
      return res.status(404).json({
        errorMsg: "Choice not found",
      });
    }
    if (results.queryError) {
      return res.status(400).json({
        errorMsg: results.queryError,
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
  postNewChoice,
  updateChoice,
  updateChoiceSortOrder,
  deleteChoice,
};
