const VocabList = require("../models/VocabList");
const Word = require("../models/Word");
const fs = require("fs").promises;
const path = require("path");

// GET /vocab - List all vocabulary lists
exports.getVocabLists = async (req, res) => {
  try {
    const vocabLists = await VocabList.find().sort({ createdAt: -1 });
    res.render("vocab/list", {
      title: "Vocabulary Lists",
      vocabLists,
    });
  } catch (error) {
    console.error("Error fetching vocab lists:", error);
    req.flash("error_msg", "Error loading vocabulary lists");
    res.redirect("/");
  }
};

// GET /vocab/create - Show create vocab list form
exports.getCreateVocabList = (req, res) => {
  res.render("vocab/create", {
    title: "Create Vocabulary List",
  });
};

// POST /vocab/create - Create new vocab list
exports.createVocabList = async (req, res) => {
  try {
    const { title, description, level } = req.body;

    if (!title || !level) {
      req.flash("error_msg", "Title and level are required");
      return res.redirect("/vocab/create");
    }

    const vocabList = await VocabList.create({
      title: title.trim(),
      description: description?.trim() || "",
      level,
      words: [],
    });

    req.flash("success_msg", "Vocabulary list created successfully");
    res.redirect(`/vocab/${vocabList._id}`);
  } catch (error) {
    console.error("Error creating vocab list:", error);
    req.flash("error_msg", "Error creating vocabulary list");
    res.redirect("/vocab/create");
  }
};

// GET /vocab/:id/edit - Show edit vocab list form
exports.getEditVocabList = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.id);

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    res.render("vocab/edit", {
      title: "Edit Vocabulary List",
      vocabList,
    });
  } catch (error) {
    console.error("Error loading vocab list:", error);
    req.flash("error_msg", "Error loading vocabulary list");
    res.redirect("/vocab");
  }
};

// POST /vocab/:id/edit - Update vocab list
exports.updateVocabList = async (req, res) => {
  try {
    const { title, description, level } = req.body;
    const vocabList = await VocabList.findById(req.params.id);

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    if (!title || !level) {
      req.flash("error_msg", "Title and level are required");
      return res.redirect(`/vocab/${req.params.id}/edit`);
    }

    vocabList.title = title.trim();
    vocabList.description = description?.trim() || "";
    vocabList.level = level;
    await vocabList.save();

    req.flash("success_msg", "Vocabulary list updated successfully");
    res.redirect(`/vocab/${vocabList._id}`);
  } catch (error) {
    console.error("Error updating vocab list:", error);
    req.flash("error_msg", "Error updating vocabulary list");
    res.redirect(`/vocab/${req.params.id}/edit`);
  }
};

// POST /vocab/:id/delete - Delete vocab list
exports.deleteVocabList = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.id);

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    // Delete associated words
    if (vocabList.words && vocabList.words.length > 0) {
      await Word.deleteMany({ _id: { $in: vocabList.words } });
    }

    await VocabList.deleteOne({ _id: req.params.id });

    req.flash("success_msg", "Vocabulary list deleted successfully");
    res.redirect("/vocab");
  } catch (error) {
    console.error("Error deleting vocab list:", error);
    req.flash("error_msg", "Error deleting vocabulary list");
    res.redirect("/vocab");
  }
};

// GET /vocab/:id - Show vocabulary list detail
exports.getVocabDetail = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.id).populate("words");

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    res.render("vocab/detail", {
      title: vocabList.title,
      vocabList,
    });
  } catch (error) {
    console.error("Error fetching vocab detail:", error);
    req.flash("error_msg", "Error loading vocabulary list");
    res.redirect("/vocab");
  }
};

// GET /vocab/:id/listening - Show listening practice page
exports.getListeningPractice = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.id).populate("words");

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    if (!vocabList.words || vocabList.words.length === 0) {
      req.flash("error_msg", "This vocabulary list has no words");
      return res.redirect(`/vocab/${req.params.id}`);
    }

    // Get random word from the list
    const randomIndex = Math.floor(Math.random() * vocabList.words.length);
    const randomWord = vocabList.words[randomIndex];

    res.render("vocab/listening", {
      title: `Listening Practice - ${vocabList.title}`,
      vocabList,
      currentWord: randomWord,
    });
  } catch (error) {
    console.error("Error loading listening practice:", error);
    req.flash("error_msg", "Error loading listening practice");
    res.redirect("/vocab");
  }
};

// POST /vocab/:id/listening/check - Check user's answer
exports.checkListeningAnswer = async (req, res) => {
  try {
    const { wordId, userAnswer } = req.body;
    const word = await Word.findById(wordId);

    if (!word) {
      return res.json({ success: false, message: "Word not found" });
    }

    const isCorrect =
      userAnswer.trim().toLowerCase() === word.word.toLowerCase();

    res.json({
      success: true,
      correct: isCorrect,
      correctAnswer: word.word,
      meaning: word.meaning,
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.json({ success: false, message: "Error checking answer" });
  }
};

// GET /vocab/:listId/word/create - Show create word form
exports.getCreateWord = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.listId);

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    res.render("vocab/word-create", {
      title: `Add Word to ${vocabList.title}`,
      vocabList,
    });
  } catch (error) {
    console.error("Error loading form:", error);
    req.flash("error_msg", "Error loading form");
    res.redirect("/vocab");
  }
};

