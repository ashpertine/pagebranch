import { Pool } from "pg";

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pbPool = new Pool({
  connectionString,
});

export { connectionString, pbPool };
