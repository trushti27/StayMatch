const express = require("express");

const {
    getMe,
    updateMe
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);

router.put("/me", protect, updateMe);

module.exports = router;