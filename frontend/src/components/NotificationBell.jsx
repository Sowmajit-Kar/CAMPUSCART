import React, { useState, useRef, useEffect } from "react";

export default function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-xs text-neutral-300 hover:text-white flex items-center justify-center font-semibold transition p-2 rounded-full hover:bg-white/10 border border-white/10 hover:border-white/30 cursor-pointer"
        title="Seller & Order Notifications"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={unreadCount > 0 ? "text-amber-400 animate-pulse" : ""}
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center font-black shadow-md border border-neutral-900 animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
          style={{
            background: "rgba(18, 20, 26, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                Seller Sales &amp; Alerts
              </h3>
              {unreadCount > 0 && (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => onMarkAllRead && onMarkAllRead()}
                className="text-[11px] text-neutral-400 hover:text-white transition font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div
            className="max-h-80 overflow-y-auto divide-y divide-white/5"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
          >
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-white/40 text-lg">
                  📭
                </div>
                <p className="text-xs font-semibold text-neutral-400">
                  No sales notifications yet
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">
                  When a student buys one of your listings, you'll be alerted here instantly!
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.read;
                return (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead && onMarkRead(n.id)}
                    className={`p-3.5 transition flex gap-3 cursor-pointer ${
                      isUnread
                        ? "bg-amber-400/[0.08] hover:bg-amber-400/[0.13]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex-shrink-0 text-xl pt-0.5">
                      {n.type === "ITEM_SOLD" ? "🎉" : "📦"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isUnread ? "text-amber-300" : "text-white"
                          }`}
                        >
                          {n.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed line-clamp-3">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px] text-neutral-500">
                        {n.pickup_token && (
                          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-neutral-300 font-bold">
                            Token: {n.pickup_token}
                          </span>
                        )}
                        <span>
                          {n.created_at
                            ? new Date(n.created_at).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 bg-black/40 text-center text-[10px] text-neutral-500">
            Secure QR Handshake verification protects both Buyer and Seller
          </div>
        </div>
      )}
    </div>
  );
}
