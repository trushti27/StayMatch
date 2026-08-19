const mongoose = require("mongoose");

const compatibilityProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        // Academic & College Context
        collegeName: {
            type: String,
            required: [true, "College name is required"],
            trim: true
        },
        course: {
            type: String,
            trim: true
        },
        graduationYear: {
            type: Number
        },

        // Lifestyle Factors (Categorical / Scaled 1-5 for LCI algorithms)
        sleepSchedule: {
            type: String,
            enum: ["early_bird", "night_owl", "flexible"],
            required: true
        },
        cleanliness: {
            type: Number,
            min: 1,
            max: 5,
            required: true // 1: Relaxed, 5: Neat freak
        },
        studyHabit: {
            type: String,
            enum: ["complete_silence", "light_music", "group_study", "flexible"],
            required: true
        },
        socialHabit: {
            type: Number,
            min: 1,
            max: 5,
            required: true // 1: Complete introvert/quiet, 5: Frequent host/extrovert
        },
        dietaryPreference: {
            type: String,
            enum: ["vegetarian", "non_vegetarian", "vegan", "eggetarian", "no_preference"],
            required: true
        },
        smoking: {
            type: Boolean,
            required: true
        },
        drinking: {
            type: Boolean,
            required: true
        },
        petFriendly: {
            type: Boolean,
            default: false
        },

        // Housing Preferences
        budget: {
            min: {
                type: Number,
                required: true,
                min: 0
            },
            max: {
                type: Number,
                required: true
            }
        },
        preferredLocations: [
            {
                type: String,
                trim: true
            }
        ],
        preferredRoomType: {
            type: String,
            enum: ["single", "double", "triple", "any"],
            default: "any"
        },

        // Matching Status
        isLookingForRoommate: {
            type: Boolean,
            default: true,
            index: true
        },
        bio: {
            type: String,
            maxlength: 300,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CompatibilityProfile", compatibilityProfileSchema);