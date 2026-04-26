# MarketPlace - Full Stack E-Commerce Application

A complete full-stack marketplace web application similar to Amazon/eBay/Alibaba built with modern technologies.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)

## ✨ Features

### 1. User System
- User registration and login
- JWT-based authentication
- Three user roles: Buyer, Seller, Admin
- User profile management
- Password hashing with bcrypt

### 2. Product Management
- Sellers can add, edit, and delete products
- Product images support
- Category-based organization
- Inventory management
- Product reviews and ratings

### 3. Shopping Cart
- Add/remove items from cart
- Update item quantities
- Real-time cart total calculations
- Cart persistence

### 4. Orders & Checkout
- Order creation from cart
- Shipping address management
- Order status tracking
- Payment integration (Stripe)
- Order history

### 5. Payment System
- Stripe integration (test mode)
- Payment intent creation
- Payment status tracking
- Secure payment processing

### 6. Admin Dashboard
- View all users
- View all products
- Monitor all orders
- Remove inappropriate listings
- Dashboard statistics

### 7. Search & Filter
- Full-text product search
- Filter by category
- Price range filtering
- Pagination support

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing

## 📁 Project Structure

```
marketplace/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   └── admin.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── stripe.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── SellerProductsPage.jsx
    │   │   └── AdminDashboardPage.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useCart.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🚀 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/marketplace
PORT=5000
JWT_SECRET=your_secure_secret_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## ⚙️ Configuration

### MongoDB Setup

#### Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

#### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Stripe Setup

1. Create account at https://stripe.com
2. Go to Developers > API Keys
3. Copy Secret Key and Publishable Key
4. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### JWT Configuration

Generate a secure secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `JWT_SECRET` in `.env` with the generated key.

## 🏃 Running the Application

### Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Routes

#### Register
```
POST /api/auth/register
Body: { name, email, password, role: 'buyer'|'seller' }
Response: { success, token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: 'Bearer token' }
Response: { success, user }
```

#### Update Profile
```
PUT /api/auth/profile
Headers: { Authorization: 'Bearer token' }
Body: { name, phone, bio, address }
Response: { success, user }
```

### Product Routes

#### Get All Products
```
GET /api/products?search=&category=&minPrice=&maxPrice=&page=1
Response: { success, products, total, pages }
```

#### Get Product by ID
```
GET /api/products/:id
Response: { success, product }
```

#### Create Product (Seller)
```
POST /api/products
Headers: { Authorization: 'Bearer token' }
Body: { title, description, price, category, images, stock }
Response: { success, product }
```

#### Update Product (Seller)
```
PUT /api/products/:id
Headers: { Authorization: 'Bearer token' }
Body: { title, description, price, category, images, stock }
Response: { success, product }
```

#### Delete Product (Seller)
```
DELETE /api/products/:id
Headers: { Authorization: 'Bearer token' }
Response: { success, message }
```

#### Add Review
```
POST /api/products/:id/reviews
Headers: { Authorization: 'Bearer token' }
Body: { rating, comment }
Response: { success, product }
```

### Cart Routes

#### Get Cart
```
GET /api/cart
Headers: { Authorization: 'Bearer token' }
Response: { success, cart }
```

#### Add to Cart
```
POST /api/cart/add
Headers: { Authorization: 'Bearer token' }
Body: { productId, quantity }
Response: { success, cart }
```

#### Remove from Cart
```
POST /api/cart/remove
Headers: { Authorization: 'Bearer token' }
Body: { productId }
Response: { success, cart }
```

#### Update Cart Item
```
POST /api/cart/update
Headers: { Authorization: 'Bearer token' }
Body: { productId, quantity }
Response: { success, cart }
```

#### Clear Cart
```
POST /api/cart/clear
Headers: { Authorization: 'Bearer token' }
Response: { success, cart }
```

### Order Routes

#### Create Order
```
POST /api/orders
Headers: { Authorization: 'Bearer token' }
Body: { shippingAddress, paymentMethod }
Response: { success, order, clientSecret }
```

#### Get User Orders
```
GET /api/orders/user
Headers: { Authorization: 'Bearer token' }
Response: { success, orders }
```

#### Get Seller Orders
```
GET /api/orders/seller
Headers: { Authorization: 'Bearer token' }
Response: { success, orders }
```

#### Get Order by ID
```
GET /api/orders/:id
Headers: { Authorization: 'Bearer token' }
Response: { success, order }
```

#### Complete Payment
```
POST /api/orders/payment/complete
Headers: { Authorization: 'Bearer token' }
Body: { orderId, paymentIntentId }
Response: { success, order }
```

### Admin Routes

#### Get All Users
```
GET /api/admin/users?page=1
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, users, total, pages }
```

#### Get All Products
```
GET /api/admin/products?page=1
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, products, total, pages }
```

#### Get All Orders
```
GET /api/admin/orders?page=1
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, orders, total, pages }
```

#### Get Dashboard Stats
```
GET /api/admin/stats
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, stats: { totalUsers, totalProducts, totalOrders, totalRevenue } }
```

#### Remove User
```
DELETE /api/admin/users/:id
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, message }
```

#### Remove Product
```
DELETE /api/admin/products/:id
Headers: { Authorization: 'Bearer token', Role: 'admin' }
Response: { success, message }
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('buyer', 'seller', 'admin'),
  avatar: String,
  bio: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  seller: ObjectId (ref: User),
  stock: Number,
  rating: Number,
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  numReviews: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  totalItems: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    seller: ObjectId (ref: User),
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String ('stripe', 'paypal', 'cod'),
  paymentStatus: String ('pending', 'completed', 'failed'),
  orderStatus: String ('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  totalAmount: Number,
  stripePaymentIntentId: String,
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security

### Implemented Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **CORS**: Cross-origin resource sharing configured
4. **Input Validation**: Server-side validation
5. **Authorization**: Role-based access control
6. **Protected Routes**: Middleware-based route protection
7. **Environment Variables**: Sensitive data in .env

### Best Practices

1. Never commit `.env` file to version control
2. Use HTTPS in production
3. Implement rate limiting
4. Add request logging
5. Validate all user inputs
6. Use strong JWT secrets
7. Keep dependencies updated

## 📦 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push code to GitHub
2. Connect repository to hosting service
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy `dist` folder to Vercel/Netlify

### MongoDB Production

Use MongoDB Atlas for cloud hosting with automated backups.

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error**
- Check MongoDB is running
- Verify connection string in `.env`
- Check firewall settings for MongoDB Atlas

### Frontend Issues

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Vite not finding port 3000**
```bash
npm run dev -- --port 3000
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support, email support@marketplace.com or open an issue on GitHub.

---

**Happy Coding! 🚀**
