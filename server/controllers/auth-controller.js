import authQueries from "../queries/auth-queries.js";
import { validationResult, matchedData } from "express-validator";

async function registerNewUserPost(req, res) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //handle errors
      const errors = result.mapped();
      return res.status(400).json({
        errorMsg: Object.fromEntries(
          Object.entries(errors).map(([errorField, errorValue]) => [
            errorField,
            errorValue.msg,
          ]),
        ),
      });
    }

    const { username, password, confirmPassword } = matchedData(req);

    if (password !== confirmPassword) {
      return res.status(400).json({
        errorMsg: { global: "Your passwords do not match!" },
      });
    }
    const results = await authQueries.getUserByUsername(username);
    if (results.length > 0) {
      return res.status(409).json({
        errorMsg: { global: "Username already exists!" },
      });
    }

    await authQueries.insertNewUser(username, password);
    return res.status(200).json({
      okMsg: { global: "Register successful" },
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
    if (req.session.messages) {
      statusCode = 401;
      delete req.session.messages;
    }
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
