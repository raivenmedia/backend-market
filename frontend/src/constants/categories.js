export const CATEGORIES = [
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { id: 'baby-clothes', name: 'Baby Clothes', slug: 'baby-clothes' },
      { id: 'mens-clothing', name: "Men's Clothing", slug: 'mens-clothing' },
      { id: 'womens-clothing', name: "Women's Clothing", slug: 'womens-clothing' },
      { id: 'handbags', name: 'Handbags', slug: 'handbags' },
      { id: 'shoes', name: 'Shoes', slug: 'shoes' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: 'phones', name: 'Phones', slug: 'phones' },
      { id: 'laptops', name: 'Laptops', slug: 'laptops' },
      { id: 'tablets', name: 'Tablets', slug: 'tablets' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
      { id: 'audio', name: 'Audio & Headphones', slug: 'audio' },
    ],
  },
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    subcategories: [
      { id: 'furniture', name: 'Furniture', slug: 'furniture' },
      { id: 'kitchen', name: 'Kitchen & Dining', slug: 'kitchen' },
      { id: 'bedding', name: 'Bedding', slug: 'bedding' },
      { id: 'decor', name: 'Home Decor', slug: 'decor' },
      { id: 'lighting', name: 'Lighting', slug: 'lighting' },
    ],
  },
  {
    id: 'toys',
    name: 'Toys',
    slug: 'toys',
    subcategories: [
      { id: 'educational-toys', name: 'Educational Toys', slug: 'educational-toys' },
      { id: 'baby-toys', name: 'Baby Toys', slug: 'baby-toys' },
      { id: 'outdoor-toys', name: 'Outdoor Toys', slug: 'outdoor-toys' },
      { id: 'board-games', name: 'Board Games', slug: 'board-games' },
      { id: 'action-figures', name: 'Action Figures', slug: 'action-figures' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    subcategories: [
      { id: 'skincare', name: 'Skincare', slug: 'skincare' },
      { id: 'makeup', name: 'Makeup', slug: 'makeup' },
      { id: 'haircare', name: 'Hair Care', slug: 'haircare' },
      { id: 'fragrances', name: 'Fragrances', slug: 'fragrances' },
      { id: 'wellness', name: 'Wellness', slug: 'wellness' },
    ],
  },
];

export const getCategoryBySlug = (slug) => {
  return CATEGORIES.find(cat => cat.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug, subcategorySlug) => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  return category.subcategories.find(sub => sub.slug === subcategorySlug);
};
