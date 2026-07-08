import { pbPool } from "../db/pool.js";
import { genPassword } from "../utils/password-utils.js";

async function insertNewUser(username, password) {
  const hashed = await genPassword(password);
  const SQL =
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id";

  const { rows } = await pbPool.query(SQL, [username, hashed]);
  const userId = rows[0].id;

  await pbPool.query("INSERT INTO settings (user_id) VALUES ($1)", [userId]);
  return rows;
}

async function getUserByUsername(username) {
  const SQL = "SELECT * FROM users WHERE username = $1";
  const { rows } = await pbPool.query(SQL, [username]);

  return rows;
}

export default { insertNewUser, getUserByUsername };
