const User = require("../models/User");


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
            "profileImage"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

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