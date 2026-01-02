# Karaama Restaurant - System Documentation

This document provides a comprehensive overview of the Karaama Restaurant Management System. It is designed to assist developers in understanding the architecture, database, and API endpoints for further development, including creating a mobile application.

## 1. System Overview

- **Backend**: Node.js & Express.js
- **Database**: PostgreSQL (Hosted on Neon DB)
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Image Storage**: Local Storage / Cloudinary (Hybrid support)

---

## 2. Database Schema (PostgreSQL)

### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique user ID |
| `username` | VARCHAR(50) | User's full name |
| `email` | VARCHAR(100) | Unique login email |
| `password` | TEXT | Bcrypt hashed password |
| `role` | VARCHAR(20) | admin, manager, staff, customer |
| `phone` | VARCHAR(20) | Optional |
| `address` | TEXT | Optional |

### `menu_items`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Item ID |
| `category` | VARCHAR(100) | Category name |
| `name` | VARCHAR(200) | Dish name |
| `price` | DECIMAL | Price in USD |
| `image_url` | TEXT | Path or Cloudinary URL |
| `availability`| BOOLEAN | Stocks status |
| `discount_percentage` | DECIMAL | Default 0 |

### `orders`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Order ID |
| `customer_id`| FK -> users | Purchaser |
| `total_amount`| DECIMAL | Total bill |
| `status` | VARCHAR(20) | Pending, Accepted, Preparing, Ready, Delivered, Cancelled |
| `order_type` | VARCHAR(20) | Dine-in, Takeaway, Delivery |
| `payment_status`| VARCHAR(20)| Unpaid, Paid |

---

## 3. API Endpoints

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Authentication (`/api/auth`)
- `POST /register`: { username, email, password }
- `POST /login`: { email, password } returns `{ token, user }`
- `GET /profile`: Get current user details (Protected)

### Customer Portal (`/api/customer`)
- `GET /menu`: Fetch visible categories and menu items.
- `POST /orders`: Place a new order. { items: [{id, quantity, price}], total_amount, order_type, address }
- `GET /my-orders`: Get order history for the logged-in user.
- `POST /reservations`: Book a table. { table_id, reservation_date, reservation_time, number_of_guests }
- `POST /reviews`: Submit feedback. { order_id, rating, comment }
- `PATCH /profile`: Update profile info.

### Admin/Manager Portal (`/api/admin`)
- `GET /stats`: Dashboard summary (Sales, Orders, Best selling).
- `GET /menu`: Manage items and categories.
- `POST /menu-items`: Create item (Supports Multipart/Form-Data for images).
- `PATCH /menu-items/:id`: Update item.
- `GET /orders`: Fetch all restaurant orders.
- `PATCH /orders/:id/status`: Update order status.
- `GET /staff`: View members.
- `POST /staff`: Add new staff.

---

## 4. Mobile App Integration (Prompt Guide)

If you are using this documentation to generate a mobile app with an AI (like ChatGPT or Claude), use this prompt:

> **Prompt Template:**
> "I want to build a mobile app (Flutter/React Native) for a Restaurant system. 
> The backend is already built using Node.js/Express and PostgreSQL. 
> 
> **Key requirements for the Mobile App:**
> 1. **Authentication**: Use JWT stored in secure storage. Endpoints: `/api/auth/login` and `/api/auth/register`.
> 2. **Menu Display**: Fetch data from `GET /api/customer/menu`. Group items by categories.
> 3. **Cart System**: Local state to manage items, then push to `POST /api/customer/orders`.
> 4. **Order History**: Display list from `GET /api/customer/my-orders`.
> 5. **Real-time**: Ideally use polling or WebSockets (currently polling suggested) to check order status updates from `Pending` to `Delivered`.
> 6. **Images**: Prepend the base server URL to `image_url` if the path starts with `/uploads/`.
> 
> Please generate the [Language] code for the [Feature Name] screen."

---

## 5. Deployment Instructions
- **Backend URL**: `http://localhost:5000` (Local) or your Render URL.
- **Environment Variables**: Ensure `DATABASE_URL`, `JWT_SECRET`, and Cloudinary keys are set in the server environment.
