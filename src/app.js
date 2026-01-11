const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Flash messages
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const indexRouter = require("./routes/index.route");
const vocabRouter = require("./routes/vocab.route");
const flashcardRouter = require("./routes/flashcard.route");
const practiceRouter = require("./routes/practice.route");

app.use("/", indexRouter);
app.use("/vocab", vocabRouter);
app.use("/flashcard", flashcardRouter);
app.use("/practice", practiceRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render("layout/header", {
    title: "404 - Not Found",
    content: "<h1>404 - Page Not Found</h1>",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("layout/header", {
    title: "Error",
    content: `<h1>Error</h1><p>${err.message}</p>`,
  });
});

module.exports = app;
