# Sample Data for Testing

## Test Users

### Buyer Account
```javascript
{
  name: "John Buyer",
  email: "buyer@test.com",
  password: "password123",
  role: "buyer"
}
```

### Seller Account
```javascript
{
  name: "Jane Seller",
  email: "seller@test.com",
  password: "password123",
  role: "seller"
}
```

### Admin Account
```javascript
{
  name: "Admin User",
  email: "admin@test.com",
  password: "password123",
  role: "admin"
}
```

## Sample Products

### Electronics
```javascript
{
  title: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 199.99,
  category: "Electronics",
  images: [
    "https://via.placeholder.com/400x300?text=Headphones"
  ],
  stock: 50
}

{
  title: "USB-C Cable",
  description: "Durable and fast charging USB-C cable",
  price: 15.99,
  category: "Electronics",
  images: [
    "https://via.placeholder.com/400x300?text=USB-Cable"
  ],
  stock: 200
}
```

### Fashion
```javascript
{
  title: "Cotton T-Shirt",
  description: "Comfortable 100% cotton t-shirt",
  price: 29.99,
  category: "Fashion",
  images: [
    "https://via.placeholder.com/400x300?text=T-Shirt"
  ],
  stock: 100
}

{
  title: "Blue Jeans",
  description: "Classic blue denim jeans",
  price: 59.99,
  category: "Fashion",
  images: [
    "https://via.placeholder.com/400x300?text=Jeans"
  ],
  stock: 75
}
```

### Home & Garden
```javascript
{
  title: "Coffee Maker",
  description: "12-cup drip coffee maker",
  price: 49.99,
  category: "Home & Garden",
  images: [
    "https://via.placeholder.com/400x300?text=Coffee-Maker"
  ],
  stock: 30
}

{
  title: "LED Desk Lamp",
  description: "Adjustable LED desk lamp with USB charging",
  price: 39.99,
  category: "Home & Garden",
  images: [
    "https://via.placeholder.com/400x300?text=Desk-Lamp"
  ],
  stock: 60
}
```

### Books
```javascript
{
  title: "The Great Gatsby",
  description: "Classic novel by F. Scott Fitzgerald",
  price: 12.99,
  category: "Books",
  images: [
    "https://via.placeholder.com/400x300?text=Great-Gatsby"
  ],
  stock: 150
}

{
  title: "Python Programming",
  description: "Learn Python programming from scratch",
  price: 34.99,
  category: "Books",
  images: [
    "https://via.placeholder.com/400x300?text=Python-Book"
  ],
  stock: 40
}
```

## Sample Orders

### Pending Order
```javascript
{
  user: "buyer_user_id",
  items: [
    {
      product: "product_id_1",
      seller: "seller_user_id",
      quantity: 1,
      price: 199.99
    }
  ],
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  paymentMethod: "stripe",
  paymentStatus: "pending",
  orderStatus: "pending",
  totalAmount: 199.99
}
```

### Completed Order
```javascript
{
  user: "buyer_user_id",
  items: [
    {
      product: "product_id_2",
      seller: "seller_user_id",
      quantity: 2,
      price: 29.99
    }
  ],
  shippingAddress: {
    street: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA"
  },
  paymentMethod: "stripe",
  paymentStatus: "completed",
  orderStatus: "delivered",
  totalAmount: 59.98,
  trackingNumber: "TRACK123456"
}
```

## Sample Reviews

```javascript
{
  user: "buyer_user_id",
  rating: 5,
  comment: "Great product! Highly recommended. Fast shipping and excellent quality."
}

{
  user: "another_buyer_id",
  rating: 4,
  comment: "Good product, but packaging could be better."
}

{
  user: "third_buyer_id",
  rating: 5,
  comment: "Exactly as described. Perfect!"
}
```

## Test Scenarios

### Scenario 1: New Buyer Journey
1. Register as buyer
2. Browse products
3. Search for a specific product
4. View product details
5. Add product to cart
6. Checkout
7. Complete payment
8. View order history

### Scenario 2: Seller Journey
1. Register as seller
2. Add new product
3. View product listing
4. Edit product information
5. Monitor orders
6. Track sales

### Scenario 3: Admin Journey
1. Login as admin
2. View dashboard stats
3. Monitor all products
4. Monitor all orders
5. Remove inappropriate listing
6. Manage users

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] JWT token generation works
- [ ] Product creation by seller works
- [ ] Product search works
- [ ] Product filtering works
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Update cart quantity works
- [ ] Checkout process works
- [ ] Order creation works
- [ ] Order history displays correctly
- [ ] Admin dashboard loads correctly
- [ ] Admin can remove products
- [ ] Admin can remove users
- [ ] Reviews can be added
- [ ] Cart totals calculate correctly
- [ ] Pagination works
- [ ] Protected routes redirect unauthenticated users
- [ ] Seller-only routes restrict buyers

## Performance Baseline

Record these metrics before and after optimizations:

- Page load time: ____ ms
- API response time: ____ ms
- Database query time: ____ ms
- Bundle size: ____ KB
- Memory usage: ____ MB

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari
