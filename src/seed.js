require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./models/Word');
const VocabList = require('./models/VocabList');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/study_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Starting seed process...');

    // Clear existing data
    await Word.deleteMany({});
    await VocabList.deleteMany({});
    console.log('Cleared existing data');

    // Sample 20 words for beginner level
    const wordsData = [
      { word: 'hello', phonetic: 'həˈloʊ', meaning: 'Xin chào', audio: '/audio/hello.mp3' },
      { word: 'goodbye', phonetic: 'ɡʊdˈbaɪ', meaning: 'Tạm biệt', audio: '/audio/goodbye.mp3' },
      { word: 'thank', phonetic: 'θæŋk', meaning: 'Cảm ơn', audio: '/audio/thank.mp3' },
      { word: 'please', phonetic: 'pliːz', meaning: 'Làm ơn', audio: '/audio/please.mp3' },
      { word: 'sorry', phonetic: 'ˈsɑːri', meaning: 'Xin lỗi', audio: '/audio/sorry.mp3' },
      { word: 'yes', phonetic: 'jes', meaning: 'Có, vâng', audio: '/audio/yes.mp3' },
      { word: 'no', phonetic: 'noʊ', meaning: 'Không', audio: '/audio/no.mp3' },
      { word: 'water', phonetic: 'ˈwɔːtər', meaning: 'Nước', audio: '/audio/water.mp3' },
      { word: 'food', phonetic: 'fuːd', meaning: 'Đồ ăn', audio: '/audio/food.mp3' },
      { word: 'book', phonetic: 'bʊk', meaning: 'Sách', audio: '/audio/book.mp3' },
      { word: 'house', phonetic: 'haʊs', meaning: 'Nhà', audio: '/audio/house.mp3' },
      { word: 'family', phonetic: 'ˈfæməli', meaning: 'Gia đình', audio: '/audio/family.mp3' },
      { word: 'friend', phonetic: 'frend', meaning: 'Bạn bè', audio: '/audio/friend.mp3' },
      { word: 'school', phonetic: 'skuːl', meaning: 'Trường học', audio: '/audio/school.mp3' },
      { word: 'teacher', phonetic: 'ˈtiːtʃər', meaning: 'Giáo viên', audio: '/audio/teacher.mp3' },
      { word: 'student', phonetic: 'ˈstuːdənt', meaning: 'Học sinh', audio: '/audio/student.mp3' },
      { word: 'learn', phonetic: 'lɜːrn', meaning: 'Học', audio: '/audio/learn.mp3' },
      { word: 'study', phonetic: 'ˈstʌdi', meaning: 'Nghiên cứu', audio: '/audio/study.mp3' },
      { word: 'read', phonetic: 'riːd', meaning: 'Đọc', audio: '/audio/read.mp3' },
      { word: 'write', phonetic: 'raɪt', meaning: 'Viết', audio: '/audio/write.mp3' }
    ];

    // Insert words into database
    const createdWords = await Word.insertMany(wordsData);
    console.log(`Inserted ${createdWords.length} words`);

    // Create vocabulary list with word references
    const vocabList = await VocabList.create({
      title: 'Basic English for Beginners',
      description: 'Essential everyday English words for absolute beginners. Learn greetings, common objects, and basic verbs.',
      level: 'beginner',
      words: createdWords.map(word => word._id)
    });

    console.log(`Created vocabulary list: ${vocabList.title}`);
    console.log('Seed completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed
connectDB().then(() => {
  seedData();
});
