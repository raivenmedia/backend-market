# ✅ MarketPlace - Setup & Launch Checklist

## 📋 Pre-Setup Requirements

- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] MongoDB Atlas account OR local MongoDB
- [ ] Stripe account (test mode)
- [ ] Code editor (VS Code recommended)
- [ ] Git installed (optional)

## 🚀 Quick Start (5 Minutes)

### Phase 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# (See .env.documentation for help)
nano .env

# Start backend server
npm run dev
```

**Expected Output:**
```
✓ Backend running on http://localhost:5000
✓ MongoDB connected
✓ Server listening on port 5000
```

**Verification:**
- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] No port conflicts
- [ ] Terminal shows "listening on port 5000"

### Phase 2: Frontend Setup (2 minutes)

```bash
# Open NEW terminal window
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
✓ Vite v4.3.4 building for development...
✓ Local: http://localhost:3000
✓ Press q to quit
```

**Verification:**
- [ ] Frontend starts without errors
- [ ] No port conflicts
- [ ] Vite dev server ready
- [ ] Terminal shows "Local: http://localhost:3000"

### Phase 3: Browser Access (1 minute)

```
Open browser:
http://localhost:3000
```

**Expected Result:**
- [ ] Marketplace homepage loads
- [ ] Product grid visible
- [ ] No console errors
- [ ] Navigation bar visible

## ⚙️ Configuration Checklist

### Backend Configuration

**File:** `backend/.env`

```
☐ MONGODB_URI=mongodb+srv://...  (MongoDB Atlas or local)
☐ PORT=5000                       (Backend port)
☐ NODE_ENV=development            (Environment)
☐ JWT_SECRET=your_secret_key      (Random string, 32+ chars)
☐ JWT_EXPIRE=30d                  (Token expiration)
☐ STRIPE_PUBLIC_KEY=pk_test_...   (Stripe test key)
☐ STRIPE_SECRET_KEY=sk_test_...   (Stripe secret key)
☐ CORS_ORIGIN=http://localhost:3000  (Frontend URL)
```

**Validation:**
- [ ] All required variables set
- [ ] No quotes around values
- [ ] JWT_SECRET is unique
- [ ] MongoDB URI is valid
- [ ] Stripe keys are test mode keys

### Frontend Configuration

**Automatic:** 
- [ ] Vite auto-detects backend at http://localhost:5000
- [ ] No .env file needed for development
- [ ] API base URL: `http://localhost:5000/api`

## 🧪 Initial Testing

### Test 1: Homepage Loading
```
[ ] Go to http://localhost:3000
[ ] Products display
[ ] Search bar visible
[ ] Navigation works
```

### Test 2: User Registration
```
[ ] Click "Register"
[ ] Fill form with test data
[ ] Select role (Buyer or Seller)
[ ] Submit form
[ ] Redirects to login
```

### Test 3: User Login
```
[ ] Click "Login"
[ ] Enter test credentials
[ ] Submit form
[ ] Redirects to homepage
[ ] Navbar shows user name
```

### Test 4: Product Browsing
```
[ ] Products load on homepage
[ ] Search functionality works
[ ] Filter by category works
[ ] Filter by price range works
[ ] Pagination works
```

### Test 5: Product Details
```
[ ] Click on product card
[ ] Product details page loads
[ ] Images visible
[ ] Description visible
[ ] Reviews visible (if any)
[ ] Add to cart button visible
```

### Test 6: Shopping Cart
```
[ ] Add item to cart
[ ] Cart count updates in navbar
[ ] Navigate to /cart
[ ] Item visible in cart
[ ] Can update quantity
[ ] Can remove item
[ ] Total price updates
```

### Test 7: Checkout (Sellers Only)
```
[ ] Fill in shipping address
[ ] Click checkout
[ ] Stripe modal appears
[ ] Use test card: 4242 4242 4242 4242
[ ] Order confirmation shows
```

## 🔧 Environment Setup Details

### MongoDB Setup Options

**Option 1: MongoDB Atlas (Recommended)**
```
[ ] Create Atlas account (mongodb.com/cloud/atlas)
[ ] Create free cluster
[ ] Create database user
[ ] Get connection string
[ ] Add to .env as MONGODB_URI
```

**Option 2: Local MongoDB**
```
[ ] Install MongoDB Community
[ ] Start MongoDB service
[ ] Use connection string: mongodb://localhost:27017/marketplace
[ ] Add to .env as MONGODB_URI
```

**Verification:**
```bash
# Test connection
curl http://localhost:5000/api/auth/me
# Should return auth error (not connection error)
```

### Stripe Setup

```
[ ] Create Stripe account (stripe.com)
[ ] Go to Developers > API Keys
[ ] Copy test mode keys
[ ] Add pk_test_... to backend/.env (STRIPE_PUBLIC_KEY)
[ ] Add sk_test_... to backend/.env (STRIPE_SECRET_KEY)
[ ] Verify test mode is enabled
```

