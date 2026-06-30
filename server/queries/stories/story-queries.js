import { pbPool } from "../../db/pool.js";
import storyHelperQueries from "./story-helper-queries.js";

async function getStoriesByTitle(story_title) {
  const SQL = `SELECT * FROM stories WHERE story_title = $1`;
  const { rows } = await pbPool.query(SQL, [story_title]);
  return rows;
}

async function getAllStoriesByUser(user_id) {
  const { rows } = await pbPool.query(
    "SELECT * FROM stories WHERE author_id = $1 ORDER BY created_at DESC",
    [user_id],
  );
  return rows;
}

async function createNewStory(user_id, story_title) {
  const existingStories = await getStoriesByTitle(story_title);
  const isDuplicate = existingStories.length > 0;
  if (isDuplicate) {
    story_title = `Copy of ${story_title}`;
  }

  const shareSlug = story_title.toLowerCase().split(" ").join("-");

  const SQL = `
    INSERT INTO stories (author_id, story_title, share_slug) VALUES ($1, $2, $3) RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [user_id, story_title, shareSlug]);
  return rows;
}

async function deleteStoryById(user_id, story_id) {
  const SQL = `DELETE FROM stories WHERE id = $1 AND author_id = $2 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_id, user_id]);
  return rows;
}

async function updateStoryById(user_id, story_id, story_title) {
  const SQL = `UPDATE stories SET story_title = $1 WHERE id = $2 AND author_id = $3 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_title, story_id, user_id]);
  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

export default {
  getStoriesByTitle,
  getAllStoriesByUser,
  createNewStory,
  deleteStoryById,
  updateStoryById,
};
