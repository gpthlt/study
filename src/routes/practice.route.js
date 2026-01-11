const express = require("express");
const router = express.Router();

// GET /practice - Practice page (placeholder for future features)
router.get("/", (req, res) => {
  res.render("practice/index", {
    title: "Practice",
  });
});

module.exports = router;
