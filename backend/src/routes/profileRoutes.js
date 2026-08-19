const express = require("express");
const router = express.Router();
const {
    upsertProfile,
    getMyProfile,
    getPotentialRoommates
} = require("../controllers/profileController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Restrict these operations to students
router.use(protect);
router.use(authorize("student", "admin"));

router.put("/", upsertProfile);
router.get("/me", getMyProfile);
router.get("/candidates", getPotentialRoommates);

module.exports = router;