# Software Requirements Specification (SRS)

# StayMatch

### Student Housing and Roommate Compatibility Decision Support Platform

**Version:** 1.0

**Project Type:** Final Year Major Project

**Department:** Bachelor of Engineering (Computer Engineering)

---

# Table of Contents

1. Introduction
2. Overall Description
3. System Features
4. External Interface Requirements
5. Functional Requirements
6. Non-Functional Requirements
7. Assumptions and Dependencies
8. Future Scope

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for StayMatch, a web-based student housing and roommate compatibility platform.

The document serves as a reference for the development team, project guide, and evaluators by clearly describing the system's objectives, scope, features, and expected behavior.

---

## 1.2 Project Overview

StayMatch is designed to simplify the accommodation search process for students relocating to new cities for higher education. The platform helps students discover verified accommodations, find compatible roommates using a Living Compatibility Index (LCI), and make informed housing decisions through personalized recommendations and verified reviews.

---

## 1.3 Objectives

The primary objectives of StayMatch are:

- Provide verified accommodation listings.
- Match students with compatible roommates.
- Recommend suitable accommodations.
- Improve housing decision-making.
- Facilitate communication between users.
- Ensure a secure and user-friendly experience.

---

# 2. Overall Description

## 2.1 Product Perspective

StayMatch is a web-based application consisting of:

- Student Portal
- Property Owner Portal
- Admin Portal

The system follows a client-server architecture where the frontend communicates with the backend through REST APIs, and real-time communication is handled using Socket.IO.

---

## 2.2 Product Functions

The platform provides the following major functionalities:

- User Authentication
- Profile Management
- Accommodation Listings
- Search & Filters
- Living Compatibility Index (LCI)
- Roommate Matching
- Recommendations
- Favorites
- Reviews & Ratings
- Chat
- Admin Dashboard

---

## 2.3 User Classes

### Student

- Search accommodation
- Find roommates
- Save favorites
- Write reviews
- Chat

### Property Owner

- Manage listings
- Respond to students
- View reviews

### Administrator

- Verify listings
- Manage users
- Moderate reviews

---

# 3. System Features

The major modules include:

## Authentication Module

- Registration
- Login
- Logout

## Student Module

- Profile Management
- Search
- Favorites
- Roommate Matching

## Owner Module

- Listing Management
- Property Images
- Communication

## Compatibility Module

- Lifestyle Questionnaire
- LCI Calculation
- Match Generation

## Reviews Module

- Ratings
- Reviews

## Chat Module

- Student ↔ Owner
- Student ↔ Student

## Admin Module

- User Management
- Listing Verification
- Dashboard

---

# 4. External Interface Requirements

## User Interface

- Responsive web application
- Modern dashboard
- Mobile-friendly layout

## Software Interface

Frontend:

- React.js
- Tailwind CSS

Backend:

- Node.js
- Express.js

Database:

MongoDB Atlas
Mongoose ODM

Authentication:

- JWT
- BCrypt

Cloud Services:

- Cloudinary
- Neon PostgreSQL

Deployment:

- Vercel
- Render

---

# 5. Functional Requirements

The system shall:

- Allow user registration and login.
- Manage student and owner profiles.
- Manage accommodation listings.
- Search and filter listings.
- Calculate Living Compatibility Index.
- Recommend roommates.
- Recommend accommodations.
- Save favorite listings.
- Submit reviews and ratings.
- Enable real-time chat.
- Allow administrators to manage the platform.

---

# 6. Non-Functional Requirements

The system shall provide:

- Secure authentication
- Responsive user interface
- High availability
- Fast response time
- Modular architecture
- Browser compatibility
- Data privacy
- Scalability
- Maintainability

---

# 7. Assumptions and Dependencies

## Assumptions

- Users have internet access.
- Property owners provide accurate information.
- Students provide honest lifestyle preferences.
- Administrators verify reported content.

## Dependencies

- MongoDB Database
- Cloudinary
- Socket.IO
- Internet Connectivity

---

# 8. Future Scope

Future enhancements may include:

- AI-powered recommendations
- Google OAuth
- Mobile applications
- Online booking
- Rent payment integration
- Push notifications
- Fraud detection
- Advanced analytics

---

# Conclusion

StayMatch aims to provide students with a reliable, secure, and intelligent platform for discovering accommodation and compatible roommates. The system combines recommendation techniques, compatibility analysis, and verified property information to improve the overall housing search experience.
