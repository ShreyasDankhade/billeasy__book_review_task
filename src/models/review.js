// src/models/review.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Review = sequelize.define(
		"Review",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: { min: 1, max: 5 },
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			bookId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			indexes: [
				{
					unique: true,
					fields: ["userId", "bookId"],
				},
			],
		}
	);

	return Review;
};
