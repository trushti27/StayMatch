import React from "react";
import {
  LayoutDashboard,
  Search,
  Users,
  Heart,
  CalendarDays,
  MessageSquare,
  Star,
  Wrench,
  CreditCard,
  ShoppingCart,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

export default function LeftSidebar({
  currentTab = "overview",
  onSelectTab,
  onOpenInvite,
  onLogout,
  unreadMessagesCount = 0,
  favoritesCount = 0,
  reviewsCount = 0,
}) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "properties", label: "Find PG / Rooms", icon: Search },
    { id: "matches", label: "Roommate Match", icon: Users },
    {
      id: "favorites",
      label: "Shortlisted",
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    { id: "bookings", label: "My Bookings", icon: CalendarDays },
    {
      id: "chats",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      badge: reviewsCount > 0 ? reviewsCount : null,
    },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "safety", label: "Safety & Local Info", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut, isAction: true },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#ececf6] bg-white p-4 flex flex-col justify-between min-h-[calc(100vh-76px)]">
      {/* Navigation List */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.isAction && item.id === "logout") {
                  onLogout?.();
                } else {
                  onSelectTab?.(item.id);
                }
              }}
              className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#f1edff] text-[#5b3bf5] font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-[18px] w-[18px] transition-colors ${
                    isActive
                      ? "text-[#5b3bf5]"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5b3bf5] text-[11px] font-bold text-white shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo Card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#ebe5ff] via-[#f3f0ff] to-[#e8e2ff] p-4 text-center shadow-xs border border-[#ddd6fe]/50">
        <div className="mb-2 flex items-center justify-center">
          {/* Friendly stylized illustration of students */}
          <div className="relative h-20 w-32">
            <svg
              viewBox="0 0 160 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <circle cx="80" cy="50" r="45" fill="#e0d7ff" opacity="0.6" />
              {/* Person 1 */}
              <circle cx="55" cy="35" r="14" fill="#374151" />
              <path
                d="M38 78C38 62 45 54 55 54C65 54 72 62 72 78"
                fill="#5b3bf5"
              />
              <circle cx="57" cy="37" r="10" fill="#fcd34d" />
              {/* Person 2 */}
              <circle cx="102" cy="40" r="13" fill="#374151" />
              <path
                d="M87 80C87 66 94 58 102 58C110 58 117 66 117 80"
                fill="#ec4899"
              />
              <circle cx="100" cy="42" r="9" fill="#fcd34d" />
              {/* High five hand */}
              <path
                d="M66 48L88 44"
                stroke="#5b3bf5"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Sparkle */}
              <path
                d="M80 22L82 28L88 30L82 32L80 38L78 32L72 30L78 28Z"
                fill="#fbbf24"
              />
            </svg>
          </div>
        </div>

        <h4 className="text-xs font-bold text-gray-900 leading-snug">
          Invite your friends & get benefits
        </h4>

        <button
          type="button"
          onClick={onOpenInvite}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#5b3bf5] py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#4a2ce0] active:scale-[0.98]"
        >
          Invite Now
        </button>
      </div>
    </aside>
  );
}
