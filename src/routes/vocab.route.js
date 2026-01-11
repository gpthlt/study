const express = require("express");
const router = express.Router();
const vocabController = require("../controllers/vocab.controller");

// GET /vocab - List all vocabulary lists
router.get("/", vocabController.getVocabLists);

// GET /vocab/:id - Show vocabulary list detail
router.get("/:id", vocabController.getVocabDetail);

// GET /vocab/:id/listening - Listening practice
router.get("/:id/listening", vocabController.getListeningPractice);

// POST /vocab/:id/listening/check - Check listening answer
router.post("/:id/listening/check", vocabController.checkListeningAnswer);

module.exports = router;
