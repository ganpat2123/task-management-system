
const db = require("../config/db");

const validStatuses = [
  "Todo",
  "In Progress",
  "Completed"
];

const createTask = (req, res) => {
  const { title, description, status = "Todo" } = req.body || {};

  const cleanTitle = String(title || "").trim();
  const cleanDescription = String(description || "").trim();

  if (!cleanTitle || !cleanDescription) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status"
    });
  }

  if (cleanTitle.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Task title is too long"
    });
  }

  const sql = `
    INSERT INTO tasks
    (user_id, title, description, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id,
      cleanTitle,
      cleanDescription,
      status
    ],
    (error, result) => {
      if (error) {
        console.error("Create task error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Unable to create task"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Task created successfully",
        taskId: result.insertId
      });
    }
  );
};

// GET ALL TASKS

const getAllTasks = (req, res) => {
  const { status } = req.query;

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status"
    });
  }

  let sql = `
    SELECT id, user_id, title, description, status
    FROM tasks
    WHERE user_id = ?
  `;

  const values = [req.user.id];

  if (status) {
    sql += " AND status = ?";
    values.push(status);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("Get tasks error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch tasks"
      });
    }

    return res.status(200).json({
      success: true,
      total: results.length,
      tasks: results
    });
  });
};

// UPDATE TASK

const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  const cleanTitle = String(title || "").trim();
  const cleanDescription = String(description || "").trim();

  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID"
    });
  }

  if (!cleanTitle || !cleanDescription) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  if (cleanTitle.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Task title is too long"
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status"
    });
  }

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      cleanTitle,
      cleanDescription,
      status,
      id,
      req.user.id
    ],
    (error, result) => {
      if (error) {
        console.error("Update task error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Unable to update task"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task updated successfully"
      });
    }
  );
};

// DELETE TASK

const deleteTask = (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID"
    });
  }

  const sql = `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [id, req.user.id],
    (error, result) => {
      if (error) {
        console.error("Delete task error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Unable to delete task"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully"
      });
    }
  );
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
};
