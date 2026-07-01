import { pbPool } from "../db/pool.js";

async function updatePreferencesById(user_id, preferences) {
  const SQL = `UPDATE settings SET preferences = $1::jsonb WHERE user_id = $2 RETURNING preferences`;
  const { rows } = await pbPool.query(SQL, [user_id, preferences]);

  return rows;
}

export default {
  updatePreferencesById,
};
