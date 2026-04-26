import axios from 'axios';

// ────────────────────────────────────────────────────────────────
// GLOBAL API CONFIGURATION
// ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to get auth config for FormData requests
const getFormDataConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

// ────────────────────────────────────────────────────────────────
// PRODUCT ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const productService = {
  // Get all products with filtering
  getAll: async (search = '', category = '', subcategory = '', condition = '', priceRange = '', page = 1, limit = 12) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (condition) params.append('condition', condition);
      if (priceRange) params.append('priceRange', priceRange);
      params.append('page', page);
      params.append('limit', limit);

      const response = await apiClient.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw error;
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error.message);
      throw error;
    }
  },

  // Create product (with multiple images)
  create: async (formData) => {
    try {
      const response = await apiClient.post('/products', formData, getFormDataConfig());
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw error;
    }
  },

  // Update product
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw error;
    }
  },

  // Get seller products
  getSellerProducts: async () => {
    try {
      const response = await apiClient.get('/products/seller/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller products:', error.message);
      throw error;
    }
  },
};

// ────────────────────────────────────────────────────────────────
// CATEGORY ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const categoryService = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      // Return mock categories if API fails
      return {
        categories: [],
      };
    }
  },

  // Get category by slug
  getBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error.message);
      throw error;
    }
  },
};

// ────────────────────────────────────────────────────────────────
// ORDER ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const orderService = {
  // Create new order
  create: async (data) => {
    try {
      const response = await apiClient.post('/orders', data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw error;
    }
  },

  // Get order by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error.message);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await apiClient.get('/orders/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error.message);
      throw error;
    }
  },

  // Get seller orders
  getSellerOrders: async () => {
    try {
      const response = await apiClient.get('/orders/seller');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller orders:', error.message);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/orders/${id}/status`, { orderStatus: status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error.message);
      throw error;
    }
  },

  // Complete payment
  completePayment: async (data) => {
    try {
      const response = await apiClient.post('/orders/payment/complete', data);
      return response.data;
    } catch (error) {
      console.error('Error completing payment:', error.message);
      throw error;
    }
  },
};

// ────────────────────────────────────────────────────────────────
// CART ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      throw error;
    }
  },

  // Add to cart
  addItem: async (productId, quantity) => {
    try {
      const response = await apiClient.post('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      throw error;
    }
  },

  // Update cart item
  updateItem: async (productId, quantity) => {
    try {
      const response = await apiClient.put(`/cart/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error.message);
      throw error;
    }
  },

  // Remove from cart
  removeItem: async (productId) => {
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error.message);
      throw error;
    }
  },

  // Clear cart
  clear: async () => {
    try {
      const response = await apiClient.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error.message);
      throw error;
    }
  },
};

// ────────────────────────────────────────────────────────────────
// SELLER ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const sellerService = {
  // Register as seller
  register: async (formData) => {
    try {
      const response = await apiClient.post('/seller/register', formData, getFormDataConfig());
      return response.data;
    } catch (error) {
      console.error('Error registering as seller:', error.message);
      throw error;
    }
  },

  // Submit KYC verification (flexible: business or individual)
  submitKYCVerification: async (formData) => {
    try {
      const response = await apiClient.post('/seller/kyc/verify', formData, getFormDataConfig());
      return response.data;
    } catch (error) {
      console.error('Error submitting KYC verification:', error.message);
      throw error;
    }
  },

  // Get seller profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/seller/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller profile:', error.message);
      throw error;
    }
  },

  // Get seller notifications
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/seller/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      throw error;
    }
  },

  // Mark notification as read
  markNotificationRead: async (id) => {
    try {
      const response = await apiClient.put(`/seller/notifications/${id}/read`, {});
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      throw error;
    }
  },

  // Get seller dashboard stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/seller/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller stats:', error.message);
      throw error;
    }
  },
};

// ────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ────────────────────────────────────────────────────────────────

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error registering:', error.message);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.post('/auth/verify');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },
};

// Export axios client for custom requests
export default apiClient;
