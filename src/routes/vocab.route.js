const express = require("express");
const router = express.Router();
const vocabController = require("../controllers/vocab.controller");

// Vocabulary List Routes
// GET /vocab - List all vocabulary lists
router.get("/", vocabController.getVocabLists);

// GET /vocab/create - Show create vocab list form
router.get("/create", vocabController.getCreateVocabList);

// POST /vocab/create - Create new vocab list
router.post("/create", vocabController.createVocabList);

// GET /vocab/:id/edit - Show edit vocab list form
router.get("/:id/edit", vocabController.getEditVocabList);

// POST /vocab/:id/edit - Update vocab list
router.post("/:id/edit", vocabController.updateVocabList);

// POST /vocab/:id/delete - Delete vocab list
router.post("/:id/delete", vocabController.deleteVocabList);

// Word Management Routes
// GET /vocab/:listId/word/create - Show create word form
router.get("/:listId/word/create", vocabController.getCreateWord);

// POST /vocab/:listId/word/create - Create new word
router.post("/:listId/word/create", vocabController.createWord);

// GET /vocab/:listId/word/:wordId/edit - Show edit word form
router.get("/:listId/word/:wordId/edit", vocabController.getEditWord);

// POST /vocab/:listId/word/:wordId/edit - Update word
router.post("/:listId/word/:wordId/edit", vocabController.updateWord);

// POST /vocab/:listId/word/:wordId/delete - Delete word
router.post("/:listId/word/:wordId/delete", vocabController.deleteWord);

// POST /vocab/:listId/word/:wordId/generate-audio - Generate audio
router.post(
  "/:listId/word/:wordId/generate-audio",
  vocabController.generateAudio
);

// Vocabulary Detail & Practice Routes (must be after specific routes)
// GET /vocab/:id - Show vocabulary list detail
router.get("/:id", vocabController.getVocabDetail);

// GET /vocab/:id/listening - Listening practice
router.get("/:id/listening", vocabController.getListeningPractice);

// POST /vocab/:id/listening/check - Check listening answer
router.post("/:id/listening/check", vocabController.checkListeningAnswer);

module.exports = router;
