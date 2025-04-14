const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// In-memory review store (or load from JSON file if needed)
let reviews = [];

// GET all reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

// POST a new review
app.post("/api/reviews", upload.single("coverImage"), (req, res) => {
  const { title, review, rating, name } = req.body;

  // Validation
  if (!title || !review || !rating || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newReview = {
    id: Date.now().toString(),
    title,
    review,
    rating: parseInt(rating),
    name,
    imagePath: req.file ? `/uploads/${req.file.filename}` : null,
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
