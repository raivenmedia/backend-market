import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, getSubcategoryBySlug } from '../constants/categories';

const LIMIT = 12;

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

export const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [category, setCategory] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    condition: '',
    priceMin: '',
    priceMax: '',
  });
  const isFetching = useRef(false);

  // Find category info from local constants
  useEffect(() => {
    const findCategory = () => {
      for (const cat of CATEGORIES) {
        for (const subcat of cat.subcategories) {
          if (subcat.slug === slug) {
            setBreadcrumb({ category: cat, subcategory: subcat });
            setCategory(subcat);
            return;
          }
        }
      }
    };
    findCategory();
  }, [slug]);

  // Fetch products when dependencies change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    fetchProducts(1, true);
  }, [slug, filters]);

  const fetchProducts = useCallback(
    async (pageNum = 1, reset = false) => {
      if (isFetching.current || !slug) return;
      isFetching.current = true;

      try {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        // Build price range string
        const priceRange = filters.priceMin || filters.priceMax 
          ? `${filters.priceMin || '0'}-${filters.priceMax || '999999'}`
          : '';

        const response = await productService.getAll(
          '', // search
          '', // category
          slug, // subcategory (using slug)
          filters.condition,
          priceRange,
          pageNum,
          LIMIT
        );

        const newProducts = response.products || [];
        const more = response.hasMore || false;

        setProducts((prev) =>
          reset ? newProducts : [...prev, ...newProducts]
        );
        setHasMore(more);
        setPage(pageNum);
        setError(null);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch products. Please try again.';
        setError(errorMsg);
        console.error('Failed to fetch category products:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetching.current = false;
      }
    },
    [slug, filters]
  );

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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!category && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* ── BREADCRUMB ──────────────────────────────────────── */}
      {breadcrumb && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">
            {breadcrumb.category.name}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{breadcrumb.subcategory.name}</span>
        </div>
      )}

      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {category?.name || 'Category'}
        </h1>
        <p className="text-gray-600 text-lg">
          Browse all products in this category
        </p>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* ── FILTERS SIDEBAR ─────────────────────────────── */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              {/* Condition Filter */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Condition</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      value=""
                      checked={filters.condition === ''}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                      className="w-4 h-4 text-gray-900 accent-gray-900"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      All
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      value="new"
                      checked={filters.condition === 'new'}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                      className="w-4 h-4 text-gray-900 accent-gray-900"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      New
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      checked={filters.condition === 'used'}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                      className="w-4 h-4 text-gray-900 accent-gray-900"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      Used (Second-hand)
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.condition || filters.priceMin || filters.priceMax) && (
                <button
                  onClick={() =>
                    setFilters({ condition: '', priceMin: '', priceMax: '' })
                  }
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── PRODUCTS GRID ───────────────────────────────── */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or browse other categories.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                  {loadingMore &&
                    Array.from({ length: 3 }).map((_, i) => (
                      <ProductSkeleton key={`more-${i}`} />
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && !loadingMore && (
                  <div className="text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-10 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Load More
                    </button>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-gray-400 text-sm">
                    You've seen all {products.length} products
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
