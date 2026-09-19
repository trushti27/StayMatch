const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Strict security: all admin routes require authentication AND admin role
router.use(protect, authorize("admin"));

// 1. Dashboard Stats
router.get("/stats", adminController.getAdminStats);

// 2. User Management & Verification
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserDetails);
router.patch("/users/:id", adminController.updateUser);

// 3. Property Management & Verification
router.get("/properties", adminController.getProperties);
router.get("/properties/:id", adminController.getPropertyDetails);
router.patch("/properties/:id", adminController.updateProperty);

// 4. Reviews Moderation
router.get("/reviews", adminController.getReviews);
router.patch("/reviews/:id", adminController.moderateReview);

// 5. Reports Handling
router.get("/reports", adminController.getReports);
router.patch("/reports/:id", adminController.resolveReport);

module.exports = router;