**Test Card Numbers:**
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- AmEx: 3782 822463 10005
- Declined: 4000 0000 0000 0002

## 📊 Sample Test Data

### Test User Accounts

```
Email: buyer@test.com
Password: password123
Role: Buyer

Email: seller@test.com
Password: password123
Role: Seller

Email: admin@test.com
Password: password123
Role: Admin
```

**How to Create:**
1. Go to Register page
2. Use credentials above
3. Select appropriate role
4. Click register

## 🐛 Troubleshooting

### Issue: Port 5000 Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux - Find and kill process
lsof -i :5000
kill -9 [PID]
```

### Issue: Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :3000
kill -9 [PID]
```

### Issue: MongoDB Connection Error
```
✗ Check MONGODB_URI in .env
✗ Verify MongoDB is running
✗ Check network access (if using Atlas)
✗ Verify credentials are correct
```

### Issue: "Module not found"
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

### Issue: CORS Errors
```
✗ Verify CORS_ORIGIN in backend/.env matches frontend URL
✗ Check if backend is running
✗ Check if ports are correct
```

### Issue: JWT Token Errors
```
✗ Check JWT_SECRET is set in .env
✗ Verify token is being sent in headers
✗ Check token hasn't expired
```

## 📝 Verification Steps

### Backend Health Check

```bash
# Test API is responding
curl http://localhost:5000/api/products

# Expected: JSON array of products (may be empty)
```

### Frontend Health Check

```
Open DevTools (F12)
Check for:
✓ No console errors in red
✓ API calls successful (Network tab)
✓ No 404 errors
✓ CSS loads properly
```

### Database Health Check

**Option 1: MongoDB Atlas**
```
[ ] Login to Atlas
[ ] View cluster metrics
[ ] Check collections exist
[ ] View sample documents
```

**Option 2: Local MongoDB**
```bash
mongo
> use marketplace
> db.products.count()
# Should show: 0 (or number of products)
```

## 🚀 After Successful Launch

### Next Steps

1. **Explore Features** (10 minutes)
   - [ ] Test as buyer
   - [ ] Test as seller
   - [ ] Test as admin
   - [ ] Try all pages

2. **Add Sample Data** (15 minutes)
   - [ ] Add 5-10 test products
   - [ ] Create test orders
   - [ ] Add reviews

3. **Customize** (30+ minutes)
   - [ ] Change colors in tailwind.config.js
   - [ ] Update branding
   - [ ] Modify text/copy
   - [ ] Add logo

4. **Deploy** (2-3 hours)
   - [ ] Follow DEPLOYMENT.md
   - [ ] Setup backend hosting
   - [ ] Setup frontend hosting
   - [ ] Configure custom domain

## 📚 Documentation Reference

| Document | When to Read | Time |
|----------|-------------|------|
| QUICKSTART.md | Setup issues | 5 min |
| README.md | Full understanding | 20 min |
| API_TESTING.md | Testing endpoints | 10 min |
| DEPLOYMENT.md | Production deploy | 15 min |
| SAMPLE_DATA.md | Test scenarios | 10 min |
| FEATURES_CHECKLIST.md | Feature status | 5 min |
| ARCHITECTURE.md | System design | 15 min |

## 💾 Important Files to Remember

```
Backend:
├── .env (DO NOT COMMIT)
├── src/server.js (Main entry)
└── package.json (Dependencies)

Frontend:
├── src/App.jsx (Routes)
├── vite.config.js (Build config)
└── package.json (Dependencies)

Documentation:
├── README.md (Main guide)
└── .env.documentation (Setup help)
```

## ⏱️ Estimated Time Breakdown

```
Installation:          5 minutes
Configuration:         10 minutes
Initial Testing:       10 minutes
Troubleshooting:       5-15 minutes
Total:                 30-40 minutes
```

## 🎯 Success Criteria

✓ Backend running on port 5000
✓ Frontend running on port 3000
✓ Database connected
✓ Homepage loads in browser
✓ Registration works
✓ Login works
✓ Products display
✓ Cart functionality works
✓ No console errors

## 📞 Need Help?

1. Check QUICKSTART.md for setup issues
2. Review README.md for detailed info
3. See ARCHITECTURE.md for system design
4. Check API_TESTING.md for API issues
5. Review TROUBLESHOOTING section above

## ✨ Ready to Launch?

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev

# Open browser
http://localhost:3000

# You're live! 🎉
```

---

**Status Checklist:**
- [ ] All pre-requirements met
- [ ] Backend configured
- [ ] Frontend configured
- [ ] Both servers running
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Products display
- [ ] Cart works
- [ ] All tests pass

**Ready to start? Follow the Quick Start section above! 🚀**
