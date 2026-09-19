import React, { useState } from "react";
import { Star, Heart, Building2 } from "lucide-react";

export default function RecommendedPGs({
  properties = [],
  onSelectProperty,
  onViewAll,
  favorites = [],
  onToggleFavorite,
  title = "Recommended PGs for You",
  emptyMessage = "No properties available matching your criteria.",
}) {
  const items = (properties || []).map((p, idx) => ({
    id: p._id || `pg-${idx}`,
    title: p.title || "Student PG Accommodation",
    location: p.location
      ? `${p.location.area || ""}, ${p.location.city || ""}`.replace(/^, /, "")
      : "Ahmedabad",
    price: p.pricing?.monthlyRent || 0,
    rating: p.averageRating ? Number(p.averageRating).toFixed(1) : "4.5",
    reviewCount: p.reviews?.length || p.reviewCount || 0,
    amenities:
      p.amenities && p.amenities.length > 0
        ? p.amenities.slice(0, 4)
        : ["Wi-Fi", "Clean Rooms", "Furnished"],
    image:
      p.images?.[0] ||
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    raw: p,
  }));

  const isItemSaved = (pgId) => {
    return (favorites || []).some(
      (f) => String(f.property?._id || f.property) === String(pgId)
    );
  };

  const handleToggle = (e, pgId) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(pgId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#5b3bf5] hover:underline cursor-pointer"
          >
            View all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center space-y-2 shadow-xs">
          <div className="h-10 w-10 mx-auto rounded-full bg-[#f5f2ff] text-[#5b3bf5] flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">No Listings Found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">{emptyMessage}</p>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((pg) => {
            const isSaved = isItemSaved(pg.raw?._id || pg.id);

            return (
              <div
                key={pg.id}
                onClick={() => onSelectProperty?.(pg.raw || pg)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 flex flex-col justify-between"
              >
                {/* Image with Heart Button */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
                  <img
                    src={pg.image}
                    alt={pg.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80";
                    }}
                  />

                  <button
                    type="button"
                    onClick={(e) => handleToggle(e, pg.raw?._id || pg.id)}
                    title={isSaved ? "Saved" : "Save PG"}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-gray-500 shadow-sm transition hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#5b3bf5] transition-colors">
                      {pg.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {pg.location}
                    </p>
                  </div>

                  {/* Price & Rating Row */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{pg.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-gray-400">/month</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="font-bold text-gray-800">{pg.rating}</span>
                      <span className="text-[11px] text-gray-400">
                        ({pg.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pg.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
