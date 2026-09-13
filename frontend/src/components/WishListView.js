const { useState } = React;

function WishlistView({
  wishlistItems = [],
  onBack,
  onOpenProduct,
  onRemove,
  onToggleNeeded
}) {
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredItems = wishlistItems.filter(item => {
    if (activeTab === 'NEEDED') {
      return item.neededByMe;
    }

    return true;
  });

  return (
    <section class="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-20">
      <button
        onClick={onBack}
        class="mb-8 text-sm font-bold text-neutral-500 hover:text-neutral-950 transition"
      >
        ← Back to Marketplace
      </button>

      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-neutral-200 pb-6">
        <div>
          <p class="text-xs uppercase tracking-widest text-neutral-400 font-bold">
            Your Saved Items
          </p>

          <h1 class="mt-2 text-4xl sm:text-5xl font-black font-display text-neutral-950">
            My Wishlist
          </h1>

          <p class="mt-3 text-sm text-neutral-500">
            Save useful items and track things you need from your campus.
          </p>
        </div>

        <div class="text-sm text-neutral-500">
          <strong class="text-neutral-950">{wishlistItems.length}</strong>{' '}
          saved items
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          class={`px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'ALL'
              ? 'bg-neutral-950 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Saved Items
        </button>

        <button
          onClick={() => setActiveTab('NEEDED')}
          class={`px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'NEEDED'
              ? 'bg-neutral-950 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Needed by Me
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div class="mt-10 py-20 text-center rounded-3xl border border-dashed border-neutral-300">
          <div class="text-5xl">♡</div>

          <h2 class="mt-4 text-xl font-bold text-neutral-950">
            {activeTab === 'NEEDED'
              ? 'No needed items yet'
              : 'Your wishlist is empty'}
          </h2>

          <p class="mt-2 text-sm text-neutral-500">
            {activeTab === 'NEEDED'
              ? 'Mark saved products as Needed by Me to see them here.'
              : 'Open the marketplace and save products you may want later.'}
          </p>

          <button
            onClick={onBack}
            class="mt-6 rounded-xl bg-neutral-950 text-white px-5 py-3 text-sm font-bold hover:bg-neutral-800 transition"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map(product => (
            <article
              key={product.id}
              class="rounded-3xl overflow-hidden border border-neutral-200 bg-white"
            >
              <button
                onClick={() => onOpenProduct(product)}
                class="w-full aspect-[4/3] bg-neutral-100 overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </button>

              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <button
                    onClick={() => onOpenProduct(product)}
                    class="text-left"
                  >
                    <h2 class="text-xl font-bold font-display text-neutral-950 hover:underline">
                      {product.title}
                    </h2>
                  </button>

                  <button
                    onClick={() => onRemove(product.id)}
                    class="text-red-500 text-xl"
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>
                </div>

                <p class="mt-2 text-2xl font-black text-neutral-950">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                <p class="mt-2 text-sm text-neutral-500">
                  {product.description}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">
                    {product.mode}
                  </span>

                  <span class="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">
                    {product.category}
                  </span>

                  {product.neededByMe && (
                    <span class="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">
                      Needed by Me
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onToggleNeeded(product.id)}
                  class={`mt-5 w-full rounded-xl py-3 text-sm font-bold transition ${
                    product.neededByMe
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  {product.neededByMe
                    ? 'Remove from Needed by Me'
                    : 'Mark as Needed by Me'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

window.WishlistView = WishlistView;