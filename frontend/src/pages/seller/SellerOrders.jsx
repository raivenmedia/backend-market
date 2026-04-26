import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Ensure backend returns only orders that contain this seller's items
      // (This assumes the backend orderService.getSellerOrders is implemented correctly)
      const response = await orderService.getSellerOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-xl text-gray-600">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Order ID</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Customer</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Items</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                    <td className="p-4 text-sm text-gray-600">{order.user?.name || 'Guest'}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {order.items.map(item => (
                        <div key={item._id}>{item.product?.title} (x{item.quantity})</div>
                      ))}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
