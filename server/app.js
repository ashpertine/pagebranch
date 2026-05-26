import express from "express";
import session from "express-session";
import PGSimple from "connect-pg-simple";
import { pbPool } from "./db/pool.js";

const pgSession = PGSimple(session);
const app = express();
const PORT = process.env.DB_PORT;

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
    }),
    secret: process.env.PB_COOKIE_SECRET,
    resave: false,
    cookie1: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
    },
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`Express server is running on PORT ${PORT}`);
});
