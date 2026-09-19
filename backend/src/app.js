const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const lciRoutes = require("./routes/lciRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const featureRoutes = require("./routes/featureRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ===============================
// GLOBAL MIDDLEWARE
// ===============================

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

app.use(
    "/api/v1/profiles",
    profileRoutes
);

app.use(
    "/api/v1/lci",
    lciRoutes
);

app.use(
    "/api/v1/properties",
    propertyRoutes
);

app.use("/api/v1/favorites", featureRoutes.favorites);
app.use("/api/v1/reviews", featureRoutes.reviews);
app.use("/api/v1/connections", featureRoutes.connections);
app.use("/api/v1/chats", featureRoutes.chats);
app.use("/api/v1/reports", featureRoutes.reports);
app.use("/api/v1/admin", adminRoutes);

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
