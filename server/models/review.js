const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
