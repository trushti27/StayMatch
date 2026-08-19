const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();


// ===============================
// GLOBAL MIDDLEWARE
// ===============================

app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "StayMatch API is running"
    });
});


// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/users",
    userRoutes
);


// ===============================
// 404
// ===============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


module.exports = app;