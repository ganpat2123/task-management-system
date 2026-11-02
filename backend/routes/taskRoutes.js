
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.get("/", authMiddleware, getAllTasks);

router.post("/", authMiddleware, createTask);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
