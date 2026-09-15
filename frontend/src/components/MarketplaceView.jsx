import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CAMPUS_DATA } from '../data/mockData';

function MarketplaceFullView({
  extraProducts = [],
  onAddToCart,
  onOpenSeller,
  onStartChat,
  onOpenQr,
  onSellItem,
   onAddToWishlist,
  onRemoveFromWishlist,
  wishlistItems = [],
  initialProduct = null

}) {
  const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('ALL');
const [selectedMode, setSelectedMode] = useState('ALL');
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [selectedProduct, setSelectedProduct] = useState(null);
const [sortOption, setSortOption] = useState('DEFAULT');
const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  const products = [
  ...(extraProducts || []),
  ...(window.CAMPUS_DATA?.products || [])
];

  const categories = useMemo(() => {
    return ['ALL', ...new Set(products.map(product => product.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
  const filtered = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.seller?.name?.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'ALL' ||
      product.category === selectedCategory;

    const matchesMode =
      selectedMode === 'ALL' ||
      product.mode === selectedMode;

    const price = Number(product.price) || 0;

    const matchesMinPrice =
      minPrice === '' || price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === '' || price <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMode &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  return [...filtered].sort((a, b) => {
    if (sortOption === 'PRICE_LOW') {
      return Number(a.price || 0) - Number(b.price || 0);
    }

    if (sortOption === 'PRICE_HIGH') {
      return Number(b.price || 0) - Number(a.price || 0);
    }

    if (sortOption === 'RATING') {
      return (
        Number(b.seller?.rating || 0) -
        Number(a.seller?.rating || 0)
      );
    }

    return 0;
  });
}, [
  products,
  searchQuery,
  selectedCategory,
  selectedMode,
  minPrice,
  maxPrice,
  sortOption,
]);

  const getActionLabel = mode => {
    if (mode === 'RENT') return 'Rent Item';
    if (mode === 'EXCHANGE') return 'Request Exchange';
    return 'Add to Cart';
  };

  if (selectedProduct) {
    const product = selectedProduct;
  const isWishlisted = wishlistItems.some(
  item => item.id === product.id
    );
    return (
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-20">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-950 transition"
        >
          ← Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-xs font-bold">
                {product.mode}
              </span>

              <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                {product.category}
              </span>

              <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                    CampusCart Listing
                  </p>

                  <h1 className="mt-2 text-4xl font-black font-display text-neutral-950">
                    {product.title}
                  </h1>
                </div>

                <button
                  onClick={() => (isWishlisted ? onRemoveFromWishlist(product.id) : onAddToWishlist(product))}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center text-xl transition ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  {isWishlisted ? '♥' : '♡'}
                </button>
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-black font-display text-neutral-950">
                  ₹{Number(product.price).toFixed(2)}
                </span>

                {product.originalPrice && (
                  <span className="text-lg text-neutral-400 line-through">
                    ₹{Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {product.rentalRate && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Rental rate: {product.rentalRate}
                </p>
              )}
            </div>

            <div className="border-t border-b border-neutral-200 py-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                Description
              </h2>

              <p className="mt-3 text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.exchangeWish && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs uppercase tracking-widest font-bold text-amber-700">
                  Exchange Preference
                </p>

                <p className="mt-2 text-sm text-amber-900">
                  {product.exchangeWish}
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                    Safe Pickup Location
                  </p>

                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                    📍 {product.pickupLocation}
                  </p>
                </div>

                <span className="text-emerald-600 text-xl">✓</span>
              </div>
            </div>

            {/* Main actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onAddToCart(product)}
                className="rounded-xl bg-neutral-950 text-white py-3 px-5 font-bold hover:bg-neutral-800 transition"
              >
                {getActionLabel(product.mode)}
              </button>

              <button
                onClick={() => onStartChat(product.seller, product)}
                className="rounded-xl bg-neutral-100 text-neutral-900 py-3 px-5 font-bold hover:bg-neutral-200 transition"
              >
                Chat with Seller
              </button>

              <button
                onClick={() => onOpenQr(product)}
                className="rounded-xl bg-emerald-600 text-white py-3 px-5 font-bold hover:bg-emerald-700 transition"
              >
                Generate QR Token
              </button>

              <button
                onClick={() => onOpenSeller(product.seller)}
                className="rounded-xl border border-neutral-200 bg-white text-neutral-900 py-3 px-5 font-bold hover:bg-neutral-100 transition"
              >
                View Seller Profile
              </button>
            </div>
          </div>
        </div>

        {/* Seller information */}
        <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-16 h-16 rounded-full object-cover border border-neutral-200"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-950">
                    {product.seller.name}
                  </h2>

                  {product.seller.verified && (
                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-500">
                  {product.seller.department}
                </p>

                <p className="mt-1 text-sm text-neutral-700">
                  ⭐ {product.seller.rating} rating · {product.seller.reviews} reviews
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                Trust Score
              </p>

              <p className="mt-1 text-3xl font-black text-emerald-600">
                {product.seller.trustScore}%
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            VERIFIED STUDENT INVENTORY
          </span>

          <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-950 mt-2">
            Student Marketplace
          </h1>

          <p className="mt-3 text-sm text-neutral-500 max-w-xl">
            Buy, rent, exchange, and discover useful items from students around
            your campus.
          </p>
        </div>

        <div className="text-sm text-neutral-500">
          <strong className="text-neutral-950">{filteredProducts.length}</strong>{' '}
          listings found
        </div>

        <button
  onClick={onSellItem}
  className="rounded-xl bg-neutral-950 text-white px-5 py-3 text-sm font-bold hover:bg-neutral-800 transition"
>
  + Sell an Item
</button>

        
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <input
    type="text"
    value={searchQuery}
    onChange={event => setSearchQuery(event.target.value)}
    placeholder="Search books, calculators, electronics..."
    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
  />

  <select
  value={sortOption}
  onChange={event => setSortOption(event.target.value)}
  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
>
  <option value="DEFAULT">Sort By</option>
  <option value="PRICE_LOW">Price: Low to High</option>
  <option value="PRICE_HIGH">Price: High to Low</option>
  <option value="RATING">Highest Seller Rating</option>
</select>

  <select
    value={selectedCategory}
    onChange={event => setSelectedCategory(event.target.value)}
    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
  >
    {categories.map(category => (
      <option key={category} value={category}>
        {category === 'ALL' ? 'All Categories' : category}
      </option>
    ))}
  </select>

  <input
    type="number"
    min="0"
    value={minPrice}
    onChange={event => setMinPrice(event.target.value)}
    placeholder="Minimum price ₹"
    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
  />

  <input
    type="number"
    min="0"
    value={maxPrice}
    onChange={event => setMaxPrice(event.target.value)}
    placeholder="Maximum price ₹"
    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
  />
</div>

      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'BUY', 'RENT', 'EXCHANGE'].map(mode => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              selectedMode === mode
                ? 'bg-neutral-950 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {mode === 'ALL'
              ? 'All Listings'
              : mode === 'BUY'
              ? 'Buy'
              : mode === 'RENT'
              ? 'Rent'
              : 'Exchange'}
          </button>
        ))}

        {(
  searchQuery ||
  selectedCategory !== 'ALL' ||
  selectedMode !== 'ALL' ||
  minPrice !== '' ||
  maxPrice !== '' ||
  sortOption !== 'DEFAULT'
) && (
          <button
            onClick={() => {
  setSearchQuery('');
  setSelectedCategory('ALL');
  setSelectedMode('ALL');
  setMinPrice('');
  setMaxPrice('');
  setSortOption('DEFAULT');
}}
            className="ml-2 px-4 py-2 rounded-full text-xs font-bold border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-neutral-300">
          <div className="text-4xl">🔎</div>

          <h2 className="mt-4 text-xl font-bold text-neutral-950">
            No listings found
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Try changing your search or selecting another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map(product => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);

            return (
              <article
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="aspect-[4/3] bg-neutral-100 overflow-hidden relative text-left"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span className="absolute top-3 left-3 bg-neutral-950/85 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                    {product.mode}
                  </span>

                  <span className="absolute bottom-3 left-3 bg-white/90 text-neutral-900 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    {product.category}
                  </span>
                </button>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-left"
                    >
                      <h3 className="font-display font-bold text-xl text-neutral-950 hover:underline">
                        {product.title}
                      </h3>
                    </button>

                    <button
                      onClick={() => (isWishlisted ? onRemoveFromWishlist(product.id) : onAddToWishlist(product))}
                      className="text-2xl text-neutral-500 hover:text-red-500 transition"
                      aria-label="Toggle wishlist"
                    >
                      {isWishlisted ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display font-black text-2xl text-neutral-950">
                      ₹{Number(product.price).toFixed(2)}
                    </span>

                    {product.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-neutral-500 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                    <span className="text-neutral-500">
                      {product.condition}
                    </span>

                    <span className="font-bold text-emerald-600">
                      Trust {product.seller.trustScore}%
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-neutral-500">
                    📍 {product.pickupLocation}
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onStartChat(product.seller, product)}
                      className="py-2.5 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MarketplaceFullView;