// POST /vocab/:listId/word/create - Create new word
exports.createWord = async (req, res) => {
  try {
    const { word, phonetic, meaning, audio } = req.body;
    const vocabList = await VocabList.findById(req.params.listId);

    if (!vocabList) {
      req.flash("error_msg", "Vocabulary list not found");
      return res.redirect("/vocab");
    }

    if (!word || !meaning) {
      req.flash("error_msg", "Word and meaning are required");
      return res.redirect(`/vocab/${req.params.listId}/word/create`);
    }

    const newWord = await Word.create({
      word: word.trim(),
      phonetic: phonetic?.trim() || "",
      meaning: meaning.trim(),
      audio: audio?.trim() || "",
    });

    vocabList.words.push(newWord._id);
    await vocabList.save();

    req.flash("success_msg", "Word added successfully");
    res.redirect(`/vocab/${vocabList._id}`);
  } catch (error) {
    console.error("Error creating word:", error);
    req.flash("error_msg", "Error creating word");
    res.redirect(`/vocab/${req.params.listId}/word/create`);
  }
};

// GET /vocab/:listId/word/:wordId/edit - Show edit word form
exports.getEditWord = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.listId);
    const word = await Word.findById(req.params.wordId);

    if (!vocabList || !word) {
      req.flash("error_msg", "Vocabulary list or word not found");
      return res.redirect("/vocab");
    }

    res.render("vocab/word-edit", {
      title: `Edit Word: ${word.word}`,
      vocabList,
      word,
    });
  } catch (error) {
    console.error("Error loading word:", error);
    req.flash("error_msg", "Error loading word");
    res.redirect("/vocab");
  }
};

// POST /vocab/:listId/word/:wordId/edit - Update word
exports.updateWord = async (req, res) => {
  try {
    const { word: wordText, phonetic, meaning, audio } = req.body;
    const word = await Word.findById(req.params.wordId);

    if (!word) {
      req.flash("error_msg", "Word not found");
      return res.redirect(`/vocab/${req.params.listId}`);
    }

    if (!wordText || !meaning) {
      req.flash("error_msg", "Word and meaning are required");
      return res.redirect(
        `/vocab/${req.params.listId}/word/${req.params.wordId}/edit`
      );
    }

    word.word = wordText.trim();
    word.phonetic = phonetic?.trim() || "";
    word.meaning = meaning.trim();
    word.audio = audio?.trim() || "";
    await word.save();

    req.flash("success_msg", "Word updated successfully");
    res.redirect(`/vocab/${req.params.listId}`);
  } catch (error) {
    console.error("Error updating word:", error);
    req.flash("error_msg", "Error updating word");
    res.redirect(`/vocab/${req.params.listId}/word/${req.params.wordId}/edit`);
  }
};

// POST /vocab/:listId/word/:wordId/delete - Delete word
exports.deleteWord = async (req, res) => {
  try {
    const vocabList = await VocabList.findById(req.params.listId);
    const word = await Word.findById(req.params.wordId);

    if (!vocabList || !word) {
      req.flash("error_msg", "Vocabulary list or word not found");
      return res.redirect("/vocab");
    }

    // Remove word from vocabulary list
    vocabList.words = vocabList.words.filter(
      (id) => id.toString() !== req.params.wordId
    );
    await vocabList.save();

    // Delete the word
    await Word.deleteOne({ _id: req.params.wordId });

    req.flash("success_msg", "Word deleted successfully");
    res.redirect(`/vocab/${vocabList._id}`);
  } catch (error) {
    console.error("Error deleting word:", error);
    req.flash("error_msg", "Error deleting word");
    res.redirect(`/vocab/${req.params.listId}`);
  }
};

// POST /vocab/:listId/word/:wordId/generate-audio - Generate audio for word
exports.generateAudio = async (req, res) => {
  try {
    const word = await Word.findById(req.params.wordId);

    if (!word) {
      req.flash("error_msg", "Word not found");
      return res.redirect(`/vocab/${req.params.listId}`);
    }

    // Generate audio filename
    const audioFileName = `${word.word.toLowerCase().replace(/\s+/g, "-")}.mp3`;
    const audioPath = `/audio/${audioFileName}`;

    // Update word with audio path
    word.audio = audioPath;
    await word.save();

    req.flash(
      "success_msg",
      `Audio path set to ${audioPath}. Note: You need to manually place the audio file in public/audio/`
    );
    res.redirect(`/vocab/${req.params.listId}`);
  } catch (error) {
    console.error("Error generating audio:", error);
    req.flash("error_msg", "Error generating audio");
    res.redirect(`/vocab/${req.params.listId}`);
  }
};
