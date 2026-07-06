import settingsQueries from "../queries/settings-queries.js";

async function updateSettings(req, res) {
  try {
    const userId = req.session.passport.user;
    const { preferences } = req.body;
    const results = await settingsQueries.updatePreferencesById(
      userId,
      preferences,
    );

    if (!results.length > 0) {
      return res.status(404).json({
        errorMsg: "user not found!",
      });
    }

    res.status(200).json({
      results: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

async function getSettings(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        errorMsg: "user not authorized!",
        default: {},
      });
    }
    const userId = req.session.passport.user;
    const results = await settingsQueries.getPreferenceById(userId);

    res.status(200).json({
      results: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

export default {
  updateSettings,
  getSettings,
};
