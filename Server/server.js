const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initialize Express
const app = express();

// Connect to database
connectDB();

// Create necessary directories for avatars
const defaultsDir = path.join(__dirname, "public", "defaults");
const uploadsDir = path.join(
  __dirname,
  process.env.AVATAR_UPLOAD_PATH || "uploads/avatars"
);

if (!fs.existsSync(defaultsDir)) {
  fs.mkdirSync(defaultsDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://taskmanager-eight-alpha.vercel.app", // Your production frontend URL
      "https://taskmanager-nduxg7efz-oussamabouhiris-projects.vercel.app", // Your preview frontend URL
    ],
    credentials: true,
  })
);
// Serve static files - make sure this comes before the routes
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// Base route
app.get("/", (req, res) => res.send("API Running"));

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`)
);
