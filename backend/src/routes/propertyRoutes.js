const express = require("express");

const {
    createProperty,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// CREATE PROPERTY
// POST /api/v1/properties
// Owner only
// =====================================

router.post(
    "/",
    protect,
    authorize("owner"),
    createProperty
);


// =====================================
// GET MY PROPERTIES
// GET /api/v1/properties/my
// Owner only
// =====================================

router.get(
    "/my",
    protect,
    authorize("owner"),
    getMyProperties
);


// =====================================
// UPDATE PROPERTY
// PUT /api/v1/properties/:id
// Owner only
// =====================================

router.put(
    "/:id",
    protect,
    authorize("owner"),
    updateProperty
);


// =====================================
// DELETE PROPERTY
// DELETE /api/v1/properties/:id
// Owner only
// =====================================

router.delete(
    "/:id",
    protect,
    authorize("owner"),
    deleteProperty
);


// =====================================
// GET PROPERTY BY ID
// GET /api/v1/properties/:id
// Public
// =====================================

router.get(
    "/:id",
    getPropertyById
);


module.exports = router;