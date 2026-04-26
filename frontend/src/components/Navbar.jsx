import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { CATEGORIES } from '../constants/categories';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  const handleCategoryHover = (categoryId) => {
    setActiveMenu(categoryId);
  };

  const navigateToCategory = (slug) => {
    navigate(`/category/${slug}`);
    setActiveMenu(null);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-gray-200' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 font-bold text-xl tracking-tight text-gray-900 cursor-pointer hover:text-gray-700 transition-colors" 
            onClick={() => navigate('/')}
          >
            Marketplace
          </div>

          {/* Center Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all duration-300 text-sm"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <a
                  href="/cart"
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cart?.totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
                </a>

                {user?.role === 'seller' ? (
                  <a href="/seller/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Seller Hub
                  </a>
                ) : user?.role === 'buyer' ? (
                  <a href="/seller/onboarding" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Sell
                  </a>
                ) : null}

                <a href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Orders
                </a>

                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Categories Menu Bar */}
        <div className="hidden md:flex border-t border-gray-100">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex-1 relative group"
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={() => handleCategoryHover(null)}
            >
              <button
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
              >
                {category.name}
                <svg className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Mega Menu Dropdown */}
              <div className="absolute left-0 right-0 top-full bg-white border border-gray-200 shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top group-hover:translate-y-0 translate-y-2">
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 min-w-[400px]">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => navigateToCategory(subcategory.slug)}
                        className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
