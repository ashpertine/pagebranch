import passport from "passport";
import LocalStrategy from "passport-local";
import { pbPool } from "../db/pool.js";
import { validPassword } from "../utils/password-utils.js";

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pbPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    const user = rows[0];
    if (!user) {
      return done(null, false, { message: "Incorrect username or password." });
    } else {
      const match = await validPassword(password, user.password);
      if (!match)
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      else return done(null, user);
    }
  } catch (error) {
    return done(error);
  }
};

passport.use(new LocalStrategy(verifyCallback));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pbPool.query("SELECT id FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (error) {
    return done(error);
  }
});
