import React, { useState } from 'react';

function SellItemView({ onBack, onPublish }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Notes & Material',
    mode: 'BUY',
    price: '',
    condition: 'Like New',
    description: '',
    pickupLocation: '',
    image: '',
    rentalRate: '',
    exchangeWish: ''
  });

  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setError('');

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.pickupLocation.trim()
    ) {
      setError('Please complete all required fields.');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    if (form.mode === 'RENT' && !form.rentalRate.trim()) {
      setError('Please provide a rental rate.');
      return;
    }

    if (form.mode === 'EXCHANGE' && !form.exchangeWish.trim()) {
      setError('Please describe what you want in exchange.');
      return;
    }

    const newProduct = {
      id: `local-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      mode: form.mode,
      price: Number(form.price),
      originalPrice: null,
      condition: form.condition,
      description: form.description.trim(),
      pickupLocation: form.pickupLocation.trim(),
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
      rentalRate: form.mode === 'RENT' ? form.rentalRate.trim() : '',
      exchangeWish:
        form.mode === 'EXCHANGE' ? form.exchangeWish.trim() : '',
      seller: {
        name: 'You',
        email: 'student@campus.edu',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        trustScore: 100,
        verified: false,
        department: 'Student Seller',
        reviews: 0,
        rating: 0
      }
    };

    onPublish(newProduct);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-12 pt-32 pb-20">
      <button
        onClick={onBack}
        className="mb-8 text-sm font-bold text-neutral-500 hover:text-neutral-950 transition"
      >
        ← Back to Marketplace
      </button>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          CampusCart Seller Studio
        </p>

        <h1 className="mt-2 text-4xl sm:text-5xl font-black font-display text-neutral-950">
          Sell an Item
        </h1>

        <p className="mt-3 text-sm text-neutral-500 max-w-2xl">
          Create a listing and make your unused or pre-owned items useful to
          another student.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-7"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Item title *
            </label>

            <input
              value={form.title}
              onChange={event => updateField('title', event.target.value)}
              placeholder="Example: Engineering Mathematics Book"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Category *
            </label>

            <select
              value={form.category}
              onChange={event => updateField('category', event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
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

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Listing type *
            </label>

            <select
              value={form.mode}
              onChange={event => updateField('mode', event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
            >
              <option value="BUY">Sell</option>
              <option value="RENT">Rent</option>
              <option value="EXCHANGE">Exchange</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Price *
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={event => updateField('price', event.target.value)}
              placeholder="Enter price"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Condition *
            </label>

            <select
              value={form.condition}
              onChange={event => updateField('condition', event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
            >
              <option>Brand New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Repair</option>
            </select>
          </div>

          {form.mode === 'RENT' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-800 mb-2">
                Rental rate *
              </label>

              <input
                value={form.rentalRate}
                onChange={event =>
                  updateField('rentalRate', event.target.value)
                }
                placeholder="Example: ₹50 per day"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>
          )}

          {form.mode === 'EXCHANGE' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-800 mb-2">
                What do you want in exchange? *
              </label>

              <input
                value={form.exchangeWish}
                onChange={event =>
                  updateField('exchangeWish', event.target.value)
                }
                placeholder="Example: Looking for a scientific calculator"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Description *
            </label>

            <textarea
              value={form.description}
              onChange={event =>
                updateField('description', event.target.value)
              }
              placeholder="Describe the item, its condition, and any important details..."
              rows="5"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Pickup location *
            </label>

            <input
              value={form.pickupLocation}
              onChange={event =>
                updateField('pickupLocation', event.target.value)
              }
              placeholder="Example: Main Library Entrance"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              Image URL
            </label>

            <input
              type="url"
              value={form.image}
              onChange={event => updateField('image', event.target.value)}
              placeholder="https://example.com/item-image.jpg"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-950"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-600">
          <strong className="text-neutral-950">Prototype notice:</strong> This
          listing is currently stored only in the browser session. It will be
          saved permanently after we connect the FastAPI backend and database.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-neutral-200 py-3 px-5 font-bold text-neutral-700 hover:bg-neutral-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 rounded-xl bg-neutral-950 text-white py-3 px-5 font-bold hover:bg-neutral-800 transition"
          >
            Publish Listing
          </button>
        </div>
      </form>
    </section>
  );
}

export default SellItemView;
