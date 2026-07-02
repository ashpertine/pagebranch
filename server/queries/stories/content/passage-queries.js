import { pbPool } from "../../../db/pool.js";
import { storyOwnerCheck } from "../../role-queries.js";
import storyHelperQueries from "../story-helper-queries.js";

async function setStartPassageByStory(user_id, story_id, passage_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;
  const SQL = `
    UPDATE stories SET start_passage_id = $1
    WHERE author_id = $2 AND id = $3 AND 
      EXISTS (
        SELECT 1 FROM passages WHERE passages.id = $1
      )
    RETURNING start_passage_id
  `;

  const { rows } = await pbPool.query(SQL, [passage_id, user_id, story_id]);
  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

async function getStartPassageByStory(user_id, story_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;
  const SQL = `
    SELECT start_passage_id FROM stories WHERE author_id = $1 AND id = $2
  `;

  const { rows } = await pbPool.query(SQL, [user_id, story_id]);
  return rows;
}

async function getPassagesByStoryId(user_id, story_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;
  const SQL = `
    SELECT passages.* FROM passages
    INNER JOIN stories ON passages.story_id = stories.id
    WHERE stories.author_id = $1 AND passages.story_id = $2 
  `;

  const { rows } = await pbPool.query(SQL, [user_id, story_id]);
  return rows;
}

async function insertNewPassage(
  user_id,
  story_id,
  title,
  description,
  pos_x,
  pos_y,
) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const SQL = `INSERT into passages (story_id, title, description, pos_x, pos_y ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const { rows } = await pbPool.query(SQL, [
    story_id,
    title,
    description,
    pos_x,
    pos_y,
  ]);

  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

async function updatePassageById(
  user_id,
  story_id,
  passage_id,
  title,
  description,
  pos_x,
  pos_y,
) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  let cols = [title, description, user_id, passage_id];
  let updatePosStr = "";
  if (pos_x) {
    cols.push(pos_x);
    updatePosStr += `, pos_x = $${cols.length}`;
  }
  if (pos_y) {
    cols.push(pos_y);
    updatePosStr += `, pos_y = $${cols.length}`;
  }

  const SQL = `
    UPDATE passages SET title = $1, description = $2${updatePosStr}
    FROM stories WHERE passages.story_id = stories.id AND stories.author_id = $3 AND passages.id = $4
    RETURNING passages.*
  `;

  const { rows } = await pbPool.query(SQL, cols);

  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

async function deletePassageById(user_id, story_id, passage_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const isStartPassageResults = await pbPool.query(
    "SELECT EXISTS (SELECT 1 FROM stories WHERE author_id = $1 AND start_passage_id = $2) AS is_start_passage",
    [user_id, passage_id],
  );

  if (isStartPassageResults.rows[0].is_start_passage) {
    // nullify start passage
    await pbPool.query(
      `
    UPDATE stories SET start_passage_id = NULL
    WHERE author_id = $1 AND id = $2 AND 
      EXISTS (
        SELECT 1 FROM passages WHERE passages.id = $1
      )
    `,
      [user_id, story_id],
    );
  }

  const SQL = `
    DELETE FROM passages
    USING stories WHERE passages.story_id = stories.id AND stories.author_id = $1 AND passages.id = $2
    RETURNING passages.*
  `;

  const { rows } = await pbPool.query(SQL, [user_id, passage_id]);

  await storyHelperQueries.updateStoryUpdatedDate(user_id, story_id);
  return rows;
}

export default {
  setStartPassageByStory,
  getStartPassageByStory,
  getPassagesByStoryId,
  insertNewPassage,
  updatePassageById,
  deletePassageById,
};
