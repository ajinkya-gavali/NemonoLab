const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// POST /books
router.post('/books', libraryController.createBook);

// GET /books
router.get('/books', libraryController.listBooks);

// GET /books/:id
router.get('/books/:id', libraryController.getBook);

// PUT /books/:id
router.put('/books/:id', libraryController.updateBook);

// DELETE /books/:id
router.delete('/books/:id', libraryController.deleteBook);

// POST /members
router.post('/members', libraryController.createMember);

// GET /members
router.get('/members', libraryController.listMembers);

// GET /members/:id
router.get('/members/:id', libraryController.getMember);

// PUT /members/:id
router.put('/members/:id', libraryController.updateMember);

// POST /borrow
router.post('/borrow', libraryController.borrowBook);

// Borrowing Routes
// GET /borrowings
router.get('/borrowings', libraryController.listBorrowings);

// POST /borrowings/:id/return
router.post('/borrowings/:id/return', libraryController.returnBorrowing);

console.log('src/routes/libraryRoutes.js: library routes configured');
module.exports = router;
