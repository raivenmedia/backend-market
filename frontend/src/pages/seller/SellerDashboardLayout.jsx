import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export const SellerDashboardLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: '/seller/dashboard', icon: '📊' },
    { name: 'Products', path: '/seller/products', icon: '📦' },
    { name: 'Orders', path: '/seller/orders', icon: '🛍️' },
    { name: 'KYC Status', path: '/seller/kyc', icon: '🛡️' },
    { name: 'Notifications', path: '/seller/notifications', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Seller Hub</h2>
          <p className="text-sm text-gray-500">Manage your business</p>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/seller/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerDashboardLayout;
