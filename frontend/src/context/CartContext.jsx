import { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const config = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  // Fetch cart on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/cart',
        config()
      );
      setCart(response.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/cart/add',
          { productId, quantity },
          config()
        );
        setCart(response.data.cart);
        return response.data.cart;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add to cart');
      }
    },
    [token]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/cart/remove',
          { productId },
          config()
        );
        setCart(response.data.cart);
        return response.data.cart;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 'Failed to remove from cart'
        );
      }
    },
    [token]
  );

  const updateCartItem = useCallback(
    async (productId, quantity) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/cart/update',
          { productId, quantity },
          config()
        );
        setCart(response.data.cart);
        return response.data.cart;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 'Failed to update cart'
        );
      }
    },
    [token]
  );

  const clearCart = useCallback(async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/clear',
        {},
        config()
      );
      setCart(response.data.cart);
      return response.data.cart;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }, [token]);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refetchCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export default CartContext;
