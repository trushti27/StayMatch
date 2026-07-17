# Non-Functional Requirements

## 1. Performance Requirements

### NFR-1.1 Response Time

The system should respond to user requests within 2–3 seconds under normal operating conditions.

### NFR-1.2 Concurrent Users

The system should support multiple users accessing the platform simultaneously without significant performance degradation.

### NFR-1.3 Database Performance

The system should efficiently handle search queries, filtering, and compatibility calculations.

---

# 2. Security Requirements

### NFR-2.1 Authentication

The system shall use secure authentication mechanisms using JWT.

### NFR-2.2 Password Security

User passwords shall be encrypted using BCrypt hashing.

### NFR-2.3 Authorization

Users shall only access resources and functionalities according to their assigned roles.

### NFR-2.4 Data Protection

Sensitive user information shall not be exposed to unauthorized users.

### NFR-2.5 Input Validation

All user inputs shall be validated to prevent invalid or malicious data.

---

# 3. Reliability Requirements

### NFR-3.1 System Availability

The system should be available at all times except during maintenance periods.

### NFR-3.2 Error Handling

The system should provide meaningful error messages and prevent application crashes.

### NFR-3.3 Data Integrity

The system shall ensure consistency and accuracy of stored data.

---

# 4. Usability Requirements

### NFR-4.1 User-Friendly Interface

The system should provide an intuitive and easy-to-use interface.

### NFR-4.2 Easy Navigation

Users should be able to access major features with minimal effort.

### NFR-4.3 Responsive Design

The application should function properly on desktops, tablets, and mobile devices.

---

# 5. Scalability Requirements

### NFR-5.1 Future Expansion

The system should support the addition of new features without major architectural changes.

### NFR-5.2 Increased User Base

The system should be capable of handling an increasing number of users and listings.

---

# 6. Maintainability Requirements

### NFR-6.1 Modular Design

The application should follow a modular architecture to simplify maintenance and future enhancements.

### NFR-6.2 Code Readability

The codebase should follow consistent naming conventions and coding standards.

### NFR-6.3 Documentation

The project should be properly documented to simplify future development and maintenance.

---

# 7. Compatibility Requirements

### NFR-7.1 Browser Compatibility

The application should work correctly on modern web browsers such as:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

### NFR-7.2 Operating Systems

The system should be accessible from Windows, Linux, and macOS.

---

# 8. Availability Requirements

### NFR-8.1 Deployment

The system should be deployed online and accessible via the internet.

### NFR-8.2 Backup

Database backups should be possible to prevent accidental data loss.

---

# 9. Privacy Requirements

### NFR-9.1 User Data Privacy

The system should protect personal information and display only necessary profile information to other users.

### NFR-9.2 Secure Communication

Communication between users and the server should use HTTPS in the deployed environment.

---

# 10. Portability Requirements

### NFR-10.1 Deployment Flexibility

The system should be deployable on cloud platforms such as:

- Vercel
- Render
- Neon PostgreSQL
