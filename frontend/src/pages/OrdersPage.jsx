import { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response =
        user?.role === 'seller'
          ? await orderService.getSellerOrders()
          : await orderService.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {user?.role === 'seller' ? 'Sales Orders' : 'My Orders'}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-2xl text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {order.orderStatus}
                    </span>
                    <p className="text-gray-600 mt-2">
                      Payment: {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2">
                      <div>
                        <p className="font-semibold">
                          {item.product?.title}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Shipping to:</p>
                    <p className="text-sm">
                      {order.shippingAddress?.street},
                      {order.shippingAddress?.city},
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total</p>
                    <p className="text-2xl font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
