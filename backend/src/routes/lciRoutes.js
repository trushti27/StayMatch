const express = require("express");

const { findMatches } = require("../controllers/lciController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();


// POST /api/v1/lci/match

router.get("/matches", protect, authorize("student"), findMatches);


module.exports = router;
