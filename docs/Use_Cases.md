# Use Cases

## Actors

The system has three primary actors:

1. Student
2. Property Owner
3. Administrator

---

# Student Use Cases

## UC-1: Register

**Actor:** Student

**Description:** Create a new account on the platform.

**Precondition:** User is not registered.

**Postcondition:** Student account is created.

**Flow:**

1. Open registration page.
2. Enter required details.
3. Submit registration form.
4. System validates information.
5. Account is created.

---

## UC-2: Login

**Actor:** Student

**Description:** Log in to the system.

**Precondition:** Student account exists.

**Postcondition:** Student is authenticated.

**Flow:**

1. Enter email and password.
2. Click Login.
3. System validates credentials.
4. Dashboard is displayed.

---

## UC-3: Manage Profile

**Actor:** Student

**Description:** Update profile information.

**Precondition:** Student is logged in.

**Postcondition:** Profile is updated.

---

## UC-4: Search Accommodation

**Actor:** Student

**Description:** Search and filter accommodation listings.

**Precondition:** Listings exist.

**Postcondition:** Matching listings are displayed.

---

## UC-5: View Listing Details

**Actor:** Student

**Description:** View complete property information.

**Precondition:** Listing exists.

**Postcondition:** Property details are displayed.

---

## UC-6: Save Favorite Listings

**Actor:** Student

**Description:** Add or remove listings from favorites.

**Precondition:** Student is logged in.

**Postcondition:** Favorites are updated.

---

## UC-7: Submit Lifestyle Questionnaire

**Actor:** Student

**Description:** Fill out the compatibility questionnaire.

**Precondition:** Student is logged in.

**Postcondition:** Responses are saved.

---

## UC-8: View Roommate Matches

**Actor:** Student

**Description:** View compatible roommate recommendations.

**Precondition:** Questionnaire has been completed.

**Postcondition:** Compatibility scores are displayed.

---

## UC-9: Chat with Users

**Actor:** Student

**Description:** Communicate with property owners and potential roommates.

**Precondition:** Student is logged in.

**Postcondition:** Messages are exchanged.

---

## UC-10: Submit Reviews and Ratings

**Actor:** Student

**Description:** Review accommodations.

**Precondition:** Student is logged in.

**Postcondition:** Review is stored.

---

# Property Owner Use Cases

## UC-11: Register

**Actor:** Property Owner

**Description:** Create a new owner account.

---

## UC-12: Login

**Actor:** Property Owner

**Description:** Access owner dashboard.

---

## UC-13: Manage Profile

**Actor:** Property Owner

**Description:** Update profile details.

---

## UC-14: Create Listing

**Actor:** Property Owner

**Description:** Add a new accommodation listing.

**Precondition:** Owner is logged in.

**Postcondition:** Listing is created.

---

## UC-15: Update Listing

**Actor:** Property Owner

**Description:** Modify listing information.

---

## UC-16: Delete Listing

**Actor:** Property Owner

**Description:** Remove a listing.

---

## UC-17: View Reviews

**Actor:** Property Owner

**Description:** View ratings and reviews of properties.

---

## UC-18: Chat with Students

**Actor:** Property Owner

**Description:** Communicate with interested students.

---

# Administrator Use Cases

## UC-19: Login

**Actor:** Administrator

**Description:** Access admin dashboard.

---

## UC-20: Manage Users

**Actor:** Administrator

**Description:** View, block, or delete users.

---

## UC-21: Verify Listings

**Actor:** Administrator

**Description:** Approve or reject accommodation listings.

---

## UC-22: Moderate Reviews

**Actor:** Administrator

**Description:** Remove inappropriate reviews.

---

## UC-23: View Dashboard

**Actor:** Administrator

**Description:** View platform statistics and analytics.

---

# System Use Cases

## UC-24: Calculate Living Compatibility Index (LCI)

**Actor:** System

**Description:** Calculate compatibility scores between students.

---

## UC-25: Generate Recommendations

**Actor:** System

**Description:** Generate personalized accommodation recommendations.

---

## UC-26: Send Notifications

**Actor:** System

**Description:** Notify users about important activities and messages.
