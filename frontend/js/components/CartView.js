const { useState, useEffect, useMemo, useRef } = React;

    function CartFullView({ cart, onRemove, onContinue, onCheckout }) {
      const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
      return (
        <section class="max-w-4xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-8">
          <h1 class="font-display text-3xl font-bold text-neutral-950">Student Shopping Bag</h1>
          {cart.length === 0 ? (
            <div class="p-12 text-center bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
              <p class="text-neutral-500 text-sm">Your cart is currently empty.</p>
              <button onClick={onContinue} class="px-6 py-2.5 bg-neutral-950 text-white font-bold rounded-xl text-xs">
                Explore Marketplace
              </button>
            </div>
          ) : (
            <div class="space-y-6">
              <div class="divide-y divide-neutral-200 border-y border-neutral-200">
                {cart.map(i => (
                  <div key={i.id} class="py-4 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src={i.image} class="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div>
                        <h4 class="font-display font-bold text-sm text-neutral-900">{i.title}</h4>
                        <span class="text-xs text-neutral-400">₹{i.price.toFixed(2)} × {i.qty}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <span class="font-bold text-sm">₹{(i.price * i.qty).toFixed(2)}</span>
                      <button onClick={() => onRemove(i.id)} class="text-xs text-rose-500 font-bold hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div class="flex justify-between items-center text-xl font-display font-bold">
                <span>Total Amount:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div class="flex gap-4">
                <button onClick={onContinue} class="flex-1 py-3 bg-neutral-100 text-neutral-800 font-bold rounded-xl text-xs hover:bg-neutral-200">
                  Back to Marketplace
                </button>
                <button onClick={onCheckout} class="flex-1 py-3 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 shadow-md">
                  Confirm & Generate QR Token
                </button>
              </div>
            </div>
          )}
        </section>
      );
    }

window.CartFullView = CartFullView;
