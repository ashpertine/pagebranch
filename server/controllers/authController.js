import authQueries from "../queries/authQueries.js";

async function registerNewUserPost(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        errorMsg: "username and/or password is undefined!",
      });
    }
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
      errorMsg: error.toString(),
    });
  }
}

function getLoginStatus(req, res) {
  try {
    let statusCode = 200;
    const errorMsg = req.session.messages ?? false;
    if (req.session.messages) delete req.session.messages;
    if (req.session.noAuthCode) {
      statusCode = req.session.noAuthCode;
      delete req.session.noAuthCode;
    }
    const user_id = req.session.passport?.user;
    return res.status(statusCode).json({
      currentUser: Boolean(user_id),
      userId: user_id,
      errorMsg: errorMsg[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMsg: error.toString(),
    });
  }
}

export default {
  registerNewUserPost,
  getLoginStatus,
};
