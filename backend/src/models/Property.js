const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        // ===============================
        // OWNER
        // ===============================
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // ===============================
        // BASIC INFORMATION
        // ===============================
        title: {
            type: String,
            required: [true, "Property title is required"],
            trim: true,
            minlength: 5,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Property description is required"],
            trim: true,
            minlength: 20,
            maxlength: 2000
        },

        propertyType: {
            type: String,
            enum: [
                "PG",
                "Hostel",
                "Apartment",
                "Flat",
                "Room",
                "House"
            ],
            required: true
        },

        // ===============================
        // LOCATION
        // ===============================
        location: {
            address: {
                type: String,
                required: true,
                trim: true
            },

            area: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true,
                index: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            },

            latitude: {
                type: Number,
                min: -90,
                max: 90
            },

            longitude: {
                type: Number,
                min: -180,
                max: 180
            }
        },

        // ===============================
        // PRICING
        // ===============================
        pricing: {
            monthlyRent: {
                type: Number,
                required: true,
                min: 0
            },

            securityDeposit: {
                type: Number,
                required: true,
                min: 0
            }
        },

        // ===============================
        // ACCOMMODATION
        // ===============================
        accommodation: {
            roomType: {
                type: String,
                enum: [
                    "1-sharing",
                    "2-sharing",
                    "3-sharing",
                    "4-sharing",
                    "5+-sharing"
                ],
                required: true
            },

            totalRooms: {
                type: Number,
                required: true,
                min: 1
            },

            availableRooms: {
                type: Number,
                required: true,
                min: 0
            }
        },

        // ===============================
        // PREFERENCE
        // ===============================
        preferences: {
            genderPreference: {
                type: String,
                enum: [
                    "male",
                    "female",
                    "any"
                ],
                default: "any"
            }
        },

        // ===============================
        // AMENITIES
        // ===============================
        amenities: {
            type: [String],
            default: []
        },

        // ===============================
        // IMAGES
        // ===============================
        images: [
            {
                url: {
                    type: String,
                    required: true
                },

                publicId: {
                    type: String,
                    default: null
                }
            }
        ],

        // ===============================
        // PROPERTY RULES
        // ===============================
        rules: {
            type: [String],
            default: []
        },

        // ===============================
        // VERIFICATION
        // ===============================
        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending",
            index: true
        },

        // ===============================
        // ACTIVE STATUS
        // ===============================
        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);


// =====================================
// VALIDATION
// Available rooms cannot exceed total rooms
// =====================================

propertySchema.pre("validate", function (next) {
    if (
        this.accommodation &&
        this.accommodation.availableRooms >
        this.accommodation.totalRooms
    ) {
        return next(
            new Error(
                "Available rooms cannot exceed total rooms"
            )
        );
    }

    next();
});


module.exports = mongoose.model(
    "Property",
    propertySchema
);