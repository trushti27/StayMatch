import React from "react";
import { X, MapPin, Star, ShieldCheck, Check } from "lucide-react";

export default function PropertyDetailModal({ property, onClose, onContact }) {
  if (!property) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified PG Listing</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-gray-900">{property.title}</h2>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-[#5b3bf5]" />
              <span>{property.location}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="text-[11px] text-gray-500 block">Monthly Rent</span>
              <b className="text-base text-gray-900 font-bold">₹{property.price?.toLocaleString()}</b>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="text-[11px] text-gray-500 block">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <b className="text-base text-gray-900">{property.rating || "4.5"}</b>
                <span className="text-xs text-gray-400">({property.reviewCount || "96"})</span>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="text-[11px] text-gray-500 block">Room Type</span>
              <b className="text-base text-gray-900 font-bold">{property.roomType || "2-sharing"}</b>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="text-[11px] text-gray-500 block">Notice Period</span>
              <b className="text-base text-gray-900 font-bold">1 Month</b>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Amenities Included</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {(property.amenities || ["Wi-Fi", "Food", "AC", "Laundry", "24/7 Security"]).map((am) => (
                <span key={am} className="inline-flex items-center gap-1 rounded-lg bg-[#f5f2ff] px-2.5 py-1 text-xs font-medium text-[#5b3bf5]">
                  <Check className="h-3 w-3" />
                  {am}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                onContact?.(property);
                onClose();
              }}
              className="flex-1 rounded-xl bg-[#5b3bf5] py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#4a2ce0]"
            >
              Contact Owner / Book Visit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
