// src/controllers/bookController.js
const { Book, Review, User, sequelize } = require("../models");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.createBook = async (req, res) => {
	const { title, author, genre, description } = req.body;
	try {
		const book = await Book.create({
			title,
			author,
			genre,
			description,
			createdBy: req.user.id,
		});
		return res.status(201).json(book);
	} catch (error) {
		console.error("Create book error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.getAllBooks = async (req, res) => {
	const { author, genre } = req.query;
	const { limit, offset, page } = getPagination(req.query);

	// Build a "where" filter dynamically
	const whereClause = {};
	if (author) whereClause.author = { [Op.like]: `%${author}%` };
	if (genre) whereClause.genre = { [Op.like]: `%${genre}%` };

	try {
		const data = await Book.findAndCountAll({
			where: whereClause,
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});
		return res.json(getPagingData(data, page, limit));
	} catch (error) {
		console.error("Get all books error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.getBookById = async (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const { page: reviewPage = 1, limit: reviewLimit = 10 } = req.query;
	const limit = parseInt(reviewLimit, 10);
	const offset = (parseInt(reviewPage, 10) - 1) * limit;

	try {
		// 1. Fetch the book
		const book = await Book.findByPk(bookId);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		// 2. Calculate average rating
		const avgResult = await Review.findOne({
			attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
			where: { bookId },
		});
		const avgRating = parseFloat(avgResult.dataValues.avgRating || 0).toFixed(
			2
		);

		// 3. Fetch paginated reviews (with reviewer username)
		const reviewsData = await Review.findAndCountAll({
			where: { bookId },
			include: [{ model: User, attributes: ["id", "username"] }],
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});
		const paginatedReviews = {
			totalItems: reviewsData.count,
			results: reviewsData.rows,
			totalPages: Math.ceil(reviewsData.count / limit),
			currentPage: parseInt(reviewPage, 10),
		};

		return res.json({
			book,
			averageRating: avgRating,
			reviews: paginatedReviews,
		});
	} catch (error) {
		console.error("Get book by ID error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
