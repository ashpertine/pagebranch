import { pbPool } from "../../db/pool.js";
import storyHelperQueries from "./story-helper-queries.js";
import { storyOwnerCheck } from "../role-queries.js";

async function formatTitleAndSlug(story_title, user_id) {
  const existingStories = await getStoriesByTitle(story_title, user_id);
  const prependedTextResult = (
    await pbPool.query(
      "SELECT preferences->>'default_prepended_text' AS default_prepended_text FROM settings WHERE user_id = $1",
      [user_id],
    )
  ).rows[0].default_prepended_text;

  const prependedText =
    prependedTextResult === null ? "Copy of" : prependedTextResult;

  const storyTitleFormatted = (
    existingStories.length > 0 ? `${prependedText} ${story_title}` : story_title
  ).trim();

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

async function getStoriesByTitle(story_title, user_id) {
  const SQL = `SELECT * FROM stories WHERE story_title = $1 AND author_id = $2`;
  const { rows } = await pbPool.query(SQL, [story_title, user_id]);
  return rows;
}

// Checks will be used here because checkAuthenticated is disabled for app purposes
async function getStoryById(story_id, from_user_id) {
  const isStoryPrivate = (
    await pbPool.query("SELECT is_private FROM stories WHERE id = $1", [
      story_id,
    ])
  ).rows[0].is_private;

  const isOwner =
    from_user_id === null
      ? false
      : await storyOwnerCheck(from_user_id, story_id);

  if (isStoryPrivate && !isOwner) {
    return {
      queryError: "story not found!",
      code: 404,
    };
  }
  const SQL = `SELECT * FROM stories WHERE id =  $1`;
  const { rows } = await pbPool.query(SQL, [story_id]);
  return rows;
}

async function getAuthorNameById(user_id) {
  const SQL = `SELECT username FROM users WHERE id = $1`;
  const { rows } = await pbPool.query(SQL, [user_id]);
  return rows;
}

async function getStoryByUserAndSlug(user_id, share_slug) {
  const SQL = `SELECT * FROM stories WHERE author_id = $1 AND share_slug = $2`;
  const { rows } = await pbPool.query(SQL, [user_id, share_slug]);
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
  const { storyTitleFormatted, shareSlug } = await formatTitleAndSlug(
    story_title,
    user_id,
  );

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
    user_id,
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
  const SQL = `UPDATE stories SET is_pinned = NOT is_pinned WHERE id = $1 AND author_id = $2 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_id, user_id]);

  return rows;
}

async function toggleStoryPrivacyById(user_id, story_id) {
  const startPassageId = (
    await pbPool.query(
      "SELECT start_passage_id FROM stories WHERE id = $1 AND author_id = $2",
      [story_id, user_id],
    )
  ).rows[0].start_passage_id;

  if (!startPassageId) {
    return null;
  }
  const SQL = `UPDATE stories SET is_private = NOT is_private WHERE id = $1 AND author_id = $2 RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_id, user_id]);

  return rows;
}

export default {
  getStoriesByTitle,
  getStoryById,
  getStoryByUserAndSlug,
  getAllStoriesByUser,
  getAuthorNameById,
  createNewStory,
  deleteStoryById,
  updateStoryById,
  updateStoryPinById,
  toggleStoryPrivacyById,
};
