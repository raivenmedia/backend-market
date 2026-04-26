import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product._id);
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative bg-gray-100 overflow-hidden aspect-square group">
        <img
          src={product.images?.[0] || product.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.name || product.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Condition Badge */}
        {(product.condition || product.productState) && (
          <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {product.condition === 'new' ? 'New' : product.condition === 'used' ? 'Used' : product.productState}
          </div>
        )}

        {/* Add to Cart Button (on hover) */}
        {isHovered && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-gray-900 text-white py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
          {product.name || product.title}
        </h3>

        {/* Description */}
        {(product.description) && (
          <p className="text-gray-600 text-xs line-clamp-1 mb-3">
            {product.description}
          </p>
        )}

        {/* Price and Status */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {product.currency === 'ZMW' ? 'K' : '$'}
              {product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Seller Badge */}
        {product.seller && (
          <div className="flex items-center gap-1 text-xs font-medium">
            {product.seller.verificationStatus === 'verified' ? (
              <>
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">Verified Seller</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Unverified Seller</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
