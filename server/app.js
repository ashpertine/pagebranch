import express from "express";
import session from "express-session";
import PGSimple from "connect-pg-simple";
import { pbPool } from "./db/pool.js";
import passport from "passport";
import { authRouter } from "./routes/auth-routes.js";
import { storyRouter } from "./routes/stories/story-routes.js";
import { choiceRouter } from "./routes/stories/content/choice-routes.js";
import { passageRouter } from "./routes/stories/content/passage-routes.js";
import { settingsRouter } from "./routes/settings-routes.js";
import { readRouter } from "./routes/stories/content/read-router.js";
import cors from "cors";

const pgSession = PGSimple(session);
const app = express();
const PORT = 3000;
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
  }),
);

app.use(
  session({
    name: "pb.sid",
    store: new pgSession({
      pool: pbPool,
    }),
    secret: process.env.PB_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js"; // import passport config

app.use("/api", authRouter);
app.use("/api/stories", storyRouter);
app.use("/api/stories", passageRouter);
app.use("/api/stories", choiceRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/read", readRouter);

// Catch all - 404
app.use((req, res) => {
  return res.status(404).json({
    errorMsg: "Resource not found",
  });
});

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`Express server is running on PORT ${PORT}`);
});
