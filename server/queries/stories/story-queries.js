import { pbPool } from "../../db/pool.js";
import storyHelperQueries from "./story-helper-queries.js";

async function formatTitleAndSlug(story_title, add_copy_text = true) {
  const existingStories = await getStoriesByTitle(story_title);
  const storyTitleFormatted =
    existingStories.length > 0 && add_copy_text
      ? `Copy of ${story_title}`
      : story_title;
  const existingSlugs = existingStories.map((story) => story.share_slug);
  let shareSlug = story_title.toLowerCase().split(" ").join("-");
  if (existingSlugs.includes(shareSlug)) {
    shareSlug = `${shareSlug}-${existingSlugs.length + 1}`;
  }

  return {
    storyTitleFormatted,
    shareSlug,
  };
}

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
  const { storyTitleFormatted, shareSlug } =
    await formatTitleAndSlug(story_title);

  const SQL = `
    INSERT INTO stories (author_id, story_title, share_slug) VALUES ($1, $2, $3) RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [
    user_id,
    storyTitleFormatted,
    shareSlug,
  ]);
  return rows;
}

async function deleteStoryById(user_id, story_id) {
  const SQL = `DELETE FROM stories WHERE id = $1 AND author_id = $2 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_id, user_id]);
  return rows;
}

async function updateStoryById(user_id, story_id, story_title) {
  const { storyTitleFormatted, shareSlug } = await formatTitleAndSlug(
    story_title,
    false,
  );
  const SQL = `UPDATE stories SET story_title = $1, share_slug = $2 WHERE id = $3 AND author_id = $4 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [
    storyTitleFormatted,
    shareSlug,
    story_id,
    user_id,
  ]);
  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

async function updateStoryPinById(user_id, story_id) {
  const SQL = `UPDATE stories SET is_pinned = NOT is_pinned WHERE id = $1 AND author_id = $2 RETURNING * `;
  const { rows } = await pbPool.query(SQL, [story_id, user_id]);

  return rows;
}

export default {
  getStoriesByTitle,
  getAllStoriesByUser,
  createNewStory,
  deleteStoryById,
  updateStoryById,
  updateStoryPinById,
};
