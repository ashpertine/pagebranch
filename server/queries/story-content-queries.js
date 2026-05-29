import { pbPool } from "../db/pool.js";

async function setStartPassage(user_id, story_id, passage_id) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    UPDATE stories SET start_passage_id = $1, updated_at = now()
    WHERE author_id = $2 AND id = $3 AND 
      EXISTS (
        SELECT 1 FROM passages WHERE passages.id = $1
      )
    RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [passage_id, user_id, story_id]);
  return rows;
}

async function getPassagesByStoryId(user_id, story_id) {
  const SQL = `
    SELECT passages.* FROM passages
    INNER JOIN stories ON passages.story_id = stories.id
    WHERE stories.author_id = $1 AND passages.story_id $2 
  `;

  const { rows } = await pbPool.query(SQL, [user_id, story_id]);
  return rows;
}

async function insertNewPassage(user_id, story_id, title, description) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `INSERT into passages (story_id, title, description ) VALUES ($1, $2, $3) RETURNING *`;
  const { rows } = await pbPool.query(SQL, [story_id, title, description]);
  return rows;
}

async function updatePassageById(
  user_id,
  story_id,
  passage_id,
  title,
  description,
) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    UPDATE passages SET title = $1, description = $2
    FROM stories WHERE passages.story_id = stories.id AND stories.author_id = $3  AND passages.id = $4
    RETURNING passages.*
  `;

  const { rows } = await pbPool.query(SQL, [
    title,
    description,
    user_id,
    passage_id,
  ]);

  return rows;
}

async function deletePassageById(user_id, story_id, passage_id) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    DELETE FROM passages
    USING stories WHERE passages.story_id = stories.id AND stories.author_id = $1 AND passages.id = $2
    RETURNING passages.*
  `;

  const { rows } = pbPool.query(SQL, [user_id, passage_id]);
  return rows;
}

async function getChoicesByStoryId(user_id, story_id) {
  const SQL = `
    SELECT choices.* FROM choices
    INNER JOIN passages ON choices.from_passage_id = passages.id 
    INNER JOIN stories on passages.story_id = stories.id 
    WHERE stories.author_id = $1 AND stories.id = $2
  `;

  const { rows } = await pbPool.query(SQL, [user_id, story_id]);
  return rows;
}

async function getChoiceById(user_id, story_id, choice_id) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    SELECT * FROM choices WHERE id = $1
  `;

  const { rows } = await pbPool.query(SQL, [choice_id]);
  return rows;
}

async function insertNewChoice(
  user_id,
  story_id,
  label,
  from_passage_id,
  to_passage_id,
) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );
  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    INSERT INTO choices (label, from_passage_id, to_passage_id) VALUES ($1, $2, $3) RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [
    label,
    from_passage_id,
    to_passage_id,
  ]);
  return rows;
}

async function updateChoiceById(
  user_id,
  story_id,
  choice_id,
  label,
  from_passage_id,
  to_passage_id,
) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );

  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    UPDATE choices SET label = $1, from_passage_id = $2, to_passage_id = $3
    WHERE id = $4
    RETURNING *;
  `;

  const { rows } = await pbPool.query(SQL, [
    label,
    from_passage_id,
    to_passage_id,
    choice_id,
  ]);
}

async function deleteChoiceById(user_id, story_id, choice_id) {
  const isOwner = await pbPool.query(
    "SELECT COUNT(*) > 1 as valid from stories WHERE author_id = $1 AND id = $2",
    [user_id, story_id],
  );

  if (!isOwner) {
    // user does not own story
    return null;
  }

  const SQL = `
    DELETE FROM choices WHERE id = $1 RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [choice_id]);
  return rows;
}

export default {
  setStartPassage,
  getPassagesByStoryId,
  insertNewPassage,
  updatePassageById,
  deletePassageById,
  getChoicesByStoryId,
  getChoiceById,
  insertNewChoice,
  updateChoiceById,
  deleteChoiceById,
};
