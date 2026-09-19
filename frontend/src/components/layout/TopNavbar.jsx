import React, { useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  MessageSquare,
  Bell,
  Home,
  User,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

export default function TopNavbar({
  user,
  selectedCity = "Ahmedabad",
  onCityChange,
  searchQuery = "",
  onSearchChange,
  onNavigateTab,
  onLogout,
}) {
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const cities = [
    "Ahmedabad",
    "Gandhinagar",
    "Vadodara",
    "Surat",
    "Rajkot",
    "Anand",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Bharuch",
    "Vapi",
    "Navsari",
    "Mehsana",
    "Morbi",
  ];

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email?.split("@")[0] || "Neeraj Patel"
    : "Neeraj Patel";

  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Student";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#ececf6] bg-white px-4 sm:px-6 lg:px-8">
      {/* Brand Logo */}
      <div
        className="flex cursor-pointer items-center gap-3 select-none"
        onClick={() => onNavigateTab?.("overview")}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8d3ff] bg-[#f5f2ff] text-[#5b3bf5] shadow-xs transition-transform hover:scale-105">
          <Home className="h-6 w-6 stroke-[2.2]" />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-[#16172d]">
              Stay<span className="text-[#5b3bf5]">Match</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#7c78aa]">
            Find Home, Find Match.
          </span>
        </div>
      </div>

      {/* Center: Search & Location */}
      <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl px-6 gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search by location, college or pg name..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-[#fafaff] pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#5b3bf5] focus:bg-white focus:ring-2 focus:ring-[#5b3bf5]/20"
          />
        </div>

        {/* City selector pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCityMenu(!showCityMenu)}
            className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:border-[#5b3bf5]"
          >
            <MapPin className="h-4 w-4 text-[#5b3bf5]" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200" />
          </button>

          {showCityMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Select City
              </p>
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    onCityChange?.(city);
                    setShowCityMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition ${
                    selectedCity === city
                      ? "bg-[#f1edff] font-semibold text-[#5b3bf5]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5b3bf5]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Messages icon */}
        <button
          type="button"
          onClick={() => onNavigateTab?.("chats")}
          title="Messages"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-[#5b3bf5]"
        >
          <MessageSquare className="h-[19px] w-[19px]" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-[#5b3bf5]"
          >
            <Bell className="h-[19px] w-[19px]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-bold text-white shadow-xs">
              3
            </span>
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 px-1">
                <span className="text-sm font-bold text-gray-900">Notifications</span>
                <span className="rounded-full bg-[#5b3bf5]/10 px-2 py-0.5 text-[11px] font-semibold text-[#5b3bf5]">
                  2 updates
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="rounded-xl bg-[#f5f3ff] p-2.5 transition hover:bg-[#ede9fe]">
                  <p className="font-semibold text-[#5b3bf5]">Roommate Compatibility Ready</p>
                  <p className="text-gray-600 mt-0.5">Your Lifestyle Compatibility Index has matched you with prospective roommates.</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Active</span>
                </div>
                <div className="rounded-xl bg-gray-50 p-2.5 transition hover:bg-gray-100">
                  <p className="font-semibold text-gray-800">Verified Listings</p>
                  <p className="text-gray-600 mt-0.5">New admin-verified accommodations are available near your campus.</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Recent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-gray-50"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#ece8ff]"
            />
            <div className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-bold text-gray-900">
                {displayName}
              </span>
              <span className="block text-xs font-medium text-gray-500">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-sm font-bold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "neeraj.patel@student.ac.in"}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab?.("profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#f5f2ff] hover:text-[#5b3bf5]"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab?.("questionnaire");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#f5f2ff] hover:text-[#5b3bf5]"
                >
                  <Sparkles className="h-4 w-4 text-[#5b3bf5]" />
                  Lifestyle Preferences
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab?.("settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#f5f2ff] hover:text-[#5b3bf5]"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
