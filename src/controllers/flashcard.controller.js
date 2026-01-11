const Flashcard = require("../models/Flashcard");

const DUMMY_USER_ID = "user_demo";

// GET /flashcard - View all flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: DUMMY_USER_ID }).sort({
      createdAt: -1,
    });

    // Group by status for better display
    const grouped = {
      new: flashcards.filter((f) => f.status === "new"),
      learning: flashcards.filter((f) => f.status === "learning"),
      mastered: flashcards.filter((f) => f.status === "mastered"),
    };

    res.render("flashcard/index", {
      title: "My Flashcards",
      flashcards,
      grouped,
      totalCount: flashcards.length,
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    req.flash("error_msg", "Error loading flashcards");
    res.redirect("/");
  }
};

// POST /flashcard/add - Add word to flashcards
exports.addFlashcard = async (req, res) => {
  try {
    const { word, meaning } = req.body;

    if (!word || !meaning) {
      req.flash("error_msg", "Word and meaning are required");
      return res.redirect("back");
    }

    // Check if word already exists in user's flashcards
    const existingFlashcard = await Flashcard.findOne({
      userId: DUMMY_USER_ID,
      word: word.trim(),
    });

    if (existingFlashcard) {
      req.flash("error_msg", "This word is already in your flashcards");
      return res.redirect("back");
    }

    // Create new flashcard
    await Flashcard.create({
      userId: DUMMY_USER_ID,
      word: word.trim(),
      meaning: meaning.trim(),
      status: "new",
    });

    req.flash("success_msg", "Word added to flashcards successfully");
    res.redirect("back");
  } catch (error) {
    console.error("Error adding flashcard:", error);
    req.flash("error_msg", "Error adding flashcard");
    res.redirect("back");
  }
};

// POST /flashcard/:id/delete - Delete a flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: DUMMY_USER_ID,
    });

    if (!flashcard) {
      req.flash("error_msg", "Flashcard not found");
      return res.redirect("/flashcard");
    }

    await Flashcard.deleteOne({ _id: req.params.id });
    req.flash("success_msg", "Flashcard deleted successfully");
    res.redirect("/flashcard");
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    req.flash("error_msg", "Error deleting flashcard");
    res.redirect("/flashcard");
  }
};

// POST /flashcard/:id/status - Update flashcard status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "learning", "mastered"];

    if (!validStatuses.includes(status)) {
      req.flash("error_msg", "Invalid status");
      return res.redirect("/flashcard");
    }

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: DUMMY_USER_ID,
    });

    if (!flashcard) {
      req.flash("error_msg", "Flashcard not found");
      return res.redirect("/flashcard");
    }

    flashcard.status = status;
    await flashcard.save();

    req.flash("success_msg", `Status updated to ${status}`);
    res.redirect("/flashcard");
  } catch (error) {
    console.error("Error updating status:", error);
    req.flash("error_msg", "Error updating status");
    res.redirect("/flashcard");
  }
};
