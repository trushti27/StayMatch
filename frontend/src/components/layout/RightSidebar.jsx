import React, { useState } from "react";
import {
  Clock,
  Sparkles,
  BookOpen,
  Utensils,
  Users,
  CigaretteOff,
  Check,
  CreditCard,
  Search,
} from "lucide-react";

export default function RightSidebar({
  onNavigateTab,
  onOpenPayment,
  matches = [],
}) {
  const [requestSent, setRequestSent] = useState(false);

  const topMatch = matches && matches.length > 0 ? matches[0] : null;

  const defaultHabits = [
    { label: "Sleep Schedule", value: "Early Riser", icon: Clock },
    { label: "Cleanliness", value: "Very Clean", icon: Sparkles },
    { label: "Study Habits", value: "Focused", icon: BookOpen },
    { label: "Food Preference", value: "Vegetarian", icon: Utensils },
    { label: "Guests", value: "Sometimes", icon: Users },
    { label: "Smoking", value: "No", icon: CigaretteOff },
  ];

  return (
    <aside className="w-80 shrink-0 space-y-5">
      {/* Card 1: Roommate Match */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Roommate Match</h3>
          <button
            type="button"
            onClick={() => onNavigateTab?.("matches")}
            className="text-xs font-semibold text-[#5b3bf5] hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Profile Card Info */}
        {topMatch ? (
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  topMatch.user?.profileImage ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                }
                alt={topMatch.name || "Roommate"}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {topMatch.name || `${topMatch.user?.firstName} ${topMatch.user?.lastName}`}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {topMatch.user?.college || "University Student"}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e6f9ed] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                {topMatch.compatibilityScore || 90}% Match
              </span>
            </div>

            {/* Lifestyle Habits List */}
            <div className="space-y-2.5 pt-1 text-xs">
              {defaultHabits.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-gray-700"
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <Icon className="h-3.5 w-3.5 text-gray-400" />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setRequestSent(true)}
              disabled={requestSent}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                requestSent
                  ? "bg-[#e6f9ed] text-[#16a34a] border border-[#bbf7d0]"
                  : "border border-[#5b3bf5] text-[#5b3bf5] bg-white hover:bg-[#f5f2ff] active:scale-98"
              }`}
            >
              {requestSent ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Request Sent</span>
                </>
              ) : (
                "Send Request"
              )}
            </button>
          </div>
        ) : (
          <div className="pt-4 text-center space-y-3 py-4">
            <div className="h-10 w-10 mx-auto rounded-full bg-[#f5f2ff] text-[#5b3bf5] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">No Match Yet</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Complete questionnaire to calculate AI roommate compatibility.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab?.("questionnaire")}
              className="rounded-xl bg-[#5b3bf5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4a2ce0] cursor-pointer"
            >
              Update Preferences
            </button>
          </div>
        )}
      </div>

      {/* Card 2: Your Next Payment */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Your Next Payment</h3>
          <button
            type="button"
            onClick={() => onNavigateTab?.("payments")}
            className="text-xs font-semibold text-[#5b3bf5] hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="pt-4 text-center space-y-3 py-3">
          <div className="h-10 w-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">No Upcoming Payments</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[200px] mx-auto">
              You have no active lease or rent dues pending at this time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab?.("properties")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <span>Find PG / Rooms</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
