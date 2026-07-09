const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {createTask,getAllTasks, updateTask,deleteTask} = require("../controllers/taskController");

router.get("/", authMiddleware, getAllTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJyb2xleCIsImlhdCI6MTc4MzUxMzU1NSwiZXhwIjoxNzgzNTk5OTU1fQ.ZuPhq7opT68_qe0h1Q2OJKxN7vbswP5XL48lXUe-uhU