const express = require("express");

const {
    rankCompatibleRoommates
} = require("./lci.engine");

const router = express.Router();


// Temporary candidate data
// Later this will come from MongoDB.

const students = [

    {
        id: "S002",
        name: "Rahul",

        cleanliness: "high",

        foodPreference: [
            "vegetarian"
        ],

        noisePreference: "quiet",

        sleepSchedule: "night owl",

        studyHabit: "night",

        smoking: "no",

        drinking: "no",

        nightCalls: "occasionally",

        windowPreference: "open"
    },

    {
        id: "S003",
        name: "Priya",

        cleanliness: "high",

        foodPreference: [
            "jain"
        ],

        noisePreference: "quiet",

        sleepSchedule: "night owl",

        studyHabit: "night",

        smoking: "no",

        drinking: "no",

        nightCalls: "no",

        windowPreference: "open"
    },

    {
        id: "S004",
        name: "Jay",

        cleanliness: "low",

        foodPreference: [
            "non-vegetarian"
        ],

        noisePreference: "moderate",

        sleepSchedule: "early bird",

        studyHabit: "morning",

        smoking: "occasionally",

        drinking: "occasionally",

        nightCalls: "occasionally",

        windowPreference: "closed"
    },

    {
        id: "S005",
        name: "Meera",

        cleanliness: "medium",

        foodPreference: [
            "vegetarian"
        ],

        noisePreference: "quiet",

        sleepSchedule: "night owl",

        studyHabit: "night",

        smoking: "no",

        drinking: "no",

        nightCalls: "no",

        windowPreference: "open"
    }
];


// =========================================================
// POST /api/lci/match
// =========================================================

router.post("/match", (req, res) => {

    try {

        const {
            studentId,
            preferences
        } = req.body;


        // -------------------------------
        // Basic validation
        // -------------------------------

        if (!studentId) {

            return res.status(400).json({
                success: false,
                message: "studentId is required."
            });
        }


        if (!preferences) {

            return res.status(400).json({
                success: false,
                message: "LCI preferences are required."
            });
        }


        // -------------------------------
        // Create target student
        // -------------------------------

        const targetStudent = {

            id: studentId,

            name: "Current Student",

            ...preferences
        };


        // -------------------------------
        // Find compatible roommates
        // -------------------------------

        const matches =
            rankCompatibleRoommates(
                targetStudent,
                students
            );


        // -------------------------------
        // Send response
        // -------------------------------

        return res.status(200).json({

            success: true,

            studentId,

            totalMatches: matches.length,

            matches
        });

    }

    catch (error) {

        console.error(
            "LCI matching error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to calculate roommate compatibility."
        });
    }
});


module.exports = router;