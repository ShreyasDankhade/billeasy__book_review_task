// src/routes/books.js
const express = require("express");
const router = express.Router();
const {
	createBook,
	getAllBooks,
	getBookById,
} = require("../controllers/bookController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Create a new book (authenticated)
router.post("/", authenticateToken, createBook);

// Get all books (with optional filters & pagination)
router.get("/", getAllBooks);

// Get book details (with average rating & paginated reviews)
router.get("/:id", getBookById);

module.exports = router;
