import settingsQueries from "../queries/settings-queries.js";

async function updateSettings(req, res) {
  try {
    const userId = req.session.passport.user;
    const { preferences } = req.body;
    const results = await settingsQueries.updatePreferencesById(
      userId,
      preferences,
    );

    res.status(200).json({
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
  updateSettings,
};
