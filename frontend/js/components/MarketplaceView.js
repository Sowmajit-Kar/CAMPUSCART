const { useState, useEffect, useMemo, useRef } = React;

    function MarketplaceFullView({ onAddToCart, onOpenSeller, onStartChat, onOpenQr }) {
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('ALL');
      const [selectedMode, setSelectedMode] = useState('ALL');

      const filtered = useMemo(() => {
        return window.CAMPUS_DATA.products.filter(p => {
          const matchQ = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
          const matchMode = selectedMode === 'ALL' || p.mode === selectedMode;
          return matchQ && matchCat && matchMode;
        });
      }, [searchQuery, selectedCategory, selectedMode]);

      return (
        <section class="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-20 space-y-8">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <span class="text-xs font-mono text-neutral-400 uppercase tracking-widest">VERIFIED INVENTORY</span>
              <h1 class="font-display text-4xl font-black text-neutral-950 mt-1">Student Marketplace</h1>
            </div>
            
            {/* Mode Controls */}
            <div class="flex items-center gap-2 text-xs font-semibold">
              {['ALL', 'BUY', 'RENT', 'EXCHANGE'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  class={`px-3.5 py-1.5 rounded-full transition ${selectedMode === mode ? 'bg-neutral-950 text-white font-bold' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  {mode === 'ALL' ? 'All' : mode === 'BUY' ? 'Buy' : mode === 'RENT' ? 'Rent' : 'Exchange'}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div class="max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search used textbooks, drafters, calculators, cycles..."
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* 3-Column Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <div key={product.id} class="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div class="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                  <img src={product.image} alt={product.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span class="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {product.mode} {product.rentalRate ? `(${product.rentalRate})` : ''}
                  </span>
                  <button 
                    onClick={() => onOpenSeller(product.seller)}
                    class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow hover:bg-white"
                  >
                    Trust {product.seller.trustScore}%
                  </button>
                </div>

                <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-baseline justify-between">
                      <h3 class="font-display font-bold text-xl text-neutral-900">{product.title}</h3>
                      <span class="font-display font-bold text-lg text-neutral-950">₹{product.price.toFixed(2)}</span>
                    </div>
                    <p class="text-xs text-neutral-500 mt-1 line-clamp-2">{product.description}</p>
                    <div class="mt-2 text-[11px] text-neutral-400">
                      📍 Safe Meetup: <strong>{product.pickupLocation}</strong>
                    </div>
                  </div>

                  <div class="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-xs">
                    <button onClick={() => onAddToCart(product)} class="py-2 bg-neutral-950 text-white rounded-xl font-bold hover:bg-neutral-800">
                      Buy
                    </button>
                    <button onClick={() => onStartChat(product.seller, product)} class="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold">
                      Chat
                    </button>
                    <button onClick={() => onOpenQr(product)} class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">
                      QR Token
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

window.MarketplaceFullView = MarketplaceFullView;
