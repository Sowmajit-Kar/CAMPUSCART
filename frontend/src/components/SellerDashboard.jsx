import React, { useMemo } from "react";

function SellerDashboard({
  products = [],
  currentUser,
  onEditProduct,
  onDeleteProduct,
}) {
  const myProducts = useMemo(() => {
    if (!currentUser) return [];

    const currentUserName =
      currentUser?.name ||
      currentUser?.username ||
      currentUser?.email;

    return products.filter((product) => {
      const sellerName =
        typeof product.seller === "object"
          ? product.seller?.name
          : product.seller;

      return (
        sellerName === currentUserName ||
        product.sellerId === currentUser?.id
      );
    });
  }, [products, currentUser]);

  const totalProducts = myProducts.length;

  const totalStock = myProducts.reduce(
    (total, product) =>
      total + Math.max(0, Number(product.stock) || 0),
    0
  );

  const outOfStock = myProducts.filter(
    (product) => Number(product.stock) <= 0
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
            <p className="text-sm font-medium text-neutral-500">
              Total Stock
            </p>

            <p className="mt-2 text-3xl font-black text-neutral-900">
              {totalStock}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">
              Out of Stock
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {outOfStock}
            </p>
          </div>

        </div>

        {/* Listings */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">

          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-bold text-neutral-900">
              My Listings
            </h2>
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
                const stock = Math.max(
                  0,
                  Number(product.stock) || 0
                );

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* Product */}
                    <div className="flex min-w-0 items-center gap-4">

                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/100"
                        }
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
                        {stock === 0
                          ? "Out of Stock"
                          : `${stock} in stock`}
                      </span>

                      <button
                        type="button"
                        onClick={() => onEditProduct?.(product)}
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
    </div>
  );
}

export default SellerDashboard;