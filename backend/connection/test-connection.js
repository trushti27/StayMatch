const {

    sendConnectionRequest,

    acceptConnectionRequest,

    rejectConnectionRequest,

    getReceivedRequests,

    getSentRequests

} = require("./connection.service");


// =========================================================
// STUDENT A SENDS REQUEST TO STUDENT B
// =========================================================

console.log("\n===== SEND REQUEST =====\n");

const requestResult =
    sendConnectionRequest(
        "S001",
        "S002"
    );

console.log(requestResult);


// =========================================================
// STUDENT B CHECKS RECEIVED REQUESTS
// =========================================================

console.log("\n===== RECEIVED REQUESTS =====\n");

const receivedRequests =
    getReceivedRequests("S002");

console.log(receivedRequests);


// =========================================================
// STUDENT B ACCEPTS REQUEST
// =========================================================

console.log("\n===== ACCEPT REQUEST =====\n");

const requestId =
    requestResult.request.requestId;

const acceptResult =
    acceptConnectionRequest(
        requestId,
        "S002"
    );

console.log(acceptResult);


// =========================================================
// CHECK SENT REQUESTS
// =========================================================

console.log("\n===== SENT REQUESTS =====\n");

const sentRequests =
    getSentRequests("S001");

console.log(sentRequests);