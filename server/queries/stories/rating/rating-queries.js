import { pbPool } from "../../../db/pool.js";

async function insertNewRating(story_id, user_id, rating, description) {
  const isOwner = (
    await pbPool.query(
      "SELECT EXISTS ( SELECT 1 FROM stories WHERE id = $1 AND author_id = $2) AS is_owner",
      [story_id, user_id],
    )
  ).rows[0].is_owner;

  if (isOwner) {
    return {
      queryError: "owner is not allowed to rate this story",
    };
  }

  const SQL = `INSERT INTO ratings (story_id, from_user_id, rating, description) VALUES ($1, $2, $3, $4) ON CONFLICT(story_id, from_user_id) DO NOTHING RETURNING *`;
  const { rows } = await pbPool.query(SQL, [
    story_id,
    user_id,
    rating,
    description,
  ]);

  if (rows.length === 0) {
    return {
      queryError: "you have already rated this story.",
    };
  }
  return rows;
}

async function getRatingsByStoryId(story_id, is_logged_in) {
  const selectCols = is_logged_in ? "*" : "rating";
  const SQL = `SELECT ${selectCols} FROM ratings WHERE story_id = $1`;
  const { rows } = await pbPool.query(SQL, [story_id]);
  return rows;
}

async function getHasSubmittedRating(story_id, user_id) {
  const SQL = `SELECT EXISTS (SELECT 1 FROM ratings WHERE story_id = $1 AND from_user_id = $2) AS has_submitted_rating`;
  const hasSubmittedRating = (await pbPool.query(SQL, [story_id, user_id]))
    .rows[0].has_submitted_rating;

  return hasSubmittedRating;
}

export default {
  insertNewRating,
  getRatingsByStoryId,
  getHasSubmittedRating,
};
