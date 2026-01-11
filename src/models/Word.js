const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    phonetic: {
      type: String,
      trim: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Word", wordSchema);
