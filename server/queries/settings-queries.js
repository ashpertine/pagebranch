import { pbPool } from "../db/pool.js";

async function updatePreferencesById(user_id, preferences) {
  const SQL = `UPDATE settings SET preferences = $1::jsonb WHERE user_id = $2 RETURNING preferences`;
  const { rows } = await pbPool.query(SQL, [preferences, user_id]);

  return rows;
}

async function getPreferenceById(user_id) {
  const SQL = `SELECT preferences FROM settings WHERE user_id = $1`;
  const { rows } = await pbPool.query(SQL, [user_id]);

  return rows;
}

export default {
  updatePreferencesById,
  getPreferenceById,
};
