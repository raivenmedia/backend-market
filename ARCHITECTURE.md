# 🏗️ MarketPlace Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                    (React + Vite + Tailwind)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Navbar      │  │  Auth Pages   │  │  Pages       │          │
│  │  Components  │  │  (Login/Reg)  │  │  (Cart/Ord)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Context API (State Management)                         │   │
│  │  ├── AuthContext (User & JWT)                          │   │
│  │  └── CartContext (Shopping Cart)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Service Layer (api.js)                            │   │
│  │  ├── productService                                    │   │
│  │  ├── orderService                                      │   │
│  │  └── adminService                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ (Axios)
                       │ JWT Token in Headers
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│                    (Express.js + CORS)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Route Handlers                                         │   │
│  │  ├── /api/auth      → authController                   │   │
│  │  ├── /api/products  → productController                │   │
│  │  ├── /api/cart      → cartController                   │   │
│  │  ├── /api/orders    → orderController                  │   │
│  │  └── /api/admin     → adminController                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                       │   │
│  │  ├── JWT Authentication                                │   │
│  │  ├── Authorization (Role-based)                        │   │
│  │  └── Input Validation                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ MongoDB Operations
                       │ (Mongoose ODM)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                    (MongoDB + Mongoose)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Users   │  │ Products │  │  Carts   │  │ Orders   │       │
│  │  Schema  │  │  Schema  │  │  Schema  │  │  Schema  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Collections (MongoDB)                                  │   │
│  │  ├── users                                              │   │
│  │  ├── products                                           │   │
│  │  ├── carts                                              │   │
│  │  └── orders                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER AUTHENTICATION FLOW
═════════════════════════

User Input (Email/Password)
    ↓
React Component (LoginPage)
    ↓
useAuth Hook
    ↓
API Service (axios POST /api/auth/login)
    ↓
Express Route (/api/auth/login)
    ↓
authController.login()
    ↓
User.matchPassword() (bcryptjs compare)
    ↓
JWT Token Generated
    ↓
Token returned to Frontend
    ↓
localStorage.setItem('token', token)
    ↓
AuthContext Updated
    ↓
User Logged In ✓


PRODUCT BROWSING FLOW
═════════════════════

Homepage Load
    ↓
API Service (axios GET /api/products)
    ↓
Express Route (/api/products)
    ↓
productController.getAllProducts()
    ↓
MongoDB Query (Product.find())
    ↓
Filter by search/category/price
    ↓
Return paginated results
    ↓
ProductCard Components Rendered
    ↓
User sees products ✓


SHOPPING FLOW
═════════════

Add to Cart
    ↓
useCart Hook
    ↓
API Service (axios POST /api/cart/add)
    ↓
Express Route (/api/cart/add)
    ↓
Middleware: protect (JWT validation)
    ↓
cartController.addToCart()
    ↓
MongoDB Cart.findOne() or Cart.create()
    ↓
Add item to cart.items array
    ↓
Calculate totals
    ↓
CartContext Updated
    ↓
User sees item in cart ✓


ORDER CREATION FLOW
═══════════════════

Checkout Button Click
    ↓
CartPage Component
    ↓
API Service (axios POST /api/orders)
    ↓
Express Route (/api/orders)
    ↓
Middleware: protect (JWT validation)
    ↓
orderController.createOrder()
    ↓
Order.create() with items from cart
    ↓
Stripe Payment Intent Created
    ↓
stripePaymentIntentId saved
    ↓
Order returned with clientSecret
    ↓
Stripe Modal Payment
    ↓
Payment confirmed
    ↓
orderController.completePayment()
    ↓
Payment status updated to 'completed'
    ↓
Cart cleared
    ↓
Order confirmed ✓
```

## Component Hierarchy

```
App.jsx
├── AuthProvider
│   └── CartProvider
│       ├── Navbar
│       │   └── Search, User Menu
│       └── Routes
│           ├── / (HomePage)
│           │   └── [ProductCard] ×n
│           ├── /product/:id (ProductDetailPage)
│           │   ├── Product Images
│           │   ├── Product Info
│           │   └── ReviewsSection
│           ├── /login (LoginPage)
│           ├── /register (RegisterPage)
│           ├── /cart (CartPage)
│           │   ├── CartItems
│           │   └── CheckoutForm
│           ├── /orders (OrdersPage)
│           │   └── [OrderCard] ×n
│           ├── /seller/products (SellerProductsPage)
│           │   ├── AddProductForm
│           │   └── [ProductCard] ×n
│           └── /admin (AdminDashboardPage)
│               ├── StatsCards
│               ├── UserTable
│               ├── ProductTable
│               └── OrderTable
```

## API Call Flow

```
Frontend                Backend                 Database
─────────               ───────                 ────────

