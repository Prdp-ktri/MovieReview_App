const express = require("express");
const router = express.Router();
const Review = require("../models/review");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: "desc" });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  const review = new Review({
    title: req.body.title,
    rating: req.body.rating,
    text: req.body.text,
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
