const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Review = require("./models/Review");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/moviereviewDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API route to fetch all reviews
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ _id: -1 });
  res.json(reviews);
});

// Route to add a new review
app.post("/add", async (req, res) => {
  const newReview = new Review({
    movie: req.body.movie,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  await newReview.save();
  res.redirect("/");
});

// Start the server
app.listen(3000, () => console.log("🎬 Server running on http://localhost:3000"));
