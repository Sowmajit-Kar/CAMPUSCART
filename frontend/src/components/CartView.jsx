import React from "react";

function CartFullView({
  cart,
  onRemove,
  onContinue,
  onCheckout,
}) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.qty,
    0,
  );

  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
          CampusCart Checkout
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950 mt-2">
          Student Shopping Bag
        </h1>

        <p className="text-sm text-neutral-500 mt-2">
          Review your items before confirming your campus pickup order.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
          <div className="text-4xl">🛍️</div>

          <h2 className="font-display text-xl font-bold text-neutral-900">
            Your cart is empty
          </h2>

          <p className="text-neutral-500 text-sm">
            Add something from the marketplace to continue.
          </p>

          <button
            onClick={onContinue}
            className="px-6 py-3 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-5">
            <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200">
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  Cart Items
                </h2>

                <p className="text-xs text-neutral-500 mt-1">
                  {cart.length} item{cart.length !== 1 ? "s" : ""} in your bag
                </p>
              </div>

              <div className="divide-y divide-neutral-200">
                {cart.map((item) => (
  <div key={item.id} className="cart-item">
    <img
      src={item.image}
      alt={item.title}
      className="cart-item-image"
    />

    <div className="cart-item-details">
      <h4>{item.title}</h4>

      <p>
        ₹{Number(item.price || 0).toFixed(2)} × {item.qty}
      </p>

      <p>
        Seller:{" "}
        {typeof item.seller === "object"
          ? item.seller?.name || "Campus Seller"
          : item.seller || "Campus Seller"}
      </p>

      <p>
  Pickup:{" "}
  {typeof item.pickupLocation === "object"
    ? item.pickupLocation?.name || "Campus Safe Desk"
    : item.pickupLocation || "Campus Safe Desk"}
</p>
    </div>

    <button onClick={() => onRemove(item.id)}>
      Remove
    </button>
  </div>
))}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-start gap-3">
                <div className="text-xl">📍</div>

                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Campus Pickup
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1">
                    After confirmation, your order will receive a pickup token.
                    Coordinate with the seller at the selected campus location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 space-y-6 lg:sticky lg:top-28">
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">
                Order Summary
              </h2>

              <p className="text-xs text-neutral-500 mt-1">
                Secure in-campus exchange
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-semibold">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Campus pickup fee</span>
                <span className="font-semibold text-emerald-600">
                  Free
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex justify-between gap-4 text-lg font-display font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 shadow-md"
            >
              Confirm Order & Generate QR
            </button>

            <button
              onClick={onContinue}
              className="w-full py-3 bg-neutral-100 text-neutral-800 font-bold rounded-xl text-xs hover:bg-neutral-200"
            >
              Back to Marketplace
            </button>

            <p className="text-[11px] leading-relaxed text-neutral-400 text-center">
              This prototype stores your order locally in the browser.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartFullView;