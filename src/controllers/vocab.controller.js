const VocabList = require("../models/VocabList");
const Word = require("../models/Word");

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
