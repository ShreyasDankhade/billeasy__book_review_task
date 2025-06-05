// src/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

// Import routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const searchRoutes = require("./routes/search");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Health check endpoint
app.get("/", (req, res) => {
	res.json({ message: "Book Review API is running" });
});

// Route registration
// Auth routes: POST /signup, POST /login
app.use("/", authRoutes);

// Book routes: GET /books, POST /books, GET /books/:id
app.use("/books", bookRoutes);

// Review routes: POST /books/:id/reviews, PUT /reviews/:id, DELETE /reviews/:id
app.use("/", reviewRoutes);

// Search routes: GET /search
app.use("/search", searchRoutes);

// Sync database and start server
const PORT = process.env.PORT || 3000;
(async () => {
	try {
		// Synchronize all models with the database
		await sequelize.sync();
		console.log("Database synchronized");

		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	} catch (err) {
		console.error("Unable to connect to the database:", err);
	}
})();
