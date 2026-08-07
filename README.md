# Smart Food Donation System

A full-stack MERN application that connects food donors with verified NGOs to reduce food waste and improve food accessibility.

The platform enables restaurants, hotels, bakeries, event organizers, and individuals to donate surplus food, while verified NGOs can browse available donations, request food, and coordinate pickups through a simple and structured workflow.

---

## Project Overview

Every day, large quantities of perfectly edible food are wasted by restaurants, hotels, caterers, bakeries, and event organizers, while many NGOs struggle to arrange meals for people in need.

The Smart Food Donation System provides a centralized platform that bridges this gap by allowing verified food donors and NGOs to connect efficiently. The system simplifies donation management, request handling, and food distribution through dedicated donor and NGO portals.

The project focuses on reducing food waste, improving food accessibility, and creating a transparent donation process using modern web technologies.

## Problem Statement

Food wastage is a significant social and environmental challenge. Although large quantities of surplus food are generated daily, there is often no efficient mechanism to connect food donors with organizations that can distribute it before it expires.

Current challenges include:

- Lack of a centralized donation platform
- Difficulty connecting nearby donors and NGOs
- Manual coordination through phone calls and messaging
- Poor visibility of available food donations
- Limited tracking of donation requests and status
- Food expiring before it reaches beneficiaries

## Solution

The Smart Food Donation System provides a digital platform where:

- Food donors can create and manage food donations.
- Verified NGOs can browse available donations.
- NGOs can request donations directly through the platform.
- Donors can review and manage incoming requests.
- Donation status is tracked throughout the donation lifecycle.
- Both donors and NGOs have dedicated dashboards for managing activities.

## Features

### Authentication

- Secure user registration and login using JWT authentication.
- Role-based access for Donors and NGOs.
- Forgot Password and Reset Password functionality.

### Donor Module

- Dashboard with donation statistics.
- Create food donations.
- View and manage donations.
- Track incoming donation requests.
- View donation history.
- Manage donor profile.
- Reports and impact summary.
- Notification support.
- Help & Support.
- Account settings.

### NGO Module

- Dashboard with request statistics.
- Browse available food donations.
- Request food donations.
- View request details.
- Track request history.
- Manage NGO profile.
- Reports dashboard.
- Notification support.
- Help & Support.
- Account settings.

### Donation Management

- Donation status tracking.
- Request management workflow.
- Donation history.
- Detailed donation information.
- Pickup scheduling.
- Food category management.

### Additional Features

- Responsive user interface.
- Role-based protected routes.
- Modular component architecture.
- RESTful API integration.

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Nodemailer

### Development Tools

- Git & GitHub
- VS Code
- Postman

## Project Architecture

```
Client (React + Vite)
        │
        │ REST API
        ▼
Node.js + Express.js
        │
        ▼
MongoDB Database
```

The application follows a modular MERN architecture with clearly separated frontend and backend layers. Role-based routing and dedicated modules for Donors and NGOs improve maintainability and scalability.

## Project Structure

```
Smart-Food-Donation-System
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── public
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/KushalBerad/Smart-Food-Donation-System.git
```

```bash
cd Smart-Food-Donation-System
```

---

### Backend Setup

```bash
cd backend
npm install
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173
```

> Replace all values with your own local configuration.

## Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## User Roles

### Donor

- Register and login
- Create food donations
- Manage donations
- View NGO requests
- Track donation status
- View donation history
- Manage profile
- View reports

---

### NGO

- Register and login
- Browse available donations
- Request food
- Track request status
- View request history
- Manage profile
- View reports

## API Overview

### Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Donations

```
POST   /api/v1/donations/create
GET    /api/v1/donations
GET    /api/v1/donations/:id
```

### Requests

```
POST   /api/v1/requests
GET    /api/v1/requests
PATCH  /api/v1/requests/:id
```

### Profiles

```
GET    /api/v1/donor/profile
PUT    /api/v1/donor/profile

GET    /api/v1/ngo/profile
PUT    /api/v1/ngo/profile
```

## Future Enhancements

- Partial donation allocation
- Real-time notifications
- Live donation tracking
- Integrated maps for pickup
- Image upload for donations
- Food expiry prediction
- Admin dashboard
- Analytics and insights
- Mobile application

## License

This project is developed for educational purposes and academic learning.

Feel free to fork, explore, and build upon the project with appropriate attribution.

