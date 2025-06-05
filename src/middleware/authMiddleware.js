// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

async function authenticateToken(req, res, next) {
	// Expect header: Authorization: Bearer <token>
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Access token missing" });
	}

	try {
		// Verify token and get payload
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// Find the user in the database (so we can attach user info to req.user)
		const user = await User.findByPk(payload.id, {
			attributes: ["id", "username", "email"],
		});
		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}
		req.user = user; // attach user object (without password)
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}

module.exports = { authenticateToken };
