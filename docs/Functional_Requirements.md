# Functional Requirements

## 1. Authentication Module

### FR-1.1 User Registration

The system shall allow students and property owners to register using:

- Full Name
- Email Address
- Password
- User Role (Student or Property Owner)

### FR-1.2 User Login

The system shall allow registered users to log in using their email and password.

### FR-1.3 User Logout

The system shall allow users to securely log out of the application.

### FR-1.4 Password Security

The system shall securely store passwords using encryption techniques.

### FR-1.5 Session Management

The system shall authenticate and authorize users using JWT-based authentication.

---

# 2. Student Profile Module

### FR-2.1 Profile Creation

The system shall allow students to create and manage their profiles.

### FR-2.2 Profile Information

The student profile shall contain:

- Name
- Profile Picture
- Gender
- Age
- College Name
- Course
- Preferred Location
- Budget Range
- Lifestyle Preferences

### FR-2.3 Profile Update

The system shall allow students to update their profile information.

---

# 3. Property Owner Module

### FR-3.1 Owner Profile

The system shall allow property owners to create and manage their profiles.

### FR-3.2 Profile Information

The owner profile shall contain:

- Name
- Contact Information
- Profile Picture
- Address

---

# 4. Accommodation Listing Module

### FR-4.1 Create Listing

The system shall allow property owners to create accommodation listings.

### FR-4.2 Listing Details

Each listing shall contain:

- Property Name
- Description
- Address
- Location
- Rent Amount
- Room Type
- Amenities
- Images
- Availability Status

### FR-4.3 Update Listing

The system shall allow property owners to update listings.

### FR-4.4 Delete Listing

The system shall allow property owners to remove listings.

### FR-4.5 View Listings

The system shall allow students to view accommodation listings.

---

# 5. Search and Filter Module

### FR-5.1 Search Listings

The system shall allow users to search listings by:

- Location
- Property Name

### FR-5.2 Filter Listings

The system shall allow users to filter listings by:

- Budget
- Amenities
- Room Type
- Gender Preference
- Availability

### FR-5.3 Sort Listings

The system shall allow users to sort listings by:

- Price
- Ratings
- Newest Listings

---

# 6. Favorites Module

### FR-6.1 Save Listing

The system shall allow students to save listings as favorites.

### FR-6.2 Remove Favorite

The system shall allow students to remove listings from favorites.

### FR-6.3 View Favorites

The system shall allow students to view all saved listings.

---

# 7. Review and Rating Module

### FR-7.1 Submit Review

The system shall allow students to submit reviews and ratings.

### FR-7.2 View Reviews

The system shall allow users to view reviews and ratings.

### FR-7.3 Edit Review

The system shall allow students to edit their reviews.

### FR-7.4 Delete Review

The system shall allow students to delete their reviews.

---

# 8. Roommate Compatibility Module

### FR-8.1 Questionnaire

The system shall provide a lifestyle preference questionnaire.

### FR-8.2 Store Responses

The system shall store questionnaire responses.

### FR-8.3 Calculate Compatibility

The system shall calculate the Living Compatibility Index (LCI).

### FR-8.4 Display Compatibility Score

The system shall display compatibility scores between students.

### FR-8.5 Match Students

The system shall recommend compatible roommates.

---

# 9. Recommendation Module

### FR-9.1 Personalized Recommendations

The system shall provide personalized accommodation recommendations.

### FR-9.2 Recommendation Factors

Recommendations shall be generated based on:

- Budget
- Preferred Location
- Amenities
- Ratings
- Compatibility Preferences

---

# 10. Chat Module

### FR-10.1 Student-Owner Chat

The system shall allow students to communicate with property owners.

### FR-10.2 Student-Student Chat

The system shall allow students to communicate with potential roommates.

### FR-10.3 Real-Time Messaging

The system shall support real-time messaging.

---

# 11. Admin Module

### FR-11.1 User Management

The system shall allow administrators to:

- View users
- Block users
- Delete users

### FR-11.2 Listing Management

The system shall allow administrators to:

- View listings
- Verify listings
- Remove inappropriate listings

### FR-11.3 Review Moderation

The system shall allow administrators to remove inappropriate reviews.

### FR-11.4 Dashboard

The system shall provide platform statistics and analytics.

---

# 12. Notification Module (Optional)

### FR-12.1 Message Notifications

The system shall notify users about new messages.

### FR-12.2 System Notifications

The system shall notify users about important updates and account activities.
