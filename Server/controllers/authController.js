const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User_req = require("../models/User");
// Fix the import - import directly instead of destructuring
const upload = require("../middleware/upload");
const fs = require("fs");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  try {
    // Check if the user already exists
    let user = await User_req.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new utilisateur
    user = new User_req({
      name,
      email,
      password,
      avatar: process.env.DEFAULT_AVATAR_PATH || "/defaults/default-avatar.png",
    });

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarder l'utilisateur
    await user.save();

    // Créer le payload JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Signer le token with expiry from env
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Connexion d'un utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    let user = await User_req.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Email Not Exist",
        param: "email",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Password Incorrect", param: "password" });
    }

    // Créer le payload JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Signer le token with expiry from env
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les informations de l'utilisateur
exports.getUser = async (req, res) => {
  try {
    const user = await User_req.findById(req.headers["user-id"]).select(
      "-password"
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, age } = req.body;

  try {
    // Find user by ID from the auth middleware
    let user = await User_req.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Update user information
    user.name = name || user.name;
    user.age = age !== undefined ? age : user.age;
    // Email updates may require separate validation if email is unique

    // Save the updated user
    await user.save();

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      avatar: user.avatar,
      date: user.date,
    };

    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Middleware for handling avatar upload
const uploadAvatarMiddleware = upload.single("avatar");

// Update avatar handler
exports.updateAvatar = [
  uploadAvatarMiddleware,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = await User_req.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Delete previous avatar if it exists and isn't the default
      if (
        user.avatar &&
        !user.avatar.includes("default-avatar") &&
        fs.existsSync(`${__dirname}/../${user.avatar.substring(1)}`)
      ) {
        fs.unlinkSync(`${__dirname}/../${user.avatar.substring(1)}`);
      }

      // Update user avatar path - ensure it starts with a slash
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      // Return the full avatar URL in the response
      res.json({
        avatar: user.avatar,
        message: "Avatar updated successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
];
