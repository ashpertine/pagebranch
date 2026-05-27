import authQueries from "../queries/authQueries.js";

async function registerNewUserPost(req, res) {
  try {
    if (req.body.username === undefined || req.body.password === undefined) {
      return res.status(400).json({
        errorMsg: "username and/or password is undefined!",
      });
    }
    const { username, password } = req.body;
    const results = await authQueries.getUserByUsername(username);
    if (results.length > 0) {
      return res.status(409).json({
        errorMsg: "username already exists!",
      });
    }

    await authQueries.insertNewUser(username, password);
    return res.status(200).json({
      okMsg: "register successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.toString(),
    });
  }
}

function getLoginStatus(req, res) {
  try {
    const errorMsg = req.session.messages ?? false;
    if (req.session.messages) delete req.session.messages;
    const user_id = req.session.passport?.user;
    return res.status(200).json({
      currentUser: Boolean(user_id),
      userId: user_id,
      errorMsg: errorMsg[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.toString(),
    });
  }
}

export default {
  registerNewUserPost,
  getLoginStatus,
};
