const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Import Review model
const Review = require("./models/Review");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------------
// ✅ CONNECT TO MONGODB ATLAS
// ----------------------------------
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://movieAdmin:7IOHrggDVAUEFzoo@cluster0.mjh5ffi.mongodb.net/moviereviewDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ----------------------------------
// ✅ ROUTES
// ----------------------------------

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Fetch all reviews
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err.message);
    res.status(500).send("Error fetching reviews");
  }
});

// Add new review
app.post("/add", async (req, res) => {
  console.log("📩 Received form data:", req.body);

  try {
    const { movie, rating, comment } = req.body;

    if (!movie || !rating || !comment) {
      return res.status(400).send("❌ All fields are required");
    }

    await Review.create({
      movie,
      rating: Number(rating),
      comment,
    });

    console.log("✅ Review saved successfully!");
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error saving review:", err.message);
    res.status(400).send("Error saving review");
  }
});

// ----------------------------------
// ✅ START SERVER
// ----------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎬 Server running at http://localhost:${PORT}`);
});

