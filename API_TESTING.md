# API Routes Testing

## Setup

1. Get authentication token:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "buyer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Authentication API

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}

Response: { success: true, token, user }
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { success: true, token, user }
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response: { success: true, user }
```

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "1234567890",
  "bio": "I love shopping",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}

Response: { success: true, user }
```

## Product API

### Get All Products
```
GET /api/products?search=laptop&category=Electronics&minPrice=100&maxPrice=2000&page=1

Response: { 
  success: true, 
  products: [...], 
  total: 50,
  pages: 5,
  currentPage: 1
}
```

### Get Product by ID
```
GET /api/products/productId

Response: { success: true, product }
```

### Get Seller Products
```
GET /api/products/seller/products
Authorization: Bearer {token}

Response: { success: true, products }
```

### Create Product (Seller)
```
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "images": ["https://example.com/image1.jpg"],
  "stock": 50
}

Response: { success: true, product }
```

### Update Product
```
PUT /api/products/productId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Laptop Pro",
  "price": 1299.99,
  "stock": 30
}

Response: { success: true, product }
```

### Delete Product
```
DELETE /api/products/productId
Authorization: Bearer {token}

Response: { success: true, message: "Product deleted" }
```

### Add Review
```
POST /api/products/productId/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!"
}

Response: { success: true, product }
```

## Cart API

### Get Cart
```
GET /api/cart
Authorization: Bearer {token}

Response: { success: true, cart }
```

### Add to Cart
```
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "productId",
  "quantity": 2
}

Response: { success: true, cart }
```

### Remove from Cart
```
POST /api/cart/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "productId"
}

Response: { success: true, cart }
```

### Update Cart Item
```
POST /api/cart/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "productId",
  "quantity": 5
}

Response: { success: true, cart }
```

### Clear Cart
```
POST /api/cart/clear
Authorization: Bearer {token}

Response: { success: true, cart }
```

## Orders API

### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}

Response: { success: true, order, clientSecret }
```

### Get User Orders
```
GET /api/orders/user
Authorization: Bearer {token}

Response: { success: true, orders }
```

### Get Seller Orders
```
GET /api/orders/seller
Authorization: Bearer {token}

Response: { success: true, orders }
```

### Get Order by ID
```
GET /api/orders/orderId
Authorization: Bearer {token}

Response: { success: true, order }
```

### Update Order Status
```
PUT /api/orders/orderId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderStatus": "shipped"
}

Response: { success: true, order }
```

### Complete Payment
```
POST /api/orders/payment/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "orderId",
  "paymentIntentId": "pi_xxx"
}

Response: { success: true, order }
```

## Admin API

### Get All Users
```
GET /api/admin/users?page=1
Authorization: Bearer {adminToken}

Response: { success: true, users, total, pages }
```

### Get All Products
```
GET /api/admin/products?page=1
Authorization: Bearer {adminToken}

Response: { success: true, products, total, pages }
```

### Get All Orders
```
GET /api/admin/orders?page=1
Authorization: Bearer {adminToken}

Response: { success: true, orders, total, pages }
```

### Get Dashboard Stats
```
GET /api/admin/stats
Authorization: Bearer {adminToken}

Response: { 
  success: true, 
  stats: {
    totalUsers: 100,
    totalProducts: 500,
    totalOrders: 1000,
    totalRevenue: 50000
  }
}
```

### Remove User
```
DELETE /api/admin/users/userId
Authorization: Bearer {adminToken}

Response: { success: true, message: "User removed" }
```

### Remove Product
```
DELETE /api/admin/products/productId
Authorization: Bearer {adminToken}

Response: { success: true, message: "Product removed" }
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* data */ }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

## HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
