// src/routes/search.js
const express = require("express");
const router = express.Router();
const { searchBooks } = require("../controllers/searchController");

// Search books by title or author
router.get("/", searchBooks);

module.exports = router;
