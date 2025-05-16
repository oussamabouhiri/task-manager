const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post(
  "/create",
  [auth, [check("title", "Title is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await taskController.createTask(req, res);
  }
);

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Private
router.get("/", auth, taskController.getTasks);

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get("/:id", auth, taskController.getTaskById);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put("/:id", auth, taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete("/:id", auth, taskController.deleteTask);

// @route   GET api/tasks/filter
// @desc    Filter and sort tasks
// @access  Private
router.get("/filter/results", auth, taskController.filterTasks);

module.exports = router;
