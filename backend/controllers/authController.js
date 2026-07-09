const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check User
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Username already exists"
                    });
                }

                // Hash Password
                const hashPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users(username,password) VALUES(?,?)",
                    [username, hashPassword],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "User Registered Successfully"
                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const login = (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        db.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (result.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Username or Password"
                    });
                }

                const user = result[0];

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Username or Password"
                    });
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                res.status(200).json({
                    success: true,
                    message: "Login Successfully",
                    token
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

module.exports =  {register,login};