import React, { useState } from 'react';

const INITIAL_FORM = {
  title: '',
  category: 'Notes & Material',
  mode: 'BUY',
  price: '',
  stock: 1,
  condition: 'Like New',
  description: '',
  pickupLocation: '',
  image: '',
  rentalRate: '',
  exchangeWish: '',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80';

function SellItemView({ onBack, onPublish, currentUser }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const updateField = (field, value) => {
    setError('');

    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setImagePreview(imageData);
      updateField('image', imageData);
    };

    reader.onerror = () => {
      setError('Unable to read the selected image.');
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview('');
    updateField('image', '');

    const fileInput = document.getElementById('item-image');

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.pickupLocation.trim()
    ) {
      return 'Please complete all required fields.';
    }

    if (Number(form.price) <= 0) {
      return 'Price must be greater than zero.';
    }

    if (Number(form.stock) < 1) {
      return 'Stock must be at least 1.';
    }

    if (form.mode === 'RENT' && !form.rentalRate.trim()) {
      return 'Please provide a rental rate.';
    }

    if (form.mode === 'EXCHANGE' && !form.exchangeWish.trim()) {
      return 'Please describe what you want in exchange.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

   

if (!currentUser) {
  setError("You must be logged in to publish a listing.");
  return;
}

    setError('');
    setIsPublishing(true);

    const newProduct = {
      title: form.title.trim(),
      category: form.category,
      mode: form.mode,
      price: Number(form.price),
      stock: Math.max(1, Number(form.stock) || 1),
      originalPrice: null,
      condition: form.condition,
      description: form.description.trim(),
      pickupLocation: form.pickupLocation.trim(),
      image: form.image || FALLBACK_IMAGE,

      rentalRate:
        form.mode === 'RENT'
          ? form.rentalRate.trim()
          : '',

      exchangeWish:
        form.mode === 'EXCHANGE'
          ? form.exchangeWish.trim()
          : '',

      

      seller: {
        name:
          currentUser.name ||
          currentUser.fullName ||
          currentUser.email ||
          'Student Seller',

        email: currentUser.email || '',

        avatar:
          currentUser.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',

        trustScore: currentUser.trustScore ?? 100,
        verified: currentUser.verified ?? false,
        department: currentUser.department || 'Student Seller',
        reviews: 0,
        rating: 0,
      },

      createdAt: new Date().toISOString(),
    };

    try {
      await Promise.resolve(onPublish(newProduct));

      setForm(INITIAL_FORM);
      setImagePreview('');

      const fileInput = document.getElementById('item-image');

      if (fileInput) {
        fileInput.value = '';
      }
    } catch {
      setError(
        'Unable to publish the listing. Please try again.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-8 lg:px-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-neutral-500 transition hover:text-neutral-950"
      >
        <span aria-hidden="true">←</span>
        Back to Marketplace
      </button>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
          CampusCart Seller Studio
        </p>

        <h1 className="mt-2 text-4xl font-black text-neutral-950 sm:text-5xl">
          Sell an Item
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
          Add your item details and upload a clear image from your device.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Item Title */}
          <div className="md:col-span-2">
            <label
              htmlFor="item-title"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Item title *
            </label>

            <input
              id="item-title"
              value={form.title}
              onChange={(event) =>
                updateField('title', event.target.value)
              }
              placeholder="Example: Engineering Mathematics Book"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="item-category"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Category *
            </label>

            <select
              id="item-category"
              value={form.category}
              onChange={(event) =>
                updateField('category', event.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
            >
              <option>Notes & Material</option>
              <option>Tech & Accessories</option>
              <option>Books</option>
              <option>Apparel & Winter</option>
              <option>Bags & Living</option>
              <option>Hostel Living</option>
              <option>Event & Formal</option>
              <option>Sports & Fitness</option>
              <option>Other</option>
            </select>
          </div>

          {/* Listing Type */}
          <div>
            <label
              htmlFor="listing-type"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Listing type *
            </label>

            <select
              id="listing-type"
              value={form.mode}
              onChange={(event) =>
                updateField('mode', event.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
            >
              <option value="BUY">Sell</option>
              <option value="RENT">Rent</option>
              <option value="EXCHANGE">Exchange</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="item-price"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Price *
            </label>

            <input
              id="item-price"
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField('price', event.target.value)
              }
              placeholder="Enter price in ₹"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="item-stock"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Stock / Quantity *
            </label>

            <input
              id="item-stock"
              type="number"
              min="1"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField('stock', event.target.value)
              }
              placeholder="Enter available quantity"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              required
            />
          </div>

          {/* Condition */}
          <div>
            <label
              htmlFor="item-condition"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Condition *
            </label>

            <select
              id="item-condition"
              value={form.condition}
              onChange={(event) =>
                updateField('condition', event.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
            >
              <option>Brand New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Repair</option>
            </select>
          </div>

          {/* Rental Rate */}
          {form.mode === 'RENT' && (
            <div className="md:col-span-2">
              <label
                htmlFor="rental-rate"
                className="mb-2 block text-sm font-bold text-neutral-800"
              >
                Rental rate *
              </label>

              <input
                id="rental-rate"
                value={form.rentalRate}
                onChange={(event) =>
                  updateField('rentalRate', event.target.value)
                }
                placeholder="Example: ₹50 per day"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
                required
              />
            </div>
          )}

          {/* Exchange Wish */}
          {form.mode === 'EXCHANGE' && (
            <div className="md:col-span-2">
              <label
                htmlFor="exchange-wish"
                className="mb-2 block text-sm font-bold text-neutral-800"
              >
                What do you want in exchange? *
              </label>

              <input
                id="exchange-wish"
                value={form.exchangeWish}
                onChange={(event) =>
                  updateField('exchangeWish', event.target.value)
                }
                placeholder="Example: Looking for a scientific calculator"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
                required
              />
            </div>
          )}

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="item-description"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Description *
            </label>

            <textarea
              id="item-description"
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder="Describe the item's condition, defects, accessories, and other details..."
              rows={5}
              className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              required
            />
          </div>

          {/* Pickup Location */}
          <div className="md:col-span-2">
            <label
              htmlFor="pickup-location"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Pickup location *
            </label>

            <input
              id="pickup-location"
              value={form.pickupLocation}
              onChange={(event) =>
                updateField('pickupLocation', event.target.value)
              }
              placeholder="Example: Main Library Entrance"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label
              htmlFor="item-image"
              className="mb-2 block text-sm font-bold text-neutral-800"
            >
              Upload item image
            </label>

            <input
              id="item-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-600 file:mr-4 file:border-0 file:bg-neutral-950 file:px-4 file:py-3 file:font-bold file:text-white hover:file:bg-neutral-800"
            />

            <p className="mt-2 text-xs text-neutral-400">
              Supported image files only. Maximum size: 5 MB.
            </p>
          </div>

          {/* Image Preview */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-800">
                Image preview
              </span>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="mt-2 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview of uploaded item"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="px-5 text-center text-sm font-semibold text-neutral-400">
                  Your uploaded image will appear here.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
          <strong>Prototype notice:</strong> The image is currently stored as
          a browser data URL. Later, we will upload images to backend storage.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-neutral-200 px-5 py-3 font-bold text-neutral-700 transition hover:bg-neutral-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPublishing}
            className="flex-1 rounded-xl bg-neutral-950 px-5 py-3 font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublishing ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SellItemView;