import { pbPool } from "../db/pool.js";

async function storyOwnerCheck(user_id, story_id) {
  const isOwner = (
    await pbPool.query(
      "SELECT COUNT(*) > 0 as valid from stories WHERE author_id = $1 AND id = $2",
      [user_id, story_id],
    )
  ).rows[0].valid;
  if (!isOwner) {
    // user does not own story
    return isOwner;
  } else {
    return true;
  }
}

export { storyOwnerCheck };
