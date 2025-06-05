// src/models/book.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Book = sequelize.define("Book", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		genre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});

	return Book;
};
