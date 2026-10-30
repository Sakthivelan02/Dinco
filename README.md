# 🛒 Dinco - Full-Stack MERN E-Commerce Application

Dinco is a modern, feature-rich full-stack e-commerce web application built with the MERN stack. It features robust user authentication, a dynamic product catalog with advanced search & filtering, an India-specific shipping checkout with state/district dropdowns, a ₹1 UPI Scan & Pay simulation, and automated HTML email notifications using Nodemailer.

---

## 🚀 Tech Stack

### **Frontend:**
* **React.js** (with Vite)
* **React Router v6** (for client-side routing)
* **CSS3 / Modern Styling**

### **Backend:**
* **Node.js** & **Express.js**
* **MongoDB & Mongoose** (Database & ODM)
* **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & Security)
* **Nodemailer** (Automated Email Notifications)

---

## ✨ Key Features

1. **User Authentication & Role Management:** Secure registration, login, and JWT-based session handling with Admin and Customer roles.
2. **Product Catalog & Search:** Browse products by categories, search by keywords, filter by price range, and sort dynamically.
3. **Cart & Inventory Management:** Add, update quantities, or remove items with live stock validation.
4. **India-Specific Checkout:** Seamless shipping address form integrated with Indian states and districts.
5. **UPI Scan & Pay Simulation:** Interactive ₹1 QR code payment option during checkout.
6. **Automated Order Emails:** Instant order confirmation emails sent to customers via Nodemailer featuring an itemized product breakdown table, grand total, and shipping address.
7. **Admin Dashboard:** Exclusive controls for admins to add, update, or delete products and manage customer orders.

---

## 📁 Project Structure

```text
mern-ecommerce/
│
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main router & layout setup
│   │   ├── main.jsx        # Entry point with BrowserRouter
│   │   ├── context.jsx     # Global state management
│   │   └── pages.jsx       # Views (Home, Products, Cart, Checkout, Admin, Auth)
│   └── package.json
│
├── server/                 # Backend Node.js & Express application
│   ├── src/
│   │   ├── index.js        # Server entry point & DB connection
│   │   ├── routes.js       # API endpoints (Auth, Products, Cart, Orders)
│   │   └── middleware.js   # JWT Auth & Admin guard middlewares
│   ├── utils/
│   │   └── email.js        # Nodemailer configuration & HTML templates
│   └── package.json
│
└── README.md
