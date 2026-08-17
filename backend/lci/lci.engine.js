// backend/lci/lci.engine.js

const LCI_WEIGHTS = {
    cleanliness: 15,
    foodPreference: 20,
    noisePreference: 15,
    sleepSchedule: 15,
    studyHabit: 10,
    smoking: 5,
    drinking: 5,
    nightCalls: 5,
    windowPreference: 10
};


function compareValues(valueA, valueB) {
    if (!valueA || !valueB) return 0;

    valueA = valueA.toLowerCase();
    valueB = valueB.toLowerCase();

    if (valueA === valueB) {
        return 1;
    }

    return 0;
}


function cleanlinessScore(a, b) {
    const levels = {
        low: 1,
        medium: 2,
        high: 3
    };

    if (!levels[a] || !levels[b]) return 0;

    const difference = Math.abs(levels[a] - levels[b]);

    if (difference === 0) return 1;
    if (difference === 1) return 0.5;

    return 0;
}


function foodScore(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return 0;
    }

    const foodA = a.map(x => x.toLowerCase());
    const foodB = b.map(x => x.toLowerCase());

    const common = foodA.filter(item => foodB.includes(item));

    if (common.length > 0) {
        return 1;
    }

    if (
        (foodA.includes("jain") && foodB.includes("vegetarian")) ||
        (foodB.includes("jain") && foodA.includes("vegetarian"))
    ) {
        return 0.8;
    }

    return 0;
}


function noiseScore(a, b) {
    if (!a || !b) return 0;

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === "flexible" || b === "flexible") {
        return 1;
    }

    if (a === b) {
        return 1;
    }

    if (
        (a === "quiet" && b === "moderate") ||
        (a === "moderate" && b === "quiet")
    ) {
        return 0.5;
    }

    return 0;
}


function sleepScore(a, b) {
    return compareValues(a, b);
}


function studyScore(a, b) {
    if (!a || !b) return 0;

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === "flexible" || b === "flexible") {
        return 1;
    }

    if (a === b) {
        return 1;
    }

    return 0;
}


function lifestyleScore(a, b) {
    if (!a || !b) return 0;

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === b) {
        return 1;
    }

    if (
        (a === "no" && b === "occasionally") ||
        (a === "occasionally" && b === "no")
    ) {
        return 0.5;
    }

    return 0;
}


function smokingScore(a, b) {
    return lifestyleScore(a, b);
}


function drinkingScore(a, b) {
    return lifestyleScore(a, b);
}


function nightCallsScore(a, b) {
    return lifestyleScore(a, b);
}


function windowScore(a, b) {
    if (!a || !b) return 0;

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === "flexible" || b === "flexible") {
        return 1;
    }

    if (a === b) {
        return 1;
    }

    return 0;
}


function calculateCompatibility(studentA, studentB) {

    const factorScores = {

        cleanliness:
            cleanlinessScore(
                studentA.cleanliness,
                studentB.cleanliness
            ),

        foodPreference:
            foodScore(
                studentA.foodPreference,
                studentB.foodPreference
            ),

        noisePreference:
            noiseScore(
                studentA.noisePreference,
                studentB.noisePreference
            ),

        sleepSchedule:
            sleepScore(
                studentA.sleepSchedule,
                studentB.sleepSchedule
            ),

        studyHabit:
            studyScore(
                studentA.studyHabit,
                studentB.studyHabit
            ),

        smoking:
            smokingScore(
                studentA.smoking,
                studentB.smoking
            ),

        drinking:
            drinkingScore(
                studentA.drinking,
                studentB.drinking
            ),

        nightCalls:
            nightCallsScore(
                studentA.nightCalls,
                studentB.nightCalls
            ),

        windowPreference:
            windowScore(
                studentA.windowPreference,
                studentB.windowPreference
            )
    };


    let weightedScore = 0;

    for (const factor in LCI_WEIGHTS) {
        weightedScore +=
            factorScores[factor] *
            LCI_WEIGHTS[factor];
    }


    const compatibilityScore =
        Math.round(weightedScore);


    const matchedFactors = [];
    const potentialConflicts = [];

    for (const factor in factorScores) {

        if (factorScores[factor] === 1) {
            matchedFactors.push(factor);

        } else if (factorScores[factor] < 0.5) {
            potentialConflicts.push(factor);
        }
    }


    return {
        compatibilityScore,
        factorScores,
        matchedFactors,
        potentialConflicts
    };
}


function rankCompatibleRoommates(targetStudent, students) {

    const results = [];

    for (const student of students) {

        // Don't compare a student with themselves
        if (student.id === targetStudent.id) {
            continue;
        }

        const result = calculateCompatibility(
            targetStudent,
            student
        );

        results.push({
            studentId: student.id,
            name: student.name,
            compatibilityScore: result.compatibilityScore,
            matchedFactors: result.matchedFactors,
            potentialConflicts: result.potentialConflicts
        });
    }

    // Highest compatibility first
    results.sort(
        (a, b) =>
            b.compatibilityScore -
            a.compatibilityScore
    );

    return results;
}

module.exports = {
    calculateCompatibility,
    rankCompatibleRoommates
};