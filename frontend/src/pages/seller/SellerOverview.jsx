import React, { useState, useEffect } from 'react';
import { sellerService, productService, orderService } from '../../services/api';

export const SellerOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, productsRes, ordersRes] = await Promise.all([
        sellerService.getProfile(),
        productService.getSellerProducts(),
        orderService.getSellerOrders(),
      ]);

      const products = productsRes.data.products;
      const orders = ordersRes.data.orders || [];

      setProfile(profileRes.data.seller);
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders.filter(o => o.paymentStatus === 'completed').reduce((acc, order) => {
          // Calculate seller's revenue from this order
          const sellerItems = order.items.filter(item => item.seller._id === profileRes.data.seller.userId);
          return acc + sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }, 0)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-gray-900">Welcome, {profile.businessName}</h1>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
          profile.kycStatus === 'Approved' ? 'bg-green-100 text-green-800' :
          profile.kycStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {profile.kycStatus} Seller
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium mb-1">Total Products</p>
          <p className="text-4xl font-bold text-gray-900">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium mb-1">Total Orders</p>
          <p className="text-4xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium mb-1">Revenue</p>
          <p className="text-4xl font-bold text-green-600">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
