// src/controllers/searchController.js
const { Book } = require("../models");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.searchBooks = async (req, res) => {
	const q = req.query.q;
	if (!q) {
		return res.status(400).json({ message: 'Query parameter "q" is required' });
	}

	const { limit, offset, page } = getPagination(req.query);

	try {
		const data = await Book.findAndCountAll({
			where: {
				[Op.or]: [
					{ title: { [Op.like]: `%${q}%` } },
					{ author: { [Op.like]: `%${q}%` } },
				],
			},
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});
		return res.json(getPagingData(data, page, limit));
	} catch (error) {
		console.error("Search books error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
