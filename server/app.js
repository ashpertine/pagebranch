import express from "express";
import session from "express-session";
import PGSimple from "connect-pg-simple";
import { pbPool } from "./db/pool.js";
import passport from "passport";
import { authRouter } from "./routes/authRoutes.js";

const pgSession = PGSimple(session);
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    store: new pgSession({
      pool: pbPool,
    }),
    secret: process.env.PB_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie1: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js"; // import passport config

app.use("/api", authRouter);

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`Express server is running on PORT ${PORT}`);
});
