const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcard.controller");

// GET /flashcard - View all flashcards
router.get("/", flashcardController.getFlashcards);

// POST /flashcard/add - Add word to flashcards
router.post("/add", flashcardController.addFlashcard);

// POST /flashcard/:id/delete - Delete a flashcard
router.post("/:id/delete", flashcardController.deleteFlashcard);

// POST /flashcard/:id/status - Update flashcard status
router.post("/:id/status", flashcardController.updateStatus);

module.exports = router;
