# Faaro Bookings

Faaro Bookings is a full-stack booking marketplace built with the MERN stack.

The platform allows customers to discover and book hotels, apartments, and rental cars. Business owners can manage their units and bookings, while administrators manage users, businesses, bookings, and refund requests.

## Features

### Customer

Customers can:

- Register and sign in
- Verify their email
- Reset forgotten passwords
- Browse hotels, apartments, and rental cars
- Search by category, location, and dates
- View unit details
- Create bookings
- Pay securely using Stripe Checkout
- View their bookings
- View booking details
- Request refunds
- Track refund requests
- Review businesses
- Manage their customer profile

### Business Owner

Business owners can:

- Access a dedicated business dashboard
- View their business profile
- Create units
- Update units
- Upload unit images
- Activate or deactivate units
- View confirmed bookings
- Search and filter bookings
- Verify customer bookings using booking codes
- View booking and customer information

Each business belongs to only one category:

- Hotel
- Car Rental
- Apartment

### Admin

Administrators can:

- View platform analytics
- View all users
- Suspend users
- Convert customers into business owners
- Create business profiles
- View businesses
- View bookings
- View refund requests
- Accept or reject refund requests

---

## Booking Flow

```text
Customer selects a unit
        ↓
Customer chooses start and end dates
        ↓
Booking is created
isValid = false
paymentStatus = unpaid
        ↓
Customer starts Stripe Checkout
        ↓
Payment succeeds
        ↓
Stripe webhook confirms payment
        ↓
Booking becomes valid
isValid = true
paymentStatus = paid
        ↓
Business owner can view and verify booking
```

Only successfully paid bookings become valid bookings.

---

## Refund Flow

```text
Customer opens a paid booking
        ↓
Customer submits refund request
        ↓
Refund status = pending
        ↓
Admin reviews request
        ↓
Accepted or Rejected
        ↓
Customer can track the request
```

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Zustand
- React Router
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- HTTP-only Refresh Token Cookies
- Stripe
- Cloudinary
- Multer
- UUID

---

## Authentication

Faaro uses access and refresh tokens.

### Access Token

The access token is stored in application memory and used for authenticated API requests.

### Refresh Token

The refresh token is stored inside an HTTP-only cookie.

When the access token expires, Axios automatically attempts to retrieve a new access token using:

```text
POST /api/auth/refresh
```

This avoids storing authentication tokens in `localStorage`.

---

## Roles

The system has three roles:

```text
customer
owner
admin
```

### Customer Routes

```text
/
 /explore
 /unit/:id
 /bookings
 /bookings/:id
 /bookings/:id/refund
 /refunds
 /refunds/:id
 /profile
```

### Business Owner Routes

```text
/business
/business/units
/business/bookings
/business/check-booking
/business/profile
```

### Admin Routes

```text
/admin
/admin/users
/admin/businesses
/admin/bookings
/admin/refunds
```

---

# Project Structure

```text
faaro-bookings/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── business/
│   │   │   └── dashboard/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# Database Collections

The main MongoDB collections include:

```text
users
businesses
units
bookings
reviews
refunds
```

## Users

Stores customer, business-owner, and administrator accounts.

## Businesses

Stores the business profile owned by a business owner.

A business can belong to only one category:

```text
hotel
car_rental
apartment
```

## Units

A unit represents the actual item customers reserve.

Examples:

```text
Hotel → Room
Car Rental → Car
Apartment → Entire Apartment
```

Unit details depend on the business category.

### Hotel

```js
{
  roomType,
  beds,
  capacity
}
```

### Car Rental

```js
{
  make,
  model,
  seats,
  plateNumber
}
```

### Apartment

```js
{
  bedrooms,
  bathrooms,
  maxGuests
}
```

## Bookings

Bookings contain information such as:

```text
customer
business
unit
booking code
start date
end date
price
payment status
booking validity
booking status
Stripe session
```

## Reviews

Customers can review units belonging to a business.

Ratings range from:

```text
1 - 5 stars
```

## Refunds

Refund requests contain:

```text
customer
booking
unit
reason
status
```

Current statuses:

```text
pending
accepted
rejected
```

---

# Third-Party Services

## Stripe

Stripe is used for secure booking payments.

The application listens for Stripe Checkout events and uses them to determine whether a booking should become valid.

## Cloudinary

Cloudinary stores images uploaded for:

- Businesses
- Units

## UUID

UUID is used to create unique booking and unit identifiers.

## MongoDB Atlas

MongoDB Atlas can be used as the hosted MongoDB database.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/faaro-bookings.git
```

Enter the project:

```bash
cd faaro-bookings
```

---

# Frontend Setup

Move into the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# Backend Setup

Open another terminal and enter:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Example:

```env
PORT=4000

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Add any email or SMS environment variables required by your backend.

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:4000
```

API:

```text
http://localhost:4000/api
```

---

# Main API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Customer

```http
GET  /api/customer/units
GET  /api/customer/units/:id

GET  /api/customer/businesses
GET  /api/customer/business/:id

POST /api/customer/booking
GET  /api/customer/bookings
GET  /api/customer/bookings/:id

POST /api/customer/payment
POST /api/customer/payment/success

POST /api/customer/reviews

GET  /api/customer/refund
GET  /api/customer/refund/:id
POST /api/customer/refund
```

## Business Owner

```http
GET    /api/business/profile

GET    /api/business/units
POST   /api/business/units
PATCH  /api/business/units/:id
DELETE /api/business/units/:id

GET  /api/business/booking
GET  /api/business/booking/:id

POST /api/business/check-booking
```

## Admin

```http
GET  /api/admin/users
GET  /api/admin/users/:id
GET  /api/admin/users/owners

POST /api/admin/users/suspend/:id
POST /api/admin/users/businessOwner/:id

GET   /api/admin/refund
GET   /api/admin/refund/:id
PATCH /api/admin/refund/:id

GET /api/admin/booking
GET /api/admin/booking/:id
```

---

# Stripe Webhook

Stripe webhook handling should be configured on the backend.

The application handles relevant Checkout events such as:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

Successful payment makes the booking valid.

Failed or expired payment should prevent an unpaid booking from becoming a confirmed reservation.

---

# Running Both Applications

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Environment Files

Never push `.env` files to GitHub.

Add them to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
*.log
```

You can instead create:

```text
client/.env.example
server/.env.example
```

with placeholder environment variables.

---

# GitHub

Example commands for the first push:

```bash
git init

git add .

git commit -m "Initial commit - Faaro Bookings MVP"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/faaro-bookings.git

git push -u origin main
```

---

# Project Status

Faaro Bookings is currently an MVP.

Core functionality implemented includes:

- Authentication
- Email verification
- Password recovery
- Three booking categories
- Customer bookings
- Stripe payments
- Business management
- Business booking verification
- Customer reviews
- Refund requests
- Admin dashboard
- Business-owner dashboard
- Customer profile

---

# Future Improvements

Possible future improvements include:

- Actual automated Stripe refund processing
- Business profile editing
- Customer profile editing
- Image deletion and replacement
- Advanced availability calendar
- Booking cancellation rules
- Favorites
- Notifications
- Pagination
- Advanced analytics
- Production deployment
- Automated testing

---

# Author

**Abdijabaar**

Full-Stack Developer

Built as a MERN Stack booking marketplace project.

---

# License

This project is intended for educational, internship, and portfolio purposes.
