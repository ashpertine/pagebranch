import { pbPool } from "../../db/pool.js";

async function updateStoryUpdatedDate(user_id, story_id) {
  const SQL = `UPDATE stories SET updated_at = now() WHERE id = $1 AND author_id = $2 RETURNING *`;
  await pbPool.query(SQL, [story_id, user_id]);
}

export default {
  updateStoryUpdatedDate,
};
