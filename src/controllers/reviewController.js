// src/controllers/reviewController.js
const { Review, Book } = require("../models");

exports.createReview = async (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const { rating, comment } = req.body;
	const userId = req.user.id;

	try {
		// 1. Ensure the book exists
		const book = await Book.findByPk(bookId);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		// 2. Check if user already reviewed this book
		const existingReview = await Review.findOne({ where: { userId, bookId } });
		if (existingReview) {
			return res
				.status(400)
				.json({ message: "You have already reviewed this book" });
		}

		// 3. Create the review
		const review = await Review.create({ rating, comment, userId, bookId });
		return res.status(201).json(review);
	} catch (error) {
		console.error("Create review error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.updateReview = async (req, res) => {
	const reviewId = parseInt(req.params.id, 10);
	const { rating, comment } = req.body;
	const userId = req.user.id;

	try {
		// 1. Fetch the review
		const review = await Review.findByPk(reviewId);
		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
		// 2. Only the author can update
		if (review.userId !== userId) {
			return res
				.status(403)
				.json({ message: "Forbidden: cannot update someone else’s review" });
		}

		// 3. Update fields if provided
		if (rating !== undefined) review.rating = rating;
		if (comment !== undefined) review.comment = comment;
		await review.save();

		return res.json(review);
	} catch (error) {
		console.error("Update review error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.deleteReview = async (req, res) => {
	const reviewId = parseInt(req.params.id, 10);
	const userId = req.user.id;

	try {
		// 1. Fetch the review
		const review = await Review.findByPk(reviewId);
		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
		// 2. Only the author can delete
		if (review.userId !== userId) {
			return res
				.status(403)
				.json({ message: "Forbidden: cannot delete someone else’s review" });
		}

		// 3. Delete it
		await review.destroy();
		return res.json({ message: "Review deleted successfully" });
	} catch (error) {
		console.error("Delete review error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
