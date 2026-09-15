import React, { useMemo, useState } from "react";

const STATUS_STEPS = [
  "Order Placed",
  "Pending Pickup",
  "Ready for Pickup",
  "Completed",
];

const STATUS_STYLES = {
  "Order Placed": "bg-blue-100 text-blue-700",
  "Pending Pickup": "bg-amber-100 text-amber-800",
  "Ready for Pickup": "bg-indigo-100 text-indigo-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

function normalizeStatus(status) {
  const value = String(status || "").trim().toLowerCase();

  if (value === "pending" || value === "pending pickup") {
    return "Pending Pickup";
  }

  if (value === "ready" || value === "ready for pickup") {
    return "Ready for Pickup";
  }

  if (value === "completed" || value === "complete") {
    return "Completed";
  }

  if (value === "cancelled" || value === "canceled") {
    return "Cancelled";
  }

  if (value === "order placed") {
    return "Order Placed";
  }

  return "Pending Pickup";
}

function getStatusIndex(status) {
  const index = STATUS_STEPS.indexOf(status);
  return index === -1 ? 1 : index;
}

function OrderHistory({ orders = [], onBack, onCancelOrder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const normalizedStatus = normalizeStatus(order.status);

      const matchesSearch =
        !normalizedSearch ||
        String(order.id || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.items?.some((item) =>
          String(item.title || "")
            .toLowerCase()
            .includes(normalizedSearch)
        );

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCopyToken = async (token) => {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(String(token));
      setCopiedToken(token);

      window.setTimeout(() => {
        setCopiedToken(null);
      }, 1500);
    } catch {
      setCopiedToken(null);
    }
  };

  const handleCancelOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    if (onCancelOrder) {
      onCancelOrder(orderId);
    }
  };

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
          Track your orders, view purchased items, and check pickup details.
        </p>
      </div>

      {orders.length > 0 && (
        <div className="mb-8 grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-[1fr_220px]">
          <div>
            <label
              htmlFor="order-search"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500"
            >
              Search Orders
            </label>

            <input
              id="order-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order ID or item name..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="order-status"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500"
            >
              Filter by Status
            </label>

            <select
              id="order-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Orders</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Pending Pickup">Pending Pickup</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

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
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
          <div className="mb-3 text-4xl">🔎</div>

          <h2 className="font-display text-xl font-bold text-neutral-900">
            No matching orders
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Try another search term or change the status filter.
          </p>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
            }}
            className="mt-5 rounded-xl bg-neutral-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const status = normalizeStatus(order.status);
            const isExpanded = expandedOrder === order.id;
            const isCancelled = status === "Cancelled";
            const currentStep = getStatusIndex(status);

            return (
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
                      {order.id || "Unknown Order"}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                      STATUS_STYLES[status] ||
                      "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="space-y-6 p-5">
                  {!isCancelled && (
                    <div>
                      <h3 className="mb-4 text-sm font-bold text-neutral-900">
                        Order Progress
                      </h3>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {STATUS_STEPS.map((step, index) => {
                          const isCompleted = index <= currentStep;

                          return (
                            <div key={step} className="relative">
                              <div
                                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                                  isCompleted
                                    ? "bg-indigo-600 text-white"
                                    : "bg-neutral-100 text-neutral-400"
                                }`}
                              >
                                {isCompleted ? "✓" : index + 1}
                              </div>

                              <p
                                className={`text-xs font-bold ${
                                  isCompleted
                                    ? "text-neutral-900"
                                    : "text-neutral-400"
                                }`}
                              >
                                {step}
                              </p>

                              {index < STATUS_STEPS.length - 1 && (
                                <div
                                  className={`absolute left-9 top-4 hidden h-0.5 w-[calc(100%-1rem)] sm:block ${
                                    index < currentStep
                                      ? "bg-indigo-600"
                                      : "bg-neutral-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="font-mono text-xl font-black tracking-widest text-indigo-700">
                          {order.pickupToken || "------"}
                        </p>

                        {order.pickupToken && (
                          <button
                            onClick={() =>
                              handleCopyToken(order.pickupToken)
                            }
                            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            {copiedToken === order.pickupToken
                              ? "Copied"
                              : "Copy"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                      className="rounded-xl border border-neutral-200 px-4 py-3 text-xs font-bold text-neutral-800 transition hover:bg-neutral-50"
                    >
                      {isExpanded ? "Hide Items" : "View Items"}
                    </button>

                    {status === "Pending Pickup" && !isCancelled && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded-xl border border-red-200 px-4 py-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-neutral-200 pt-5">
                      <h3 className="mb-3 text-sm font-bold text-neutral-900">
                        Purchased Items
                      </h3>

                      <div className="space-y-3">
                        {order.items?.length ? (
                          order.items.map((item, index) => (
                            <div
                              key={`${item.id || item.title}-${index}`}
                              className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title || "Purchased item"}
                                  className="h-16 w-16 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-200 text-2xl">
                                  📦
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-neutral-900">
                                  {item.title || "Unnamed item"}
                                </h4>

                                <p className="mt-1 text-xs text-neutral-500">
                                  Quantity: {item.qty || 1}
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
                          ))
                        ) : (
                          <p className="text-sm text-neutral-500">
                            No item details available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;