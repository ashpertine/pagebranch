import { pbPool } from "../db/pool.js";
import { storyOwnerCheck } from "./role-queries.js";

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

async function insertNewPassage(user_id, story_id, title, description) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

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

  return rows;
}

async function deletePassageById(user_id, story_id, passage_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const isStartPassageResults = await pbPool.query(
    "SELECT start_passage_id IS NOT NULL AS is_start_passage FROM stories WHERE author_id = $1 AND start_passage_id = $2",
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
  return rows;
}

async function getChoicesByStoryId(user_id, story_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;
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
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

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
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const choiceExists = (
    await pbPool.query(
      `SELECT COUNT(*) > 0 as exists FROM choices WHERE from_passage_id = $1 AND to_passage_id = $2`,
      [from_passage_id, to_passage_id],
    )
  ).rows[0].exists;

  if (choiceExists) {
    return {
      queryError: `choice between passage ${from_passage_id} and ${to_passage_id} already exists`,
    };
  }

  const sortOrderArr = (
    await pbPool.query(
      "SELECT sort_order FROM choices WHERE from_passage_id = $1 ORDER BY sort_order ASC",
      [from_passage_id],
    )
  ).rows.map((row) => row.sort_order);

  let newSortOrder = 0;
  if (sortOrderArr.length > 0 && sortOrderArr.includes(0)) {
    for (let i = 0; i < sortOrderArr.length; i++) {
      if (sortOrderArr[i + 1] - sortOrderArr[i] > 1) {
        newSortOrder =
          sortOrderArr[i] === 0 ? sortOrderArr[i] : sortOrderArr[i] + 1;
        break;
      } else if (i === sortOrderArr.length - 1) {
        newSortOrder = sortOrderArr[i] + 1;
      }
    }
  }

  const SQL = `
    INSERT INTO choices (label, from_passage_id, to_passage_id, sort_order) VALUES ($1, $2, $3, $4) RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [
    label,
    from_passage_id,
    to_passage_id,
    newSortOrder,
  ]);
  return rows;
}

async function updateChoiceSortOrderById(
  user_id,
  story_id,
  choice_id,
  sort_order,
) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const fromPassageIdResults = await pbPool.query(
    "SELECT from_passage_id FROM choices WHERE id = $1",
    [choice_id],
  );

  if (!fromPassageIdResults.rowCount > 0) {
    return {
      queryError: "choice not found",
    };
  }

  const fromPassageId = fromPassageIdResults.rows[0].from_passage_id;

  const currentSort = (
    await pbPool.query("SELECT sort_order FROM choices WHERE id = $1", [
      choice_id,
    ])
  ).rows[0].sort_order;

  const sortOrderArr = (
    await pbPool.query(
      "SELECT sort_order FROM choices WHERE from_passage_id = $1",
      [fromPassageId],
    )
  ).rows.map((row) => row.sort_order);

  const existingChoice = await pbPool.query(
    "SELECT id FROM choices WHERE from_passage_id = $1 AND sort_order = $2",
    [fromPassageId, sort_order],
  );

  if (sort_order - Math.max(...sortOrderArr) > 1) {
    return {
      queryError: "sort_order is too large",
    };
  }

  const SQL = `
    UPDATE choices SET sort_order = $1 
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await pbPool.query(SQL, [sort_order, choice_id]);

  if (existingChoice.rowCount > 0) {
    await pbPool.query("UPDATE choices set sort_order = $1 WHERE id = $2", [
      currentSort,
      existingChoice.rows[0].id,
    ]);
  }

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
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const choiceExists = (
    await pbPool.query(
      `SELECT COUNT(*) > 0 as exists FROM choices WHERE from_passage_id = $1 AND to_passage_id = $2`,
      [from_passage_id, to_passage_id],
    )
  ).rows[0].exists;

  const currentChoice = await pbPool.query(
    `SELECT from_passage_id, to_passage_id FROM choices WHERE id = $1`,
    [choice_id],
  );

  const samePassages =
    Number(currentChoice.rows[0].from_passage_id) === Number(from_passage_id) &&
    Number(currentChoice.rows[0].to_passage_id) === Number(to_passage_id);

  if (choiceExists && !samePassages) {
    return {
      queryError: `choice between passage ${from_passage_id} and ${to_passage_id} already exists`,
    };
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

  return rows;
}

async function deleteChoiceById(user_id, story_id, choice_id) {
  const isOwner = await storyOwnerCheck(user_id, story_id);
  if (!isOwner) return null;

  const fromPassageIdResults = await pbPool.query(
    "SELECT from_passage_id FROM choices WHERE id = $1",
    [choice_id],
  );

  if (!fromPassageIdResults.rowCount > 0) {
    return {
      queryError: "choice not found",
    };
  }

  const fromPassageId = fromPassageIdResults.rows[0].from_passage_id;

  const SQL = `
    DELETE FROM choices WHERE id = $1 RETURNING *
  `;

  const { rows } = await pbPool.query(SQL, [choice_id]);

  const sortOrderArr = (
    await pbPool.query(
      "SELECT id, sort_order FROM choices WHERE from_passage_id = $1 ORDER BY sort_order ASC",
      [fromPassageId],
    )
  ).rows;

  if (sortOrderArr.length > 0) {
    for (let i = 0; i < sortOrderArr.length; i++) {
      await pbPool.query("UPDATE choices SET sort_order = $1 WHERE id = $2", [
        i,
        sortOrderArr[i].id,
      ]);
    }
  }
  return rows;
}

export default {
  setStartPassageByStory,
  getStartPassageByStory,
  getPassagesByStoryId,
  insertNewPassage,
  updatePassageById,
  deletePassageById,
  getChoicesByStoryId,
  getChoiceById,
  insertNewChoice,
  updateChoiceSortOrderById,
  updateChoiceById,
  deleteChoiceById,
};
