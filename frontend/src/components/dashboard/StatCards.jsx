import React from "react";
import { Home, Users, Star, Wallet } from "lucide-react";

export default function StatCards({
  shortlistedCount = 12,
  roommateMatchesCount = 8,
  reviewsCount = 5,
  totalSavedAmount = 5430,
  onNavigateTab,
}) {
  const cards = [
    {
      id: "favorites",
      title: "Shortlisted PGs",
      value: shortlistedCount,
      linkText: "View all",
      actionTab: "favorites",
      icon: Home,
      iconBg: "bg-[#5b3bf5]",
    },
    {
      id: "matches",
      title: "Roommate Matches",
      value: roommateMatchesCount,
      linkText: "View matches",
      actionTab: "matches",
      icon: Users,
      iconBg: "bg-[#22c55e]",
    },
    {
      id: "reviews",
      title: "Reviews Given",
      value: reviewsCount,
      linkText: "View reviews",
      actionTab: "reviews",
      icon: Star,
      iconBg: "bg-[#f59e0b]",
    },
    {
      id: "savings",
      title: "Total Saved",
      value: `₹${totalSavedAmount.toLocaleString("en-IN")}`,
      subtitle: "This Month",
      icon: Wallet,
      iconBg: "bg-[#0ea5e9]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${card.iconBg}`}
            >
              <Icon className="h-6 w-6 stroke-[2.2]" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-gray-500">
                {card.title}
              </span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-gray-900">
                {card.value}
              </span>

              {card.linkText ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab?.(card.actionTab)}
                  className="mt-2 text-xs font-semibold text-[#5b3bf5] hover:underline"
                >
                  {card.linkText}
                </button>
              ) : card.subtitle ? (
                <span className="mt-2 block text-xs font-medium text-gray-400">
                  {card.subtitle}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
