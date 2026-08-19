const express = require("express");

const {
    findMatches
} = require("../controllers/lciController");

const router = express.Router();


// POST /api/v1/lci/match

router.post(
    "/match",
    findMatches
);


module.exports = router;