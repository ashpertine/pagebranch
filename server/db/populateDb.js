import { Client } from "pg";
import { connectionString } from "./pool.js";

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      author_id INTEGER NOT NULL,
      start_passage_id INTEGER,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT stories_user_fk
          FOREIGN KEY (author_id)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS passages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    story_id INTEGER NOT NULL,
    title VARCHAR(255),
    description VARCHAR(255),
    CONSTRAINT passages_story_fk
      FOREIGN KEY (story_id)
      REFERENCES stories(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS choices (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label VARCHAR(255) NOT NULL,
    from_passage_id INTEGER,
    to_passage_id INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT choice_from_passage_fk
      FOREIGN KEY (from_passage_id)
      REFERENCES passages(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,

    CONSTRAINT choice_to_passage_fk
      FOREIGN KEY (to_passage_id)
      REFERENCES passages(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );

  CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);

  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

  CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new Client({
  connectionString,
});

async function main() {
  try {
    await client.connect();
    console.log("Seeding...");
    await client.query(SQL);
    console.log("Seeding successful!");
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

main();
