# Smart Food Donation System

## Project Structure

This document defines the folder structure and coding conventions for the project.

Every contributor should follow this structure before creating new files or folders.

This folder structure is considered FINAL.

Do not create new folders or change the structure without discussing it with the project lead.

---

# Frontend Structure

frontend/
│
├── public/
│
├── src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
│
├── components/
│   ├── auth/
│   ├── donor/
│   ├── ngo/
│   ├── donation/
│   ├── notification/
│   ├── shared/
│   └── common/
│
├── pages/
│   ├── auth/
│   ├── donor/
│   ├── ngo/
│   └── shared/
│
├── layouts/
│
├── routes/
│
├── services/
│
├── context/
│
├── hooks/
│
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css

---

# Backend Structure

backend/
│
├── config/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── services/
│
├── uploads/
│
├── utils/
│
├── app.js
└── server.js

---

# Pages

Authentication

- Login
- Register
- Donor Register
- NGO Register
- Forgot Password

Donor

- Dashboard
- Create Donation
- My Donations
- Donation Details
- Manage Requests
- Request Details
- History
- Profile

NGO

- Dashboard
- Browse Donations
- Donation Details
- My Requests
- Request Details
- Daily Requirement
- History
- Profile

Shared

- Notifications
- Reports
- Help & Support
- Settings

---

# Rules

## 1. One Page = One File

Every page must have its own file.

Example

pages/auth/Login.jsx

Do NOT place multiple pages inside App.jsx.

---

## 2. Reusable Components

Reusable UI belongs inside components/.

Examples

- Buttons
- Inputs
- Cards
- Modals
- Navbar
- Sidebar

---

## 3. Routing

All routes must be defined inside

routes/AppRoutes.jsx

Do not create routing inside page components.

---

## 4. API Calls

All API requests must be written inside

services/

Pages should never call axios directly.

---

## 5. Layouts

Authentication pages use

AuthLayout

Donor pages use

DonorLayout

NGO pages use

NgoLayout

---

## 6. Assets

Images

assets/images/

Icons

assets/icons/

Logo

assets/logo/

---

## 7. Naming Convention

React Components

PascalCase

Example

Login.jsx

CreateDonation.jsx

AuthButton.jsx

Service Files

camelCase

Example

authService.js

donationService.js

requestService.js

---

## 8. Keep Components Small

If a component becomes too large, split it into smaller reusable components.

---

## 9. No Duplicate Files

Before creating a new file,

check whether a similar component already exists.

Reuse existing components whenever possible.

---

## 10. Keep the Project Clean

Do not keep

- unused files
- unused images
- commented code
- test code
- Vite starter code

inside the project.

---