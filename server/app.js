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
import { ratingRouter } from "./routes/stories/rating/rating-routes.js";
import path from "path";
const isProd = process.env.NODE_ENV === "prod";

const pgSession = PGSimple(session);
const app = express();
const PORT = process.env.APP_PORT ?? 3000;
const __dirname = import.meta.dirname;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    name: "pb.sid",
    store: new pgSession({
      pool: pbPool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
      secure: isProd ? true : false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js"; // import passport config

// API
app.use("/api", authRouter);
app.use("/api/stories", storyRouter);
app.use("/api/stories", passageRouter);
app.use("/api/stories", choiceRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/read", readRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/{*splat}", (req, res) => {
  return res.status(404).json({
    errorMsg: "Resource not found",
  });
});

// CLIENT
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(
  "/{*splat}",
  express.static(path.join(__dirname, "../client/dist/index.html")),
);

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`Express server is running on PORT ${PORT}`);
});
