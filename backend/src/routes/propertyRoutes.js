const express = require("express");

const {
    createProperty,
    listProperties,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    contactOwner,
    uploadVerificationDocument
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", listProperties);
router.post("/:id/contact", protect, authorize("student"), contactOwner);

// =====================================
// CREATE PROPERTY
// POST /api/v1/properties
// Owner only (supports multipart with verification document)
// =====================================
router.post(
    "/",
    protect,
    authorize("owner"),
    upload.single("document"),
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
// UPLOAD VERIFICATION DOCUMENT SPECIFICALLY
// POST /api/v1/properties/:id/verification-document
// Owner only
// =====================================
router.post(
    "/:id/verification-document",
    protect,
    authorize("owner"),
    upload.single("document"),
    uploadVerificationDocument
);

// =====================================
// UPDATE PROPERTY
// PUT /api/v1/properties/:id
// Owner only (supports multipart with verification document)
// =====================================
router.put(
    "/:id",
    protect,
    authorize("owner"),
    upload.single("document"),
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
