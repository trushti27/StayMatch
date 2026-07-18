# System Architecture

## Overview

StayMatch follows a three-tier web application architecture built using the MERN stack. The architecture separates the user interface, business logic, and data storage into independent layers, making the application easier to maintain, test, and scale.

---

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology**

- React.js
- Tailwind CSS
- React Router
- Axios

**Responsibilities**

- User authentication
- Dashboard
- Property browsing
- Search and filtering
- Roommate matching interface
- Chat interface
- Review management
- Profile management

---

### 2. Application Layer (Backend)

**Technology**

- Node.js
- Express.js

**Responsibilities**

- REST API development
- Business logic
- Authentication & authorization
- Living Compatibility Index (LCI) calculation
- Recommendation engine
- Chat handling (Socket.IO)
- Image upload management

---

### 3. Data Layer

**Technology**

- MongoDB Atlas
- Mongoose ODM

**Collections**

- Users
- Listings
- Reviews
- Favorites
- Compatibility Responses
- Messages
- Notifications

---

## External Services

### Cloudinary

Stores:

- Property images
- User profile images

### Socket.IO

Provides:

- Real-time messaging
- Instant chat updates

### JWT

Provides:

- Secure authentication
- Protected API access

---

## System Flow

Users
(Student / Property Owner / Admin)

↓

React Frontend

↓

Axios HTTP Requests

↓

Express REST API

↓

Business Logic

↓

Mongoose ODM

↓

MongoDB Atlas

↓

Stored Data

---

## Advantages

- Modular architecture
- Easy maintenance
- Scalable design
- Secure authentication
- Cloud-based storage
- Real-time communication support

                    +-------------------------+
                    |         Users           |
                    | Student | Owner | Admin|
                    +-----------+-------------+
                                |
                                ▼
                     Web Browser / Mobile Browser
                                |
                                ▼
                  +-----------------------------+
                  |       React Frontend        |
                  |-----------------------------|
                  | Login • Dashboard • Search  |
                  | Listings • Chat • Reviews   |
                  +-------------+---------------+
                                |
                          Axios (REST API)
                                |
                                ▼
              +--------------------------------------+
              |      Node.js + Express Backend       |
              |--------------------------------------|
              | Authentication (JWT)                |
              | User Management                     |
              | Listing Management                  |
              | Recommendation Engine              |
              | LCI Calculator                     |
              | Review Management                  |
              | Socket.IO Chat                     |
              +------------------+------------------+
                                 |
                             Mongoose ODM
                                 |
                                 ▼
                   +-----------------------------+
                   |      MongoDB Atlas          |
                   |-----------------------------|
                   | Users                       |
                   | Listings                    |
                   | Reviews                     |
                   | Favorites                   |
                   | Messages                    |
                   | Questionnaire Responses     |
                   +-----------------------------+
                                 |
                                 ▼
                       Cloudinary Storage
                 (Property & Profile Images)
