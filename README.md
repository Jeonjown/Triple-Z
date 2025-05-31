````markdown
# Triple Z Coffee Shop Reservation System

An online reservation system built for **Triple Z Coffee Shop** to streamline event bookings, improve customer experience, and simplify administrative management.

---

## Table of Contents

1. [Background & Overview](#background--overview)
2. [Features](#features)

   * [User-Facing Features](#user-facing-features)
   * [Admin-Facing Features](#admin-facing-features)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)

   1. [Prerequisites](#prerequisites)
   2. [Clone the Repository](#clone-the-repository)
   3. [Environment Variables](#environment-variables)
   4. [Install Dependencies](#install-dependencies)
   5. [Database Setup](#database-setup)
   6. [Run the Application](#run-the-application)
5. [Usage Guide](#usage-guide)

   1. [User Workflow Step-by-Step](#user-workflow-step-by-step)
   2. [Admin Workflow Step-by-Step](#admin-workflow-step-by-step)
6. [Project Structure](#project-structure)


---

## Background & Overview

> **Before implementing this reservation system**, Triple Z Coffee Shop relied entirely on a manual process for booking events:
>
> 1. Customers walked into the store or sent a message via Facebook to inquire about available dates.
> 2. The owner consulted a paper schedule or physical board to check openings—time-consuming and error-prone.
> 3. During busy seasons, inquiries surged, leading to long wait times, occasional double-bookings, and unclear event limits.
> 4. Managing reservations became stressful and inefficient.

**With this online reservation system**:

1. Customers can instantly view open dates and book events in a few clicks.
2. Automated confirmations and calendar tracking eliminate manual errors.
3. Event limits and advance-booking rules are enforced in real time.
4. The owner can focus on running the business instead of juggling paper schedules.

---

## Features

### User-Facing Features

1. **User Registration & Login**

   * Sign up with email/password or log in using Google OAuth.
   * Access a personalized dashboard showing upcoming and past reservations.

2. **Intuitive Reservation Process**

   1. **Enter Event Details**

      * Provide name, contact info (email/phone), party size (minimum 25).
      * Specify event type and add special requests (dietary needs, themes, etc.).
      * Acknowledge corkage fee if bringing own food/beverage.
      * Click **“Next”** to proceed.
   2. **Check Available Dates**

      * View a large calendar showing only open slots (dates not booked).
      * System enforces:

        * **3 events per month** (default limit, adjustable by admin).
        * **2-week advance booking rule** (cannot book sooner than 14 days out).
      * Select an available date; click **“Next”**.
   3. **Choose a Package**

      * Browse pre-ordered menu packages.
      * Minimum order: **25 servings** (enter quantity).
      * Total cost is calculated automatically.
      * Click **“Next”**.
   4. **Review & Confirm**

      * Review event details, date, package, and cost.
      * Accept **Terms of Service**, then click **“Confirm Reservation.”**
      * A **payment link** appears (via PayMongo API) for secure checkout.
   5. **Receive Confirmation & Notifications**

      * On-screen confirmation with booking reference.
      * Email confirmation with all event details.
      * Real-time in-app notification when admin updates status (via Firebase Cloud Messaging).

3. **My Schedule & History**

   * **Upcoming Events**: View/edit/cancel future reservations.
   * **Past Reservations**: Archive of completed events.

4. **About Section**

   * Learn about Triple Z Coffee Shop’s mission, vision, history, and community partnerships.

5. **E-Menu Section**

   * Browse the shop’s complete food and beverage offerings (signature coffee blends, pastries, meals).

6. **Contact Section**

   * View shop’s contact details (address, phone, email).
   * Submit messages via a built-in contact form (emails delivered to Triple Z Gmail).
   * Interactive map for shop location.

7. **Live Chat**

   * Real-time chat widget for quick Q\&A between customers and staff.

---

### Admin-Facing Features

1. **Secure Admin Login**

   * Only users with an admin role can access the admin panel (email/password or Google OAuth).

2. **Dashboard Overview**

   * **Top Metrics Cards**:

     * Total registered users
     * Total reservations this month
     * New users this month
   * **Reservation Graphs**: Comparison of event vs. group bookings.
   * **Calendar View**: All reservations, color-coded by status.
   * **Printable Reports**: Generate PDF/CSV reports for selected date ranges.

3. **Manage Users**

   1. **View & Search**

      * Toggle between **List View** (table) and **Card View** for users.
      * Search by name, email, or user ID.
   2. **User Actions**

      * Promote/demote user to/from admin role.
      * Delete user accounts (with confirmation).

4. **Manage Menu**

   1. **View & Search**

      * Display all menu items in list or card format.
      * Filter by category (coffee, pastries, meals).
   2. **Availability Toggle**

      * Mark items as **Available** or **Unavailable** (updates in real time).
   3. **Add / Delete Items**

      * Add new menu items (name, description, price, image).
      * Delete items; changes reflect immediately on the user’s e-menu.

5. **Manage Blog**

   * Create, Edit, Delete blog posts via a WYSIWYG editor.
   * Published changes appear instantly on the public “Blog” page.

6. **Event Management**

   1. **View Reservations**

      * Toggle between **List View** and **Card View**.
      * Sort and filter by reservation status (Pending, Confirmed, Cancelled) and payment status.
   2. **Update Status**

      * Click a reservation → change its status or payment status → click **“Save.”**
      * Real-time notification pushed to user (via Firebase).
   3. **Reschedule**

      * Pick a new date (must follow 2-week advance rule) via date picker → click **“Reschedule.”**
      * Changes reflect immediately in user calendar.
   4. **Toggle Displayed Columns**

      * Choose which details (customer name, party size, package, etc.) appear in the table/card.
   5. **Search**

      * Quickly find reservations by customer name, ID, or date.

7. **Admin Live Chat**

   * View all active user conversations.
   * Send/receive real-time messages

8. **Website Configuration & Settings**

   1. **Opening Hours**

      * Edit shop’s daily opening and closing times; click **“Save”** to update landing page.
   2. **Reservation Policies**

      * Adjust **Monthly Event Limit** (default is 3).
      * Modify **Advance-Booking Rule** (default is 14 days).
      * Add/edit **Special Notices** or holiday blackout dates; click **“Save Policies.”**
   3. **Unavailable Dates**

      * Select dates (or date ranges) to block entirely; click **“Confirm.”**
      * Blocked dates immediately disappear from user calendar.

9. **Logout**

   * Click **“Logout”** in the top-right corner of the sidebar/user menu.

---

## Tech Stack

* **Frontend**

  * React.js + TypeScript (with Tailwind CSS)
  * React Router
  * React Hook Form + Yup (form handling & validation)
  * TanStack Query + Axios (data fetching & caching)
  * Socket.IO (real-time communications & chat)

* **Backend**

  * Node.js + Express
  * TypeScript
  * MongoDB (hosted on MongoDB Atlas)
  * Mongoose (ODM for schema definition & queries)
  * Passport.js (authentication)
  * BCrypt (password hashing)
  * Google OAuth (Passport strategy for Google login)
  * **PayMongo API** (secure payment processing)
  * **Google Cloud Storage (Buckets)** (storing and serving uploaded images)

* **Other Tools & Libraries**

  * Day.js (date manipulation)
  * Nodemailer (email confirmations)
  * React Calendar / FullCalendar (calendar UI)
  * Chart.js or Recharts (dashboard graphs)
  * **Firebase Cloud Messaging (FCM)** (push notifications to users)

---

## Installation & Setup

Follow these steps to get the project running locally (MongoDB only).

### 1. Prerequisites

1. **Node.js** v16+ and **npm** (or **yarn**) installed.
2. A **MongoDB Atlas** cluster or self-hosted MongoDB instance.
3. A Google Cloud Console project with OAuth 2.0 credentials for Google login.
4. A PayMongo account with API keys for payment integration.
5. A Google Cloud Storage bucket (with credentials/permissions) for storing images.
6. A Firebase project configured to use **Cloud Messaging** (FCM) with server credentials.
7. An SMTP service or credentials for sending confirmation emails (e.g., Gmail SMTP, SendGrid).

### 2. Clone the Repository

```bash
# Open terminal (macOS/Linux) or PowerShell (Windows)
git clone https://github.com/<your-username>/triplez-reservation-system.git
cd triplez-reservation-system
````

### 3. Environment Variables

1. In the project root, create a file named `.env`.

2. Add the following (replace placeholder values with your actual credentials):

   ```env
   # Server & Port
   PORT=5000

   # MongoDB connection URI
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/triplez?retryWrites=true&w=majority

   # JWT / Session Secret
   JWT_SECRET=your_jwt_secret_here

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

   # PayMongo API (Payments)
   PAYMONGO_PUBLIC_KEY=your_paymongo_public_key
   PAYMONGO_SECRET_KEY=your_paymongo_secret_key

   # Google Cloud Storage (Buckets)
   GCLOUD_PROJECT_ID=your_gcloud_project_id
   GCLOUD_CLIENT_EMAIL=your_service_account_email
   GCLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   GCLOUD_BUCKET_NAME=your_bucket_name

   # Firebase Cloud Messaging (FCM)
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_CLIENT_ID=your_firebase_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=your_firebase_client_cert_url

   # SMTP / Email Settings
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # Frontend (if separate)
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Save** the `.env` file.

### 4. Install Dependencies

1. **Backend** (in project root):

   ```bash
   npm install
   ```

2. **Frontend** (if you have a separate client folder; otherwise skip):

   ```bash
   cd client
   npm install
   cd ..
   ```

### 5. Database Setup

* **MongoDB (Mongoose)**

  1. Ensure your `.env` has a valid `MONGO_URI`.
  2. Mongoose will automatically create the required collections at runtime based on your schemas.
  3. No manual migrations are required.

### 6. Run the Application

1. **Start the Backend**

   ```bash
   npm run dev
   ```

   * This typically runs `nodemon src/server.ts`, which watches for file changes and restarts automatically.
   * Backend listens on `http://localhost:5000` by default.

2. **Start the Frontend** (if separate)

   ```bash
   cd client
   npm start
   ```

   * This starts the React dev server on `http://localhost:3000`.
   * Ensure `REACT_APP_API_URL` in `.env` is `http://localhost:5000/api`.

3. **Verify**

   * Open `http://localhost:3000` in your browser (or `http://localhost:5000` if frontend is served by Express).
   * You should see the **Triple Z Coffee Shop** landing page.

---

## Usage Guide

Below are step-by-step instructions for both regular users (customers) and admins.

### User Workflow Step-by-Step

1. **Visit Landing Page**

   * Go to `http://localhost:3000` in your browser.
   * The homepage displays the coffee shop’s highlights, mission, and navigation links.

2. **Create an Account or Log In**

   1. Click **“Log In”** in the navbar.
   2. Choose **“Continue with Google”** or fill in email/password.
   3. On successful login, you land on your **User Dashboard**.

3. **Browse Sections**

   * **About**: Learn about the shop’s mission and story.
   * **E-Menu**: Browse menu items (coffee, pastries, meals).
   * **Contact**: Send a message via the contact form or view the interactive map.
   * **Blog**: Read latest blog posts (if available).

4. **Make a Reservation**

   1. Click **“Make a Reservation”** (calendar icon or navbar).
   2. **Step 1: Fill in Event Details**

      * Enter name, contact info, party size (≥25), event type, and special requests.
      * Check corkage fee if applicable.
      * Click **“Next”**.
   3. **Step 2: Select Date & Time**

      * Large calendar shows only open slots.
      * Must book at least **14 days in advance**; max **3 events per month** by default.
      * Select an available date, then click **“Next”**.
   4. **Step 3: Choose Package**

      * Browse package options; minimum order **25 servings**.
      * Total cost updates automatically.
      * Click **“Next”**.
   5. **Step 4: Review & Confirm**

      * Review all details and cost.
      * Accept **Terms of Service** checkbox, then click **“Confirm Reservation.”**
      * You’re redirected to a payment page powered by **PayMongo**.
   6. **Payment & Confirmation**

      * Complete payment via PayMongo’s secure checkout.
      * Receive an on-screen confirmation and a confirmation email with details.
      * In-app notification appears if the admin updates your reservation status (via Firebase Cloud Messaging).

5. **My Schedule & History**

   1. Click **“My Schedule”** in the navbar.
   2. **Upcoming Events**:

      * View event cards with status.
      * Click **“Cancel”** to cancel (subject to policy).
   3. **Past Reservations**:

      * Click **“History”** to view all completed events.

6. **Live Chat Interaction**

   * Click the **Chat icon** (bottom corner).
   * Type a message (e.g., “Can I reschedule my booking?”).
   * Admin staff respond in real time.

---

### Admin Workflow Step-by-Step

1. **Log In as Admin**

   * Log in with admin-authorized credentials.
   * You land on the **Admin Dashboard**.

2. **Dashboard Overview**

   * **Top Metrics Cards** show total users, reservations this month, new users this month.
   * **Reservation Graph** compares event vs. group booking counts.
   * **Calendar View** displays all reservations, color-coded by status.
   * Click **“Generate Report”** to download a PDF/CSV for a custom date range.

3. **Manage Users**

   1. Click **“Users”** in the sidebar.
   2. Toggle between **List View** (table) and **Card View**.
   3. Use the **Search bar** to filter by name, email, or ID.
   4. **Promote/Demote**: Click ⋮ menu → **“Make Admin”** or **“Remove Admin”**.
   5. **Delete**: Click trash icon and confirm removal.

4. **Manage Menu**

   1. Click **“Menu”** in the sidebar.
   2. Toggle between **List** and **Card** views.
   3. Filter items by category (coffee, pastries, meals).
   4. **Add Item**: Click **“+ Add Item”**, fill in name, description, price, image, then **“Save.”**
   5. **Delete Item**: Click the trash icon on a menu card.
   6. **Toggle Availability**: Switch **Available/Unavailable**; updates immediately.

5. **Manage Blog Posts**

   1. Click **“Blog”** in the sidebar.
   2. **Add Post**: Click **“+ New Post”**, enter title/body (WYSIWYG), upload image, then **“Publish.”**
   3. **Edit/Delete**: Hover a post → click **“Edit”** or **“Delete.”**

6. **Event Management**

   1. Click **“Events”** (or **“Reservations”**) in the sidebar.
   2. Toggle between **List View** and **Card View**.
   3. Filter by reservation status (Pending, Confirmed, Cancelled) or payment status.
   4. **Update Status**: Click a reservation → change status → click **“Save.”**
   5. **Reschedule Event**: Click calendar icon, pick new date (must follow 14-day rule), then **“Reschedule.”**
   6. **Toggle Columns**: Click **“Columns”** to select which fields (e.g., party size, package) appear.
   7. **Search**: Enter customer name, reservation ID, or date in search bar.

7. **Admin Live Chat**

   * Click **“Chat”** in the sidebar.
   * View all active conversations, send messages, mark as **“Resolved”** or **“Escalated.”**

8. **Website Configuration & Settings**

   1. Click **“Settings”** in the sidebar.
   2. **Opening Hours**:

      * Edit daily opening/closing times.
      * Click **“Save”** to update landing page.
   3. **Reservation Policies**:

      * Modify **Monthly Event Limit** (default 3).
      * Change **Advance-Booking Rule** (default 14 days).
      * Add/edit **Special Notices** or holiday blackout dates; click **“Save Policies.”**
   4. **Unavailable Dates**:

      * Click **“Add Unavailable Date.”**
      * Select date (or range) to block; click **“Confirm.”**
      * Blocked dates immediately disappear from user calendar.

9. **Logout**

   * Click **“Logout”** in the top-right corner of the sidebar/user menu.

---

## Project Structure

```
triplez-reservation-system/
├── frontend/                     # React frontend (if separate)
│   ├── public/                 
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components (Home, Login, Dashboard, etc.)
│   │   ├── services/           # API calls (Axios wrappers)
│   │   ├── contexts/           # React Contexts (AuthContext, AdminContext)
│   │   ├── hooks/              # Custom React hooks (useAuth, useReservation)
│   │   ├── styles/             # Tailwind configuration
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
│
├── backend/                     # Node/Express backend
│   ├── src/
│   │   ├── controllers/        # Route handlers (reservationController, userController, etc.)
│   │   ├── models/             # Mongoose schemas (User, Reservation, Menu, BlogPost, etc.)
│   │   ├── routes/             # Express route definitions (auth, reservations, admin, etc.)
│   │   ├── middlewares/        # Auth middleware, error handler, etc.
│   │   ├── utils/              # Email service (Nodemailer), Socket.IO utils, PayMongo helper, GC Storage helper, Firebase helper
│   │   ├── config/             # Database config (Mongoose), Passport (Google), environment variables
│   │   ├── server.ts           # App entrypoint (Express server setup, route mounting)
│   │   └── socket.ts           # Socket.IO configuration (real-time notifications & chat)
│   └── package.json
│
├── .env.example                # Example of required environment variables
└── README.md                   # This file
```

---

> *Thank you for checking out the Triple Z Coffee Shop Reservation System! We hope this README helps you understand how to set up, use, and contribute. If you have questions or feedback, please open an issue or reach out via the Contact section in the app.*

```
```
