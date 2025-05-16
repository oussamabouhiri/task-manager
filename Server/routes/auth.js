const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const { uploadPhoto } = require("../middleware/upload");

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await authController.registerUser(req, res);
  }
);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await authController.loginUser(req, res);
  }
);

// @route   GET api/users/me
// @desc    Get user data
// @access  Private
router.get("/me", auth, authController.getUser);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, authController.updateProfile);

// @route   PUT /api/users/avatar
// @desc    Update user avatar
// @access  Private
router.post("/avatar", auth, authController.updateAvatar);

module.exports = router;
