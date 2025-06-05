// src/routes/reviews.js
const express = require("express");
const router = express.Router();
const {
	createReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Submit a review for a book (authenticated)
router.post("/books/:id/reviews", authenticateToken, createReview);

// Update your own review (authenticated)
router.put("/reviews/:id", authenticateToken, updateReview);

// Delete your own review (authenticated)
router.delete("/reviews/:id", authenticateToken, deleteReview);

module.exports = router;
