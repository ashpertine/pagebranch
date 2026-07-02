import passageQueries from "../../../queries/stories/content/passage-queries.js";

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

    const results = await passageQueries.setStartPassageByStory(
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
        errorMsg: "No passage found",
      });
    }

    return res.status(200).json({
      okMsg: `new start passage id set: ${startPassageId}`,
      results: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function getStartPassage(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;

    const results = await passageQueries.getStartPassageByStory(
      userId,
      storyId,
    );
    if (results === null) {
      return res.status(404).json({
        errorMsg: "Story not found",
      });
    } else if (results.length === 0) {
      return res.status(404).json({
        errorMsg: "No passage found",
      });
    }

    return res.status(200).json({
      okMsg: `start passage found: ${results[0]}`,
      results: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function postNewPassage(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;
    let { title, description, pos_x, pos_y } = req.body;
    title = title ?? null;
    description = description ?? null;

    if (!pos_x || !pos_y) {
      return res.status(400).json({
        errorMsg: "pos_x and pos_y is undefined!",
      });
    }

    const results = await passageQueries.insertNewPassage(
      userId,
      storyId,
      title,
      description,
      pos_x,
      pos_y,
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

async function updatePassages(req, res) {
  try {
    const userId = req.session.passport.user;
    const storyId = req.params.storyId;

    const { passages } = req.body;

    const results = (
      await Promise.all(
        passages.map(async (passage) => {
          let { id, title, description, pos_x, pos_y } = passage;
          id = id ?? null;
          title = title ?? null;
          description = description ?? null;
          pos_x = pos_x != null ? Math.round(Number(pos_x)) : null;
          pos_y = pos_y != null ? Math.round(Number(pos_y)) : null;

          return await passageQueries.updatePassageById(
            userId,
            storyId,
            id,
            title,
            description,
            pos_x,
            pos_y,
          );
        }),
      )
    ).flat();

    let notFoundMsgs = [];
    for (let i = 0; i < passages.length; i++) {
      if (results[i] === null)
        notFoundMsgs.push(`Passage (id: ${passages[i].id})`);
    }

    if (notFoundMsgs.length > 0) {
      return res.status(404).json({
        errorMsg: notFoundMsgs,
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

    const results = await passageQueries.deletePassageById(
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

export default {
  updateStartPassage,
  getStartPassage,
  postNewPassage,
  updatePassages,
  deletePassage,
};
