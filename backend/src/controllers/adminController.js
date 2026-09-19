const User = require("../models/User");
const Property = require("../models/Property");
const Report = require("../models/Report");
const Review = require("../models/Review");
const CompatibilityProfile = require("../models/CompatibilityProfile");

/**
 * GET /api/v1/admin/stats
 * Overview statistics for dashboard KPI cards and platform analytics
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalOwners,
      totalProperties,
      pendingOwners,
      pendingProperties,
      openReports,
      verifiedOwners,
      rejectedOwners,
      unsubmittedOwners,
      verifiedStudents,
      pendingStudents,
      verifiedProperties,
      rejectedProperties,
      totalReviews,
      totalReports,
      resolvedReports,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "owner" }),
      Property.countDocuments(),
      User.countDocuments({ role: "owner", verificationStatus: "pending" }),
      Property.countDocuments({ verificationStatus: "pending" }),
      Report.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "owner", verificationStatus: "verified" }),
      User.countDocuments({ role: "owner", verificationStatus: "rejected" }),
      User.countDocuments({ role: "owner", verificationStatus: "unsubmitted" }),
      User.countDocuments({ role: "student", verificationStatus: "verified" }),
      User.countDocuments({ role: "student", verificationStatus: "pending" }),
      Property.countDocuments({ verificationStatus: "verified" }),
      Property.countDocuments({ verificationStatus: "rejected" }),
      Review.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: "resolved" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalOwners,
        totalProperties,
        pendingOwners,
        pendingProperties,
        openReports,
        // Detailed analytics
        breakdown: {
          verifiedOwners,
          rejectedOwners,
          unsubmittedOwners,
          verifiedStudents,
          pendingStudents,
          verifiedProperties,
          rejectedProperties,
          totalReviews,
          totalReports,
          resolvedReports,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/users
 * List all registered students, owners, and admins with filters & search
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { role, verificationStatus, status, search } = req.query;
    const filter = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (verificationStatus && verificationStatus !== "all") {
      filter.verificationStatus = verificationStatus;
    }

    if (status && status !== "all") {
      filter.isActive = status === "active";
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { businessName: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/users/:id
 * Retrieve detailed user profile including owned properties or compatibility profile
 */
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let properties = [];
    let compatibilityProfile = null;
    let reviews = [];

    if (user.role === "owner") {
      properties = await Property.find({ owner: user._id }).sort({ createdAt: -1 });
    } else if (user.role === "student") {
      compatibilityProfile = await CompatibilityProfile.findOne({ user: user._id });
      reviews = await Review.find({ author: user._id }).populate("property", "title location");
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        properties,
        compatibilityProfile,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/users/:id
 * Verify, reject, update verification note, or toggle active status of a user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { verificationStatus, verificationNote, isActive } = req.body;
    const update = {};

    if (verificationStatus !== undefined) {
      const allowed = ["unsubmitted", "pending", "verified", "rejected"];
      if (!allowed.includes(verificationStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid verificationStatus. Allowed: ${allowed.join(", ")}`,
        });
      }
      update.verificationStatus = verificationStatus;
      update.isVerified = verificationStatus === "verified";
    }

    if (verificationNote !== undefined) {
      update.verificationNote = verificationNote;
    }

    if (isActive !== undefined) {
      update.isActive = Boolean(isActive);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/properties
 * List properties with optional verification status filter and search
 */
exports.getProperties = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.verificationStatus = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
        { "location.area": { $regex: q, $options: "i" } },
      ];
    }

    const properties = await Property.find(filter)
      .populate("owner", "firstName lastName email phone businessName verificationStatus isVerified city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/properties/:id
 * Retrieve single property details with owner info and reviews
 */
exports.getPropertyDetails = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "firstName lastName email phone businessName verificationStatus isVerified city profileImage"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const reviews = await Review.find({ property: property._id }).populate(
      "author",
      "firstName lastName email profileImage"
    );

    res.status(200).json({
      success: true,
      data: {
        property,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/properties/:id
 * Approve, reject, or update property verification status and rejection reason
 */
exports.updateProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason, isActive } = req.body;
    const update = {};

    if (status !== undefined) {
      const allowed = ["pending", "verified", "rejected"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid property verification status. Allowed: ${allowed.join(", ")}`,
        });
      }
      update.verificationStatus = status;
      if (status === "verified") {
        update.rejectionReason = null;
      }
    }

    if (rejectionReason !== undefined) {
      update.rejectionReason = rejectionReason;
    }

    if (isActive !== undefined) {
      update.isActive = Boolean(isActive);
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate("owner", "firstName lastName email phone businessName verificationStatus isVerified city");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Property verification status updated to ${property.verificationStatus}`,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/reviews
 * List reviews for moderation
 */
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("author", "firstName lastName email profileImage")
      .populate("property", "title location pricing propertyType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/reviews/:id
 * Moderate review visibility
 */
exports.moderateReview = async (req, res, next) => {
  try {
    const { isVisible } = req.body;
    if (isVisible === undefined) {
      return res.status(400).json({
        success: false,
        message: "isVisible boolean is required",
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { isVisible: Boolean(isVisible) } },
      { new: true }
    )
      .populate("author", "firstName lastName email")
      .populate("property", "title");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review is now ${review.isVisible ? "visible" : "hidden"}`,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/reports
 * List open and resolved reports
 */
exports.getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate("reporter", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: { reports },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/reports/:id
 * Resolve or dismiss reports
 */
exports.resolveReport = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;
    const update = {};

    if (status !== undefined) {
      const allowed = ["pending", "resolved", "rejected"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid report status. Allowed: ${allowed.join(", ")}`,
        });
      }
      update.status = status;
    }

    if (resolution !== undefined) {
      update.resolution = resolution;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).populate("reporter", "firstName lastName email role");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Report marked as ${report.status}`,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};
