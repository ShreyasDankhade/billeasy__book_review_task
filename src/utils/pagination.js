// src/utils/pagination.js

/**
 * Extract pagination params from request query.
 * Defaults: page = 1, limit = 10.
 */
function getPagination(query) {
	const page = Math.max(parseInt(query.page, 10) || 1, 1);
	const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
	const offset = (page - 1) * limit;
	return { limit, offset, page };
}

/**
 * Format the Sequelize findAndCountAll result into a standardized structure.
 */
function getPagingData(data, page, limit) {
	const { count: totalItems, rows: results } = data;
	const totalPages = Math.ceil(totalItems / limit);
	return {
		totalItems,
		results,
		totalPages,
		currentPage: page,
	};
}

module.exports = { getPagination, getPagingData };
