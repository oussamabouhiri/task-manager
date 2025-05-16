const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true); // Suppress strictQuery warning

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Quitter le processus en cas d'échec
    process.exit(1);
  }
};

module.exports = connectDB;