GET /products
    ──────────────────────────►
                      productController
                      │
                      ├─► Product.find()
                      │        │
                      │        ├─► Query MongoDB
                      │        │
                      │        └─► Return documents
                      │
                      └─► Format response
    ◄────────────────────────
                      [Products Array]

User fills cart

POST /orders
+Auth Token
    ──────────────────────────►
                      Middleware: protect
                      (Verify JWT)
                      │
                      ├─► User ID extracted
                      │
                      ├─► orderController
                      │   │
                      │   ├─► Cart.findOne()
                      │   │
                      │   ├─► Order.create()
                      │   │    │
                      │   │    ├─► Create order document
                      │   │    │
                      │   │    └─► Return order with ID
                      │   │
                      │   └─► Stripe.createPaymentIntent()
                      │
                      └─► Format response
    ◄────────────────────────
                      [Order with clientSecret]
```

## Database Relationships

```
Users
├── 1 to Many → Products (seller)
├── 1 to Many → Carts (user)
├── 1 to Many → Orders (user)
└── 1 to Many → Reviews (user in reviews array)

Products
├── 1 to Many → Carts (items)
├── 1 to Many → Orders (items)
└── Many to Many → Users (reviews array)

Orders
├── Many to 1 → Users
├── Many to Many → Products
└── Many to Many → Users (sellers in items)
```

## Authentication & Security Flow

```
┌─────────────────────────────────────┐
│   1. User Registration              │
│   POST /api/auth/register           │
│   → Password hashed with bcrypt     │
│   → User saved to database          │
│   → JWT token generated             │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   2. User Login                     │
│   POST /api/auth/login              │
│   → Email lookup                    │
│   → Password comparison (bcrypt)    │
│   → JWT token generated             │
│   → Token sent to client            │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   3. Token Storage                  │
│   localStorage.setItem('token')     │
│   → Token persists across sessions  │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   4. Protected Request              │
│   GET /api/protected                │
│   Header: Authorization: Bearer ...│
│   → Middleware validates JWT       │
│   → User ID extracted               │
│   → Request allowed/denied          │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   5. Authorization Check            │
│   Check user.role                   │
│   ├─ buyer                          │
│   ├─ seller                         │
│   └─ admin                          │
│   → Route access granted/denied     │
└─────────────────────────────────────┘
```

## State Management

```
GLOBAL STATE (Context API)
══════════════════════════

AuthContext
├── user: Object
│   ├── id
│   ├── name
│   ├── email
│   └── role
├── token: String
├── isAuthenticated: Boolean
├── login(): Function
├── register(): Function
└── logout(): Function

CartContext
├── cart: Object
│   ├── items: Array
│   ├── totalPrice: Number
│   └── totalItems: Number
├── addToCart(): Function
├── removeFromCart(): Function
├── updateCartItem(): Function
└── clearCart(): Function

COMPONENT LOCAL STATE
═════════════════════

HomePage
├── products: Array
├── loading: Boolean
├── filter: Object
└── totalPages: Number

CartPage
├── shippingAddress: Object
├── loading: Boolean
└── formData: Object
```

## Deployment Architecture

```
┌──────────────────────────────────────┐
│   Client Browser (User)              │
│   http://marketplace.com             │
└──────────────┬───────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────┐
│   Frontend (Vercel/Netlify)          │
│   Static Files (React Build)         │
│   ├── index.html                     │
│   ├── js/app.bundle.js               │
│   └── css/styles.css                 │
└──────────────┬───────────────────────┘
               │ API Calls
               ▼
┌──────────────────────────────────────┐
│   Backend (Heroku/Railway/Render)    │
│   Express.js Server                  │
│   ├── Routes                         │
│   ├── Controllers                    │
│   ├── Middleware                     │
│   └── Services                       │
└──────────────┬───────────────────────┘
               │ Database Queries
               ▼
┌──────────────────────────────────────┐
│   Database (MongoDB Atlas)           │
│   Cloud MongoDB Instance             │
│   ├── Collections                    │
│   ├── Indexes                        │
│   └── Backups                        │
└──────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalable frontend with React
- ✅ RESTful API backend
- ✅ Secure JWT authentication
- ✅ Cloud database
- ✅ Separation of concerns
- ✅ Easy to test and maintain
