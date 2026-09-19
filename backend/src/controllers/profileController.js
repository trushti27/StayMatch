const CompatibilityProfile = require("../models/CompatibilityProfile");
const User = require("../models/User");

// ===============================
// CREATE OR UPDATE PROFILE (UPSERT)
// ===============================
const upsertProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Backend validation for Monthly Budget
        if (req.body.budget) {
            const min = Number(req.body.budget.min);
            const max = Number(req.body.budget.max);

            if (isNaN(min) || min < 500) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum monthly budget must be at least ₹500"
                });
            }

            if (isNaN(max) || min >= max) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum monthly budget must be strictly less than maximum budget"
                });
            }
        }

        const profile = await CompatibilityProfile.findOneAndUpdate(
            { user: userId },
            { $set: { ...req.body, user: userId } },
            { new: true, upsert: true, runValidators: true }
        );

        if (req.body.preferredLocations && req.body.preferredLocations.length > 0 && req.body.preferredLocations[0]) {
            await User.findByIdAndUpdate(userId, { $set: { city: req.body.preferredLocations[0] } });
        }

        res.status(200).json({
            success: true,
            message: "Compatibility profile saved successfully",
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};

// ===============================
// GET MY PROFILE
// ===============================
const getMyProfile = async (req, res, next) => {
    try {
        const profile = await CompatibilityProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Please complete your onboarding questionnaire."
            });
        }

        res.status(200).json({
            success: true,
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};

// ===============================
// GET CANDIDATE POOL (FOR LCI & EXPLORE)
// ===============================
const getPotentialRoommates = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;

        // Fetch other active students looking for roommates
        const candidates = await CompatibilityProfile.find({
            user: { $ne: currentUserId },
            isLookingForRoommate: true
        }).populate("user", "firstName lastName email phone profileImage isVerified");

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: { candidates }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upsertProfile,
    getMyProfile,
    getPotentialRoommates
};