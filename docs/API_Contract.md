# StayMatch API Contract

## Project

## StayMatch – Student Housing & Roommate Compatibility Platform

# API Conventions

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

Protected APIs require JWT Token.

Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# Authentication APIs

---

## Register User

### Endpoint

```
POST /auth/register
```

### Description

Registers a new student or property owner.

### Request

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "Password@123",
  "role": "student"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

### Endpoint

```
POST /auth/login
```

### Request

```json
{
  "email": "rahul@gmail.com",
  "password": "Password@123"
}
```

### Success Response

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "_id": "userId",
    "fullName": "Rahul Sharma",
    "role": "student"
  }
}
```

---

## Get Logged-in User

### Endpoint

```
GET /auth/profile
```

Authentication Required

✅ Yes

---

# User APIs

---

## Get User Profile

### Endpoint

```
GET /users/:id
```

Authentication Required

✅ Yes

---

## Update User Profile

### Endpoint

```
PUT /users/:id
```

### Request

```json
{
  "fullName": "Rahul Sharma",
  "phone": "9876543210",
  "bio": "Computer Engineering Student"
}
```

Authentication Required

✅ Yes

---

# Property Listing APIs

---

## Create Listing

### Endpoint

```
POST /listings
```

Authentication Required

✅ Yes (Owner)

### Request

```json
{
  "title": "ABC PG",
  "description": "Fully furnished PG",
  "rent": 6000,
  "location": "Ahmedabad",
  "gender": "Male",
  "roomType": "Shared"
}
```

---

## Get All Listings

### Endpoint

```
GET /listings
```

Supports Query Parameters

```
location

rent

gender

roomType
```

---

## Get Listing Details

### Endpoint

```
GET /listings/:id
```

---

## Update Listing

### Endpoint

```
PUT /listings/:id
```

Authentication Required

✅ Yes (Owner)

---

## Delete Listing

### Endpoint

```
DELETE /listings/:id
```

Authentication Required

✅ Yes (Owner)

---

# Favorite APIs

---

## Add Favorite

### Endpoint

```
POST /favorites/:listingId
```

Authentication Required

✅ Yes

---

## Remove Favorite

### Endpoint

```
DELETE /favorites/:listingId
```

Authentication Required

✅ Yes

---

## Get Favorite Listings

### Endpoint

```
GET /favorites
```

Authentication Required

✅ Yes

---

# Review APIs

---

## Add Review

### Endpoint

```
POST /reviews
```

Authentication Required

✅ Yes

### Request

```json
{
  "listingId": "listingId",
  "rating": 5,
  "review": "Excellent accommodation."
}
```

---

## Get Reviews

### Endpoint

```
GET /reviews/:listingId
```

---

# Questionnaire APIs

---

## Submit Questionnaire

### Endpoint

```
POST /questionnaire
```

Authentication Required

✅ Yes

### Request

```json
{
  "sleepSchedule": "Early",
  "cleanliness": 5,
  "smoking": false,
  "drinking": false,
  "studyHabit": "Night",
  "guestPreference": "Occasionally",
  "noiseTolerance": 3
}
```

---

## Update Questionnaire

### Endpoint

```
PUT /questionnaire
```

Authentication Required

✅ Yes

---

## Get Questionnaire

### Endpoint

```
GET /questionnaire/me
```

Authentication Required

✅ Yes

---

# Living Compatibility Index (LCI) APIs

---

## Get Compatibility Score

### Endpoint

```
GET /lci/:userId
```

Authentication Required

✅ Yes

### Success Response

```json
{
  "success": true,
  "compatibility": 87
}
```

---

## Get Recommended Roommates

### Endpoint

```
GET /lci/matches
```

Authentication Required

✅ Yes

---

# Chat APIs

---

## Get All Chats

### Endpoint

```
GET /chats
```

Authentication Required

✅ Yes

---

## Get Chat Messages

### Endpoint

```
GET /chats/:chatId/messages
```

Authentication Required

✅ Yes

---

# Socket.IO Events

---

## Client Events

```
joinChat

leaveChat

sendMessage

typing

stopTyping
```

---

## Server Events

```
receiveMessage

userJoined

userLeft

messageDelivered
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

# Version

API Version: v1.0
