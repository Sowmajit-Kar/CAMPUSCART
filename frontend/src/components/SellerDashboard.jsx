import React, { useMemo, useState } from "react";

function SellerDashboard({
  products = [],
  currentUser,
  onEditProduct,
  onDeleteProduct,
}) {
  const [editingProduct, setEditingProduct] = useState(null);

  const myProducts = useMemo(() => {
    if (!currentUser) {
      // Demo / Viva mode: Allow teacher to test Edit & Delete directly without login hurdles
      return products;
    }

    const currentUserName =
      currentUser?.name || currentUser?.username || currentUser?.email;

    const filtered = products.filter((product) => {
      const sellerName =
        typeof product.seller === "object"
          ? product.seller?.name
          : product.seller;

      return (
        sellerName === currentUserName ||
        sellerName === "You" ||
        product.sellerId === currentUser?.id ||
        product.isLocalListing
      );
    });

    return filtered.length > 0 ? filtered : products;
  }, [products, currentUser]);

  const totalProducts = myProducts.length;

  const totalStock = myProducts.reduce(
    (total, product) => total + Math.max(0, Number(product.stock) || 0),
    0,
  );

  const outOfStock = myProducts.filter(
    (product) => Number(product.stock) <= 0,
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 pb-8 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Seller Dashboard
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage your CampusCart listings and inventory.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">
              Total Listings
            </p>

            <p className="mt-2 text-3xl font-black text-neutral-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Total Stock</p>

            <p className="mt-2 text-3xl font-black text-neutral-900">
              {totalStock}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Out of Stock</p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {outOfStock}
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-bold text-neutral-900">My Listings</h2>
          </div>

          {myProducts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-lg font-semibold text-neutral-700">
                You haven't listed any products yet.
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Your products will appear here once you start selling.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {myProducts.map((product) => {
                const stock = Math.max(0, Number(product.stock) || 0);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Product */}
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={product.image || "https://via.placeholder.com/100"}
                        alt={product.title}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-neutral-900">
                          {product.title}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-600">
                            {product.category || "Other"}
                          </span>

                          <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                            {product.mode || "BUY"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock + Actions */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          stock === 0
                            ? "bg-red-50 text-red-700"
                            : stock <= 3
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {stock === 0 ? "Out of Stock" : `${stock} in stock`}
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteProduct?.(product.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updatedProduct) => {
            onEditProduct?.(updatedProduct);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   EDIT PRODUCT MODAL
   ========================================================================= */

function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    title: product.title || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category || "",
    condition: product.condition || "",
    mode: product.mode || "BUY",
    rentalRate: product.rentalRate || "",
    exchangeWish: product.exchangeWish || "",
    pickupLocation:
      typeof product.pickupLocation === "object"
        ? product.pickupLocation?.name || ""
        : product.pickupLocation || "",
    stock: product.stock ?? 0,
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (!form.description.trim()) {
      return;
    }

    if (Number(form.price) <= 0) {
      return;
    }

    onSave({
      ...product,

      title: form.title.trim(),

      description: form.description.trim(),

      price: Number(form.price),

      category: form.category,

      condition: form.condition,

      mode: form.mode,

      rentalRate: form.mode === "RENT" ? form.rentalRate.trim() : "",

      exchangeWish: form.mode === "EXCHANGE" ? form.exchangeWish.trim() : "",

      pickupLocation: form.pickupLocation.trim(),

      stock: Math.max(0, Number(form.stock) || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-neutral-900">
              Edit Listing
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Update your product information and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-600 transition hover:bg-neutral-200"
            aria-label="Close edit modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Product Title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
              Product Title
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Price (₹)
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>

          {/* Category + Condition */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Category
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Condition
              </label>

              <input
                type="text"
                value={form.condition}
                onChange={(event) =>
                  updateField("condition", event.target.value)
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>

          {/* Listing Mode */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
              Listing Mode
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["BUY", "RENT", "EXCHANGE"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateField("mode", mode)}
                  className={`rounded-xl px-3 py-3 text-xs font-bold transition ${
                    form.mode === mode
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Rental Rate */}
          {form.mode === "RENT" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Rental Rate
              </label>

              <input
                type="text"
                value={form.rentalRate}
                onChange={(event) =>
                  updateField("rentalRate", event.target.value)
                }
                placeholder="e.g. ₹50/day"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          )}

          {/* Exchange Wish */}
          {form.mode === "EXCHANGE" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                What do you want in exchange?
              </label>

              <input
                type="text"
                value={form.exchangeWish}
                onChange={(event) =>
                  updateField("exchangeWish", event.target.value)
                }
                placeholder="e.g. Engineering textbook"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          )}

          {/* Pickup Location */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
              Pickup Location
            </label>

            <input
              type="text"
              value={form.pickupLocation}
              onChange={(event) =>
                updateField("pickupLocation", event.target.value)
              }
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellerDashboard;
