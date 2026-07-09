const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Task Management API Running...");
});

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});