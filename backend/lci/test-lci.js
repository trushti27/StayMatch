const {
    calculateCompatibility
} = require("./lci.engine");


const studentA = {

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


const studentB = {

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
};


const result =
    calculateCompatibility(studentA, studentB);


console.log(
    JSON.stringify(result, null, 2)
);