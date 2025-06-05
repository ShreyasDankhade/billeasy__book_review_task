// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");
require("dotenv").config();

exports.signup = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		// Check if user/email already exists
		const existing = await User.findOne({
			where: sequelize.or({ username }, { email }),
		});
		if (existing) {
			return res
				.status(400)
				.json({ message: "Username or email already taken" });
		}
		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		// Create the user
		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});
		// Return the new user info (omit password)
		return res.status(201).json({
			id: user.id,
			username: user.username,
			email: user.email,
		});
	} catch (error) {
		console.error("Signup error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Find user by email
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// Generate JWT (payload: { id: user.id })
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || "1h",
		});
		return res.json({ token });
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
