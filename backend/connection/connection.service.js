// backend/connection/connection.service.js

const requests = [];


// =========================================================
// SEND CONNECTION REQUEST
// =========================================================

function sendConnectionRequest(senderId, receiverId) {

    // Prevent sending request to yourself
    if (senderId === receiverId) {
        return {
            success: false,
            message: "You cannot send a request to yourself."
        };
    }


    // Check whether request already exists
    const existingRequest = requests.find(
        request =>
            request.senderId === senderId &&
            request.receiverId === receiverId &&
            request.status === "pending"
    );


    if (existingRequest) {
        return {
            success: false,
            message: "Connection request already exists."
        };
    }


    const request = {

        requestId: `REQ${requests.length + 1}`,

        senderId,

        receiverId,

        status: "pending",

        createdAt: new Date()
    };


    requests.push(request);


    return {
        success: true,
        message: "Connection request sent.",
        request
    };
}


// =========================================================
// ACCEPT CONNECTION REQUEST
// =========================================================

function acceptConnectionRequest(requestId, receiverId) {

    const request = requests.find(
        request =>
            request.requestId === requestId &&
            request.receiverId === receiverId
    );


    if (!request) {

        return {
            success: false,
            message: "Connection request not found."
        };
    }


    if (request.status !== "pending") {

        return {
            success: false,
            message: "Request has already been processed."
        };
    }


    request.status = "accepted";

    request.respondedAt = new Date();


    return {
        success: true,
        message: "Connection request accepted.",
        request
    };
}


// =========================================================
// REJECT CONNECTION REQUEST
// =========================================================

function rejectConnectionRequest(requestId, receiverId) {

    const request = requests.find(
        request =>
            request.requestId === requestId &&
            request.receiverId === receiverId
    );


    if (!request) {

        return {
            success: false,
            message: "Connection request not found."
        };
    }


    if (request.status !== "pending") {

        return {
            success: false,
            message: "Request has already been processed."
        };
    }


    request.status = "rejected";

    request.respondedAt = new Date();


    return {
        success: true,
        message: "Connection request rejected.",
        request
    };
}


// =========================================================
// GET REQUESTS RECEIVED BY USER
// =========================================================

function getReceivedRequests(userId) {

    return requests.filter(
        request =>
            request.receiverId === userId
    );
}


// =========================================================
// GET SENT REQUESTS
// =========================================================

function getSentRequests(userId) {

    return requests.filter(
        request =>
            request.senderId === userId
    );
}


module.exports = {

    sendConnectionRequest,

    acceptConnectionRequest,

    rejectConnectionRequest,

    getReceivedRequests,

    getSentRequests
};