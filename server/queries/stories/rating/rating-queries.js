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

  const hasExistingRating = (
    await pbPool.query(
      "SELECT EXISTS(SELECT 1 FROM ratings WHERE story_id = $1 AND from_user_id = $2) AS has_existing_rating",
      [story_id, user_id],
    )
  ).rows[0].has_existing_rating;

  if (hasExistingRating) {
    return {
      queryError: "you have already rated this story.",
    };
  }

  const SQL = `INSERT INTO ratings (story_id, from_user_id, rating, description) VALUES ($1, $2, $3, $4) RETURNING *`;
  const { rows } = await pbPool.query(SQL, [
    story_id,
    user_id,
    rating,
    description,
  ]);
  return rows;
}

async function getRatingsByStoryId(story_id, is_logged_in) {
  const selectCols = is_logged_in ? "*" : "rating";
  const SQL = `SELECT ${selectCols} FROM ratings WHERE story_id = $1`;
  const { rows } = await pbPool.query(SQL, [story_id]);
  return rows;
}

export default {
  insertNewRating,
  getRatingsByStoryId,
};
