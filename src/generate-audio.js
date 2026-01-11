const gtts = require("node-gtts")("en");
const fs = require("fs");
const path = require("path");

// Danh sách các từ cần tạo audio
const words = [
  "hello",
  "goodbye",
  "thank",
  "please",
  "sorry",
  "yes",
  "no",
  "water",
  "food",
  "book",
  "house",
  "family",
  "friend",
  "school",
  "teacher",
  "student",
  "learn",
  "study",
  "read",
  "write",
];

// Đường dẫn đến thư mục audio
const audioDir = path.join(__dirname, "public", "audio");

// Tạo thư mục audio nếu chưa tồn tại
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log("Created audio directory");
}

// Hàm tạo file audio cho một từ
const generateAudioForWord = (word) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(audioDir, `${word}.mp3`);

    gtts.save(filepath, word, (err) => {
      if (err) {
        console.error(`Error generating audio for "${word}":`, err.message);
        reject(err);
      } else {
        console.log(`✓ Generated audio for "${word}"`);
        resolve();
      }
    });
  });
};

// Tạo audio cho tất cả các từ
const generateAllAudio = async () => {
  console.log("Starting audio generation...\n");

  for (const word of words) {
    try {
      await generateAudioForWord(word);
      // Thêm delay nhỏ để tránh rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate audio for "${word}"`);
    }
  }

  console.log("\n✓ Audio generation completed!");
  console.log(`Audio files saved in: ${audioDir}`);
};

// Chạy script
generateAllAudio().catch(console.error);
