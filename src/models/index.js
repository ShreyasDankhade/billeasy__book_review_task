// src/models/index.js
const { Sequelize } = require("sequelize");
const envConfig = require("../config/config.js").development;

const sequelize = new Sequelize({
	dialect: envConfig.dialect,
	storage: envConfig.storage,
	logging: envConfig.logging,
});

// Import model definitions
const User = require("./user.js")(sequelize);
const Book = require("./book.js")(sequelize);
const Review = require("./review.js")(sequelize);

// Define associations

// A User can create many Books
User.hasMany(Book, { foreignKey: "createdBy", onDelete: "CASCADE" });
Book.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// A User can have many Reviews
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

// A Book can have many Reviews
Book.hasMany(Review, { foreignKey: "bookId", onDelete: "CASCADE" });
Review.belongsTo(Book, { foreignKey: "bookId" });

module.exports = {
	sequelize,
	User,
	Book,
	Review,
};
