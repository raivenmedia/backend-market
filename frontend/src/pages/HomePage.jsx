import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants/categories';

const LIMIT = 12;

// Skeleton card for loading state
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
    <div className="bg-gray-200 h-48 rounded-t-xl"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get('search') || '',
  });
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isFetching = useRef(false);

  // Reset and fetch on filter change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    fetchProducts(1, true);
  }, [filter.search]);

  const fetchProducts = useCallback(async (pageNum = 1, reset = false) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const response = await productService.getAll(
        filter.search,
        '',
        '',
        '',
        pageNum,
        LIMIT
      );

      const { products: newProducts, hasMore: more } = response.data;

      setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
      setHasMore(more);
      setPage(pageNum);

      // Separate trending and recent for homepage sections
      if (reset) {
        setTrendingProducts(newProducts.slice(0, 5));
        setRecentProducts(newProducts.slice(5, 10));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, [filter.search]);

  const handleLoadMore = () => {
    fetchProducts(page + 1);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      alert('Please login to add items to cart');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
            Welcome to Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Explore products from different shops. Discover quality items across every category.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={() => document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate('/seller/onboarding')}
              className="px-8 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 border border-gray-300 transition-all"
            >
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ─────────────────────────────────── */}
      <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/category/${category.slug}`)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 p-6 text-center border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {category.subcategories.length} subcategories
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ───────────────────────────────────── */}
      {!loading && trendingProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <a
              href="#browse-all"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── RECENTLY ADDED ──────────────────────────────────────── */}
      {!loading && recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recently Added</h2>
            <a
              href="#browse-all"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {recentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── BROWSE ALL PRODUCTS ─────────────────────────────────── */}
      <section id="browse-all" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse All Products</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or browse our categories.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
              {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={`more-${i}`} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loadingMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-10 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Load More
                </button>
              </div>
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">
                Showing all {products.length} products
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
