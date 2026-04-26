# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- Git

## Step-by-Step Installation

### 1. Clone/Navigate to Project
```bash
cd "c:\Users\m\Desktop\apexcole tecknology\market place"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env and update values
cp .env.example .env

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access Application

Open browser and go to:
```
http://localhost:3000
```

## Testing the Application

### Create Test Accounts

#### Buyer Account
- Email: buyer@test.com
- Password: password123
- Role: Buyer

#### Seller Account
- Email: seller@test.com
- Password: password123
- Role: Seller

#### Admin Account
- Email: admin@test.com
- Password: password123
- Role: Admin (set manually in database)

### Test Features

1. **Registration & Login**: Register new user and login
2. **Product Browsing**: View products with search and filters
3. **Shopping Cart**: Add/remove items, update quantities
4. **Orders**: Create orders and track status
5. **Seller Panel**: Add and manage products
6. **Admin Panel**: View stats and manage users/products

## Environment Variables

### Backend (.env)

```
# Database
MONGODB_URI=mongodb://localhost:27017/marketplace

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=30d

# Stripe (get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Useful Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production server
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Common Issues & Solutions

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- For MongoDB Atlas, ensure IP whitelist includes your IP

### Port Already in Use
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## API Testing

Use Postman or curl to test APIs:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","role":"buyer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get Products
curl http://localhost:5000/api/products

# Health Check
curl http://localhost:5000/api/health
```

## Next Steps

1. Customize branding (colors, logo)
2. Add payment processing (connect Stripe account)
3. Implement email notifications
4. Add image upload functionality
5. Set up analytics
6. Deploy to production

## Support

For issues or questions, refer to README.md for detailed documentation.
