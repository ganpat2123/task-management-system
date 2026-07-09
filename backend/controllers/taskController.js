const db = require("../config/db");

const createTask = (req, res) => {

    try {

        const { title, description, status } = req.body;

        if (!title || !description || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user_id = req.user.id;

        const sql =
            "INSERT INTO tasks(user_id,title,description,status) VALUES(?,?,?,?)";

        db.query(
            sql,
            [user_id, title, description, status],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Task Created Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getAllTasks = (req, res) => {
    try {

        const user_id = req.user.id;
        const { status } = req.query;

        let sql = "SELECT * FROM tasks WHERE user_id = ?";
        let values = [user_id];

        if (status) {
            sql += " AND status = ?";
            values.push(status);
        }

        sql += " ORDER BY id DESC";

        db.query(sql, values, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                total: result.length,
                tasks: result
            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateTask = (req, res) => {

    try {

        const { title, description, status } = req.body;

        const { id } = req.params;

        const user_id = req.user.id;

        if (!title || !description || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const sql = `
            UPDATE tasks
            SET title = ?, description = ?, status = ?
            WHERE id = ? AND user_id = ?
        `;

        db.query(
            sql,
            [title, description, status, id, user_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Task Not Found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Task Updated Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteTask = (req, res) => {

    try {

        const { id } = req.params;

        const user_id = req.user.id;

        const sql = `
            DELETE FROM tasks
            WHERE id = ? AND user_id = ?
        `;

        db.query(sql, [id, user_id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Task Not Found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Task Deleted Successfully"
            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
};


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJnYW5wYXQiLCJpYXQiOjE3ODM1MTYwMDEsImV4cCI6MTc4MzYwMjQwMX0.sHsP4HfWPpipieO6YQVBQYUCXpGkoBQ85e55NhZzXZs ga