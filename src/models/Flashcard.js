const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "user_demo",
    },
    word: {
      type: String,
      required: true,
      trim: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "learning", "mastered"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
