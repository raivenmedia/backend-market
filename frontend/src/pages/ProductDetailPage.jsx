import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getById(id);
      setProduct(response);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch product. Please try again.';
      setError(errorMsg);
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      alert('Please login to add items to cart');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Loading Product</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchProduct}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageUrl || 'https://via.placeholder.com/500'];
  const displayImage = images[selectedImage];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* ── IMAGE GALLERY ──────────────────────────────────── */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={displayImage}
                alt={product.name || product.title}
                className="w-full h-full object-cover aspect-square"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ───────────────────────────────────── */}
          <div className="space-y-8">
            {/* Title & Basic Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name || product.title}
              </h1>
              <div className="space-y-2">
                {product.condition && (
                  <p className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {product.condition === 'new' ? 'New' : 'Used (Second-hand)'}
                  </p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="space-y-3">
                <p className="text-5xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </p>
                {product.productState && (
                  <p className="text-gray-600">
                    State: <span className="font-medium">{product.productState}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
                  {/* Seller Verification Badge */}
                  <div className="flex items-center gap-1">
                    {product.seller.verificationStatus === 'verified' ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Seller
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Unverified
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Shop:</span> {product.seller.name || product.seller.email}
                  </p>
                  {product.seller.location && (
                    <p className="text-gray-600 text-sm">
                      Location: {product.seller.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 border-l border-r border-gray-300 font-semibold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {product.stock} in stock
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all text-lg transform hover:-translate-y-0.5 ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } shadow-lg hover:shadow-xl`}
                  >
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </>
              ) : (
                <div className="py-4 px-6 bg-gray-100 text-gray-700 font-medium rounded-lg text-center">
                  Out of Stock
                </div>
              )}

              {!isAuthenticated && (
                <p className="text-xs text-gray-600 text-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Sign in
                  </button>
                  {' '}to add items to your cart
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── PRODUCT SPECS (Optional) ──────────────────────────── */}
        {(product.specs || product.tags) && (
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            {product.tags && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
