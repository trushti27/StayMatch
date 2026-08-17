const {
    rankCompatibleRoommates
} = require("./lci.engine");


const targetStudent = {

    id: "S001",
    name: "Student A",

    cleanliness: "high",

    foodPreference: [
        "vegetarian",
        "jain"
    ],

    noisePreference: "quiet",

    sleepSchedule: "night owl",

    studyHabit: "night",

    smoking: "no",

    drinking: "no",

    nightCalls: "no",

    windowPreference: "open"
};


const students = [

    {
        id: "S002",
        name: "Rahul",

        cleanliness: "high",

        foodPreference: ["vegetarian"],

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

        foodPreference: ["jain"],

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

        foodPreference: ["non-vegetarian"],

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

        foodPreference: ["vegetarian"],

        noisePreference: "quiet",

        sleepSchedule: "night owl",

        studyHabit: "night",

        smoking: "no",

        drinking: "no",

        nightCalls: "no",

        windowPreference: "open"
    }
];


const rankedMatches =
    rankCompatibleRoommates(
        targetStudent,
        students
    );


console.log(
    "\n===== ROOMMATE MATCHES =====\n"
);


rankedMatches.forEach(
    (match, index) => {

        console.log(
            `${index + 1}. ${match.name} - ${match.compatibilityScore}%`
        );

        console.log(
            `   Matches: ${match.matchedFactors.join(", ")}`
        );

        console.log(
            `   Conflicts: ${
                match.potentialConflicts.length > 0
                    ? match.potentialConflicts.join(", ")
                    : "None"
            }`
        );

        console.log("");
    }
);