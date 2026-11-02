
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3 to 30 characters"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const checkSql = `
      SELECT id FROM users
      WHERE username = ? OR email = ?
      LIMIT 1
    `;

    db.query(
      checkSql,
      [cleanUsername, cleanEmail],
      async (error, results) => {
        if (error) {
          console.error("Register SELECT error:", error.message);

          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Username or email already exists"
          });
        }

        try {
          const hashedPassword = await bcrypt.hash(
            String(password),
            10
          );

          const insertSql = `
            INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)
          `;

          db.query(
            insertSql,
            [
              cleanUsername,
              cleanEmail,
              hashedPassword
            ],
            (insertError) => {
              if (insertError) {
                console.error(
                  "Register INSERT error:",
                  insertError.message
                );

                return res.status(
                  insertError.code === "ER_DUP_ENTRY"
                    ? 409
                    : 500
                ).json({
                  success: false,
                  message:
                    insertError.code === "ER_DUP_ENTRY"
                      ? "Username or email already exists"
                      : "Unable to register"
                });
              }

              return res.status(201).json({
                success: true,
                message:
                  "Registration successful. Please login."
              });
            }
          );
        } catch (hashError) {
          console.error(
            "Password hashing error:",
            hashError.message
          );

          return res.status(500).json({
            success: false,
            message: "Unable to register"
          });
        }
      }
    );
  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// LOGIN

const login = (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    const identifier = String(
      username || email || ""
    ).trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required"
      });
    }

    const sql = `
      SELECT id, username, email, password
      FROM users
      WHERE username = ? OR email = ?
      LIMIT 1
    `;

    db.query(
      sql,
      [identifier, identifier.toLowerCase()],
      async (error, results) => {
        if (error) {
          console.error("Login SELECT error:", error.message);

          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        if (results.length === 0) {
          return res.status(401).json({
            success: false,
            message: "Invalid username/email or password"
          });
        }

        try {
          const user = results[0];

          const isMatch = await bcrypt.compare(
            String(password),
            user.password
          );

          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: "Invalid username/email or password"
            });
          }

          if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
              success: false,
              message: "Server configuration error"
            });
          }

          const token = jwt.sign(
            {
              id: user.id,
              username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          });
        } catch (loginError) {
          console.error(
            "Login processing error:",
            loginError.message
          );

          return res.status(500).json({
            success: false,
            message: "Unable to login"
          });
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  register,
  login
};
