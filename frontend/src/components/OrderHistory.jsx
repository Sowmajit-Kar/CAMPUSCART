import React from "react";

function OrderHistory({ orders = [], onBack }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
          CampusCart Account
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold text-neutral-950 sm:text-4xl">
          Order History
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          View your previous orders and pickup information.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-12 text-center">
          <div className="mb-4 text-5xl">📦</div>

          <h2 className="font-display text-xl font-bold text-neutral-900">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Your confirmed orders will appear here.
          </p>

          <button
            onClick={onBack}
            className="mt-6 rounded-xl bg-neutral-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Order ID
                  </p>

                  <h2 className="mt-1 font-mono text-lg font-bold text-neutral-900">
                    {order.id}
                  </h2>

                  <p className="mt-1 text-xs text-neutral-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                  {order.status || "Pending Pickup"}
                </span>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 text-sm font-bold text-neutral-900">
                    Purchased Items
                  </h3>

                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-16 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-neutral-900">
                            {item.title}
                          </h4>

                          <p className="mt-1 text-xs text-neutral-500">
                            Quantity: {item.qty}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-indigo-600">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.qty || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-neutral-950">
                      ₹{Number(order.total || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Pickup Location
                    </p>

                    <p className="mt-1 text-sm font-bold text-neutral-900">
                      {order.pickupLocation || "Campus Safe Desk"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                      Pickup Token
                    </p>

                    <p className="mt-1 font-mono text-xl font-black tracking-widest text-indigo-700">
                      {order.pickupToken || "------"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;