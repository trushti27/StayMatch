const User = require("../models/User");
const CompatibilityProfile = require("../models/CompatibilityProfile");

// GET CURRENT USER
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    profileImage: user.profileImage,
                    college: user.college,
                    course: user.course,
                    graduationYear: user.graduationYear,
                    city: user.city,
                    bio: user.bio,
                    businessName: user.businessName,
                    verificationStatus: user.verificationStatus,
                    verificationNote: user.verificationNote,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE CURRENT USER
const updateMe = async (req, res, next) => {
    try {
        const allowedFields = [
            "firstName",
            "lastName",
            "phone",
            "profileImage", "college", "course", "graduationYear", "city", "bio", "businessName", "verificationNote", "gender"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        if (req.user.role === "owner" && req.body.verificationNote) {
            updates.verificationStatus = "pending";
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        // If city is updated, sync CompatibilityProfile's preferredLocations
        if (updates.city) {
            await CompatibilityProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: { preferredLocations: [updates.city] } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getMe,
    updateMe
};
