const express = require('express');
const router = express.Router();

// GET / - Home page
router.get('/', (req, res) => {
  res.render('layout/header', {
    title: 'English Vocabulary Learning',
    content: `
      <div class="container mt-5">
        <div class="text-center mb-5">
          <h1 class="display-4">Welcome to English Vocabulary Learning</h1>
          <p class="lead">Master English vocabulary with interactive learning tools</p>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="bi bi-book"></i> Vocabulary Lists
                </h3>
                <p class="card-text">Browse curated vocabulary lists organized by difficulty level. Each list contains 20 carefully selected words with meanings and pronunciation.</p>
                <a href="/vocab" class="btn btn-primary">Browse Lists</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="bi bi-headphones"></i> Listening Practice
                </h3>
                <p class="card-text">Improve your listening skills by practicing spelling words you hear. Perfect for enhancing pronunciation recognition.</p>
                <a href="/vocab" class="btn btn-success">Start Practice</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="bi bi-bookmark-heart"></i> My Flashcards
                </h3>
                <p class="card-text">Save words to your personal flashcard collection. Track your learning progress with status markers: New, Learning, and Mastered.</p>
                <a href="/flashcard" class="btn btn-info">View Flashcards</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="bi bi-trophy"></i> Features
                </h3>
                <ul class="list-unstyled">
                  <li><i class="bi bi-check-circle text-success"></i> 20 words per vocabulary list</li>
                  <li><i class="bi bi-check-circle text-success"></i> Audio pronunciation</li>
                  <li><i class="bi bi-check-circle text-success"></i> Interactive listening tests</li>
                  <li><i class="bi bi-check-circle text-success"></i> Personal flashcard system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  });
});

module.exports = router;
