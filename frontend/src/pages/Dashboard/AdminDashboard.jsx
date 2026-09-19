import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Building2,
  Home,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  ExternalLink,
  X,
  Filter,
  Check,
  XCircle,
  Info,
  ShieldAlert,
  Eye,
  EyeOff,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  Star,
  CheckSquare,
  Square,
  Sliders,
} from "lucide-react";
import api from "../../services/api";

const getDocumentUrl = (fileUrl) => {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  const backendBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")
    : "http://localhost:5000";
  return `${backendBase}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
};

export default function AdminDashboard({ user: loggedInUser, onLogout }) {
  // Navigation
  const [currentTab, setCurrentTab] = useState("overview");

  // Global search input in header
  const [headerSearch, setHeaderSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalOwners: 0,
    totalProperties: 0,
    pendingOwners: 0,
    pendingProperties: 0,
    openReports: 0,
    breakdown: {},
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // Properties State
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertyStatusFilter, setPropertyStatusFilter] = useState("all");
  const [propertySearch, setPropertySearch] = useState("");
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);
  const [loadingPropertyDetail, setLoadingPropertyDetail] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Reports State
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportStatusFilter, setReportStatusFilter] = useState("all");

  // Action Dialog State (for notes, rejection reasons, or resolutions)
  const [actionModal, setActionModal] = useState(null);
  // Shape: { type: 'user_reject' | 'user_verify' | 'property_reject' | 'property_verify' | 'report_resolve', id: string, title: string, subtitle: string, defaultNote?: string }
  const [modalInputText, setModalInputText] = useState("");
  const [actionProcessing, setActionProcessing] = useState(false);

  // Settings State
  const [systemSettings, setSystemSettings] = useState({
    autoRequireKyc: true,
    strictContentFilter: true,
    maintenanceMode: false,
    auditLogRetentionDays: 90,
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // 1. Fetch Overview Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/stats");
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      showToast("Unable to load overview statistics.", "error");
    } finally {
      setLoadingStats(false);
    }
  }, [showToast]);

  // 2. Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/admin/users");
      if (res.data?.success && res.data?.data?.users) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      showToast("Unable to fetch users registry.", "error");
    } finally {
      setLoadingUsers(false);
    }
  }, [showToast]);

  // 3. Fetch Properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true);
      const res = await api.get("/admin/properties");
      if (res.data?.success && res.data?.data?.properties) {
        setProperties(res.data.data.properties);
      }
    } catch (err) {
      console.error("Failed to load properties:", err);
      showToast("Unable to fetch property listings.", "error");
    } finally {
      setLoadingProperties(false);
    }
  }, [showToast]);

  // 4. Fetch Reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const res = await api.get("/admin/reviews");
      if (res.data?.success && res.data?.data?.reviews) {
        setReviews(res.data.data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  // 5. Fetch Reports
  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const res = await api.get("/admin/reports");
      if (res.data?.success && res.data?.data?.reports) {
        setReports(res.data.data.reports);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchProperties();
    fetchReviews();
    fetchReports();
  }, [fetchStats, fetchUsers, fetchProperties, fetchReviews, fetchReports]);

  // Handle opening user details modal with full backend data
  const handleOpenUserDetail = async (userObj) => {
    try {
      setSelectedUserDetail({ user: userObj, properties: [], reviews: [] });
      setLoadingUserDetail(true);
      const res = await api.get(`/admin/users/${userObj._id}`);
      if (res.data?.success && res.data?.data) {
        setSelectedUserDetail(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load full user details:", err);
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // Handle opening property details modal
  const handleOpenPropertyDetail = async (propObj) => {
    try {
      setSelectedPropertyDetail({ property: propObj, reviews: [] });
      setLoadingPropertyDetail(true);
      const res = await api.get(`/admin/properties/${propObj._id}`);
      if (res.data?.success && res.data?.data) {
        setSelectedPropertyDetail(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load property details:", err);
    } finally {
      setLoadingPropertyDetail(false);
    }
  };

  // Direct User Verification / Rejection
  const handleExecuteUserVerification = async (userId, targetStatus, note = "") => {
    try {
      setActionProcessing(true);
      const res = await api.patch(`/admin/users/${userId}`, {
        verificationStatus: targetStatus,
        verificationNote: note,
      });

      if (res.data?.success && res.data?.data?.user) {
        const updated = res.data.data.user;
        // Update in-memory users list
        setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
        // Update selected modal if open
        if (selectedUserDetail && selectedUserDetail.user._id === updated._id) {
          setSelectedUserDetail((prev) => ({
            ...prev,
            user: { ...prev.user, ...updated },
          }));
        }
        showToast(
          `User ${updated.firstName} ${updated.lastName} marked as ${targetStatus.toUpperCase()}.`,
          targetStatus === "verified" ? "success" : "info"
        );
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      showToast(err.response?.data?.message || "Failed to update user verification.", "error");
    } finally {
      setActionProcessing(false);
      setActionModal(null);
      setModalInputText("");
    }
  };

  // Toggle user active / inactive account status
  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      const res = await api.patch(`/admin/users/${userId}`, {
        isActive: !currentActive,
      });
      if (res.data?.success && res.data?.data?.user) {
        const updated = res.data.data.user;
        setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
        if (selectedUserDetail && selectedUserDetail.user._id === updated._id) {
          setSelectedUserDetail((prev) => ({
            ...prev,
            user: { ...prev.user, ...updated },
          }));
        }
        showToast(`Account is now ${updated.isActive ? "ACTIVE" : "DEACTIVATED"}.`);
      }
    } catch (err) {
      showToast("Failed to toggle account active status.", "error");
    }
  };

  // Direct Property Approval / Rejection
  const handleExecutePropertyVerification = async (propertyId, targetStatus, reason = "") => {
    try {
      setActionProcessing(true);
      const res = await api.patch(`/admin/properties/${propertyId}`, {
        status: targetStatus,
        rejectionReason: reason,
      });

      if (res.data?.success && res.data?.data?.property) {
        const updated = res.data.data.property;
        // Update in-memory property list
        setProperties((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
        // Update modal if open
        if (selectedPropertyDetail && selectedPropertyDetail.property._id === updated._id) {
          setSelectedPropertyDetail((prev) => ({
            ...prev,
            property: { ...prev.property, ...updated },
          }));
        }
        showToast(
          `Property "${updated.title}" marked as ${targetStatus.toUpperCase()}.`,
          targetStatus === "verified" ? "success" : "info"
        );
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating property verification:", err);
      showToast(err.response?.data?.message || "Failed to update property status.", "error");
    } finally {
      setActionProcessing(false);
      setActionModal(null);
      setModalInputText("");
    }
  };

  // Toggle Review Visibility
  const handleToggleReviewVisibility = async (reviewId, currentVisibility) => {
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}`, {
        isVisible: !currentVisibility,
      });
      if (res.data?.success && res.data?.data?.review) {
        const updated = res.data.data.review;
        setReviews((prev) => prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)));
        showToast(`Review is now ${updated.isVisible ? "VISIBLE" : "HIDDEN"}.`);
      }
    } catch (err) {
      showToast("Failed to update review visibility.", "error");
    }
  };

  // Resolve Report
  const handleResolveReport = async (reportId, targetStatus, resolutionText) => {
    try {
      setActionProcessing(true);
      const res = await api.patch(`/admin/reports/${reportId}`, {
        status: targetStatus,
        resolution: resolutionText,
      });
      if (res.data?.success && res.data?.data?.report) {
        const updated = res.data.data.report;
        setReports((prev) => prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)));
        showToast(`Report has been ${targetStatus.toUpperCase()}.`);
        fetchStats();
      }
    } catch (err) {
      showToast("Failed to resolve report.", "error");
    } finally {
      setActionProcessing(false);
      setActionModal(null);
      setModalInputText("");
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
      // Verification status filter
      if (userStatusFilter !== "all") {
        const stat = u.verificationStatus || "unsubmitted";
        if (stat !== userStatusFilter) return false;
      }
      // Search
      const searchEffective = (userSearch || headerSearch).trim().toLowerCase();
      if (searchEffective) {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const business = (u.businessName || "").toLowerCase();
        const city = (u.city || "").toLowerCase();
        if (
          !fullName.includes(searchEffective) &&
          !email.includes(searchEffective) &&
          !business.includes(searchEffective) &&
          !city.includes(searchEffective)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [users, userRoleFilter, userStatusFilter, userSearch, headerSearch]);

  // Owners list (convenience view)
  const ownersList = useMemo(() => {
    return filteredUsers.filter((u) => u.role === "owner");
  }, [filteredUsers]);

  // Filtered Properties List
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (propertyStatusFilter !== "all" && p.verificationStatus !== propertyStatusFilter) return false;
      const searchEffective = (propertySearch || headerSearch).trim().toLowerCase();
      if (searchEffective) {
        const title = (p.title || "").toLowerCase();
        const city = (p.location?.city || "").toLowerCase();
        const area = (p.location?.area || "").toLowerCase();
        const ownerName = `${p.owner?.firstName || ""} ${p.owner?.lastName || ""}`.toLowerCase();
        if (
          !title.includes(searchEffective) &&
          !city.includes(searchEffective) &&
          !area.includes(searchEffective) &&
          !ownerName.includes(searchEffective)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [properties, propertyStatusFilter, propertySearch, headerSearch]);

  // Pending Owners Queue
  const pendingOwnersQueue = useMemo(() => {
    return users.filter((u) => u.role === "owner" && u.verificationStatus === "pending");
  }, [users]);

  // Pending Properties Queue
  const pendingPropertiesQueue = useMemo(() => {
    return properties.filter((p) => p.verificationStatus === "pending");
  }, [properties]);

  // Open Reports Queue
  const openReportsQueue = useMemo(() => {
    return reports.filter((r) => r.status === "pending");
  }, [reports]);

  // Verification Status Badge Component
  const renderVerificationBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Rejected
          </span>
        );
      case "unsubmitted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 border border-slate-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Unverified
          </span>
        );
    }
  };

  // Nav Items matching the prompt requirements
  const navItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "users", label: "Manage Users", icon: Users, badge: users.length ? String(users.length) : null },
    { id: "owners", label: "Manage Owners", icon: Building2, badge: ownersList.length ? String(ownersList.length) : null },
    { id: "properties", label: "Manage Properties", icon: Home, badge: properties.length ? String(properties.length) : null },
    {
      id: "verification",
      label: "Verification",
      icon: ShieldCheck,
      badge: stats.pendingOwners + stats.pendingProperties > 0 ? String(stats.pendingOwners + stats.pendingProperties) : null,
      highlight: stats.pendingOwners + stats.pendingProperties > 0,
    },
    { id: "reviews", label: "Reviews", icon: Star, badge: reviews.length ? String(reviews.length) : null },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      badge: stats.openReports > 0 ? String(stats.openReports) : null,
      highlight: stats.openReports > 0,
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
              toast.type === "error"
                ? "bg-rose-950/90 border-rose-600 text-rose-200"
                : toast.type === "info"
                ? "bg-slate-900/90 border-indigo-500 text-indigo-200"
                : "bg-emerald-950/90 border-emerald-500 text-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Command Navbar */}
      <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-800/80 bg-[#0c1220]/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        {/* Brand Shield & Title */}
        <div
          className="flex cursor-pointer items-center gap-3 select-none"
          onClick={() => setCurrentTab("overview")}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Stay<span className="text-indigo-400">Match</span>
              </span>
              <span className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                Admin Deck
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Online · Live Database</span>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-lg px-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Quick search users, properties, cities, or emails..."
              className="h-9 w-full rounded-xl border border-slate-700/80 bg-slate-900/80 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            {headerSearch && (
              <button
                type="button"
                onClick={() => setHeaderSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3">
          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={() => {
              fetchStats();
              fetchUsers();
              fetchProperties();
              fetchReviews();
              fetchReports();
              showToast("All data synchronized with MongoDB.");
            }}
            title="Refresh All Real Data"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 hover:bg-slate-850 transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loadingStats ? "animate-spin text-indigo-400" : ""}`} />
          </button>

          {/* Pending Alerts Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="System Alerts"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {stats.pendingOwners + stats.pendingProperties + stats.openReports > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {stats.pendingOwners + stats.pendingProperties + stats.openReports}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl z-50 backdrop-blur-xl">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Action Required</span>
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
                    Realtime DB
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div
                    onClick={() => {
                      setCurrentTab("verification");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 cursor-pointer hover:bg-amber-500/20 transition flex items-center justify-between"
                  >
                    <span>{stats.pendingOwners} Owner KYC submissions pending</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div
                    onClick={() => {
                      setCurrentTab("properties");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 cursor-pointer hover:bg-indigo-500/20 transition flex items-center justify-between"
                  >
                    <span>{stats.pendingProperties} Properties waiting verification</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div
                    onClick={() => {
                      setCurrentTab("reports");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 cursor-pointer hover:bg-rose-500/20 transition flex items-center justify-between"
                  >
                    <span>{stats.openReports} Open user disputes / reports</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 hover:border-slate-700 cursor-pointer transition"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xs font-bold ring-1 ring-indigo-400/30">
                {loggedInUser?.firstName ? loggedInUser.firstName[0] : "A"}
              </div>
              <div className="hidden sm:block text-left leading-tight pr-1">
                <span className="block text-xs font-bold text-white">
                  {loggedInUser?.firstName || "System"} {loggedInUser?.lastName || "Admin"}
                </span>
                <span className="block text-[10px] font-mono text-indigo-400">
                  {loggedInUser?.email || "admin@staymatch.demo"}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl z-50 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Role</span>
                  <span className="text-xs font-semibold text-emerald-400">Super Administrator</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setCurrentTab("settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" />
                  System Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Administrative Workplace */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Left Admin Command Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-[#0b0f19] p-4 flex flex-col justify-between min-h-[calc(100vh-70px)]">
          <div className="space-y-6">
            <div className="px-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                Control Deck
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentTab(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-inner"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-[18px] w-[18px] transition ${
                          isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span
                        className={`flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.highlight
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                            : "bg-slate-800 text-slate-400 border border-slate-700/50"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Logout & Version Box */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => onLogout?.()}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
              <span className="text-[10px] text-slate-400">Exit session</span>
            </button>

            <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Governance</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">StayMatch Production v2.8</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden bg-[#090d16]">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {currentTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Greeting & Realtime Sync Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <span>Admin Operations Center</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      Live MongoDB
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                    System performance, pending verifications, user registry, and listing oversight.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-mono text-slate-300">
                    Host: <span className="text-emerald-400 font-bold">127.0.0.1:27017</span>
                  </div>
                </div>
              </div>

              {/* 7 Overview Statistics KPI Cards (As requested by user prompt) */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
                  Overview Statistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Total Users */}
                  <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-lg transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Users
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {loadingStats ? "..." : stats.totalUsers}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center">
                        Active Database
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Students, owners & platform admins
                    </span>
                  </div>

                  {/* 2. Total Students */}
                  <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-lg transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Students
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {loadingStats ? "..." : stats.totalStudents}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">registered</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Across Pune & Ahmedabad campuses
                    </span>
                  </div>

                  {/* 3. Total Property Owners */}
                  <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-lg transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Property Owners
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {loadingStats ? "..." : stats.totalOwners}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        {stats.breakdown?.verifiedOwners || 0} Verified
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Hosting PGs & flats on platform
                    </span>
                  </div>

                  {/* 4. Total Properties */}
                  <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-lg transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Properties
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Home className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {loadingStats ? "..." : stats.totalProperties}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold">
                        {stats.breakdown?.verifiedProperties || 0} Approved
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Listings recorded in MongoDB
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Critical Operational Action Alert Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 5. Pending Owner Verifications */}
                <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-br from-[#181119] to-[#121624] p-5 shadow-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                        Pending Owner KYC
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white">
                      {loadingStats ? "..." : stats.pendingOwners}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab("verification");
                      }}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      Review owner documents →
                    </button>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>

                {/* 6. Pending Property Approvals */}
                <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#1a1711] to-[#121624] p-5 shadow-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Pending Properties
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white">
                      {loadingStats ? "..." : stats.pendingProperties}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab("properties");
                        setPropertyStatusFilter("pending");
                      }}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      Approve or inspect listings →
                    </button>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Home className="h-6 w-6" />
                  </div>
                </div>

                {/* 7. Open Reports */}
                <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#0f1424] to-[#121624] p-5 shadow-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Open Reports
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white">
                      {loadingStats ? "..." : stats.openReports}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("reports")}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      Investigate disputes →
                    </button>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Action Queues Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Owners Quick Action Card */}
                <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Pending Owner Verifications</h3>
                        <p className="text-[11px] text-slate-400">KYC proof submissions needing action</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("verification")}
                      className="text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      View All ({pendingOwnersQueue.length})
                    </button>
                  </div>

                  {pendingOwnersQueue.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-70" />
                      All owner verifications are currently up to date!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingOwnersQueue.slice(0, 3).map((owner) => (
                        <div
                          key={owner._id}
                          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">
                                {owner.firstName} {owner.lastName}
                              </span>
                              <span className="rounded bg-amber-500/10 text-amber-400 px-1.5 py-0.2 text-[10px] font-semibold">
                                {owner.businessName || "Owner"}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {owner.email} · {owner.city || "Ahmedabad"}
                            </span>
                            {owner.verificationNote && (
                              <span className="text-[10px] text-indigo-300 font-mono mt-1 block">
                                Note: {owner.verificationNote}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "user_verify",
                                  id: owner._id,
                                  title: `Verify ${owner.firstName} ${owner.lastName}`,
                                  subtitle: "Approves owner account and enables verified badge.",
                                  defaultNote: "Identity and property ownership documents verified.",
                                })
                              }
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "user_reject",
                                  id: owner._id,
                                  title: `Reject ${owner.firstName} ${owner.lastName}`,
                                  subtitle: "Rejects KYC submission. Reason will be saved.",
                                  defaultNote: "Incomplete documentation. Please re-upload valid government ID.",
                                })
                              }
                              className="rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 px-3 py-1.5 text-xs font-bold text-rose-300 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Properties Quick Action Card */}
                <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Pending Property Approvals</h3>
                        <p className="text-[11px] text-slate-400">Newly listed accommodations awaiting review</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab("properties");
                        setPropertyStatusFilter("pending");
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      View All ({pendingPropertiesQueue.length})
                    </button>
                  </div>

                  {pendingPropertiesQueue.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-70" />
                      All property listings have been reviewed!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingPropertiesQueue.slice(0, 3).map((prop) => (
                        <div
                          key={prop._id}
                          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{prop.title}</span>
                              <span className="rounded bg-indigo-500/10 text-indigo-300 px-1.5 py-0.2 text-[10px] font-semibold">
                                {prop.propertyType}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {prop.location?.area}, {prop.location?.city} · ₹{prop.pricing?.monthlyRent}/mo
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Host: {prop.owner?.firstName} {prop.owner?.lastName} ({prop.owner?.email})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenPropertyDetail(prop)}
                              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "property_verify",
                                  id: prop._id,
                                  title: `Approve Listing: ${prop.title}`,
                                  subtitle: "Approves property to be published live on student dashboard search.",
                                })
                              }
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "property_reject",
                                  id: prop._id,
                                  title: `Reject Listing: ${prop.title}`,
                                  subtitle: "Rejection note will be stored with listing in MongoDB.",
                                  defaultNote: "Photos or room specifications do not match verification standards.",
                                })
                              }
                              className="rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 px-3 py-1.5 text-xs font-bold text-rose-300 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div
                  onClick={() => setCurrentTab("users")}
                  className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg hover:border-indigo-500/50 transition cursor-pointer group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3">Manage Users</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Filter students & owners, search registry, update status.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentTab("verification")}
                  className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg hover:border-indigo-500/50 transition cursor-pointer group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3">Verification Hub</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Unified queue for pending owner KYC & listing approvals.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentTab("reviews")}
                  className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg hover:border-indigo-500/50 transition cursor-pointer group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                    <Star className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3">Review Moderation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Inspect tenant feedback and toggle review visibility.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentTab("analytics")}
                  className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg hover:border-indigo-500/50 transition cursor-pointer group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3">Platform Analytics</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Examine distribution metrics, pass rates, and growth.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE USERS */}
          {currentTab === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Manage Users</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search and filter registered students, owners, and administrators.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchUsers}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 transition cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingUsers ? "animate-spin" : ""}`} />
                  Refresh List
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, city..."
                    className="h-9 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  {userSearch && (
                    <button
                      type="button"
                      onClick={() => setUserSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Role Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <span>Role:</span>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="owner">Owners</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>

                  {/* Verification Status Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Verification:</span>
                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="unsubmitted">Unverified</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-3xl border border-slate-800 bg-[#0c1220] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">City / Details</th>
                        <th className="px-5 py-3.5">Verification</th>
                        <th className="px-5 py-3.5">Account</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-medium">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-5 py-12 text-center text-slate-400 text-xs">
                            No users found matching your search and filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-900/50 transition">
                            {/* User Avatar & Name */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs ring-1 ring-slate-700">
                                  {u.firstName?.[0] || "U"}
                                </div>
                                <div>
                                  <span className="font-bold text-white block">
                                    {u.firstName} {u.lastName}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono block">
                                    {u.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="px-5 py-3.5">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  u.role === "admin"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : u.role === "owner"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>

                            {/* City / Business */}
                            <td className="px-5 py-3.5">
                              <span className="text-white block font-medium">
                                {u.role === "owner" ? u.businessName || "Individual Host" : u.college || "Student"}
                              </span>
                              <span className="text-[11px] text-slate-400 block">{u.city || "Not specified"}</span>
                            </td>

                            {/* Verification Status */}
                            <td className="px-5 py-3.5">{renderVerificationBadge(u.verificationStatus)}</td>

                            {/* Account Active Toggle */}
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  u.isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                              >
                                {u.isActive ? "Active" : "Disabled"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetail(u)}
                                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 cursor-pointer"
                                >
                                  Details
                                </button>
                                {u.verificationStatus !== "verified" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActionModal({
                                        type: "user_verify",
                                        id: u._id,
                                        title: `Verify ${u.firstName} ${u.lastName}`,
                                        subtitle: "Approve user account and set verification badge.",
                                        defaultNote: "User identity and documents approved.",
                                      })
                                    }
                                    className="rounded-lg bg-emerald-600/90 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white cursor-pointer"
                                  >
                                    Verify
                                  </button>
                                )}
                                {u.verificationStatus !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActionModal({
                                        type: "user_reject",
                                        id: u._id,
                                        title: `Reject ${u.firstName} ${u.lastName}`,
                                        subtitle: "Sets user status to rejected. Provide a reason note.",
                                        defaultNote: "Documentation missing or unverifiable.",
                                      })
                                    }
                                    className="rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-800/80 px-2.5 py-1 text-[11px] font-bold text-rose-300 cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE OWNERS */}
          {currentTab === "owners" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Manage Property Owners</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct oversight of registered property owners, business registrations, and KYC status.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#0c1220] px-3.5 py-2 text-xs font-mono text-indigo-300">
                  Total Owners: <span className="font-bold text-white">{ownersList.length}</span>
                </div>
              </div>

              {/* Owners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownersList.map((owner) => (
                  <div
                    key={owner._id}
                    className="rounded-3xl border border-slate-800 bg-[#0c1220] p-5 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-white block">
                              {owner.firstName} {owner.lastName}
                            </span>
                            <span className="text-xs text-indigo-400 font-medium block">
                              {owner.businessName || "Independent Host"}
                            </span>
                          </div>
                        </div>
                        {renderVerificationBadge(owner.verificationStatus)}
                      </div>

                      <div className="space-y-1 text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{owner.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{owner.phone || "No phone registered"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{owner.city || "Ahmedabad"}</span>
                        </div>
                      </div>

                      {owner.verificationNote && (
                        <div className="rounded-xl bg-slate-900 p-2.5 text-[11px] text-slate-300 font-mono border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Verification Note
                          </span>
                          {owner.verificationNote}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenUserDetail(owner)}
                        className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition cursor-pointer"
                      >
                        Inspect Profile
                      </button>

                      <div className="flex items-center gap-1.5">
                        {owner.verificationStatus !== "verified" && (
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "user_verify",
                                id: owner._id,
                                title: `Verify Owner: ${owner.firstName} ${owner.lastName}`,
                                subtitle: "Confirm owner KYC credentials and activate verified status.",
                                defaultNote: "KYC credentials verified.",
                              })
                            }
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                          >
                            Verify
                          </button>
                        )}
                        {owner.verificationStatus !== "rejected" && (
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "user_reject",
                                id: owner._id,
                                title: `Reject Owner: ${owner.firstName} ${owner.lastName}`,
                                subtitle: "Reject verification and attach review reason.",
                                defaultNote: "Missing ownership documentation.",
                              })
                            }
                            className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-3 py-1.5 text-xs font-bold text-rose-300 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE PROPERTIES */}
          {currentTab === "properties" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Manage Properties</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review and verify property listings, inspection details, pricing, and owner associations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchProperties}
                    className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingProperties ? "animate-spin" : ""}`} />
                    Refresh Listings
                  </button>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    placeholder="Search property title, city, area..."
                    className="h-9 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  {propertySearch && (
                    <button
                      type="button"
                      onClick={() => setPropertySearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-xs text-slate-400">Status:</span>
                  <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
                    {["all", "pending", "verified", "rejected"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setPropertyStatusFilter(st)}
                        className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                          propertyStatusFilter === st
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400 text-xs rounded-3xl border border-slate-800 bg-[#0c1220]">
                    No properties match your filter.
                  </div>
                ) : (
                  filteredProperties.map((prop) => (
                    <div
                      key={prop._id}
                      className="rounded-3xl border border-slate-800 bg-[#0c1220] shadow-xl overflow-hidden flex flex-col justify-between transition hover:border-slate-700"
                    >
                      <div>
                        {/* Header Image or Placeholder Banner */}
                        <div className="h-36 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                          {prop.images && prop.images[0]?.url ? (
                            <img
                              src={prop.images[0].url}
                              alt={prop.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Home className="h-8 w-8 text-slate-400" />
                              <span className="text-[11px] mt-1 font-mono">{prop.propertyType}</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            {renderVerificationBadge(prop.verificationStatus)}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[11px] font-bold text-white">
                            ₹{prop.pricing?.monthlyRent}/mo
                          </div>
                        </div>

                        {/* Property Body */}
                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              {prop.propertyType} · {prop.accommodation?.roomType}
                            </span>
                            <h3 className="font-bold text-base text-white mt-0.5 line-clamp-1">
                              {prop.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                              {prop.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">
                              {prop.location?.area}, {prop.location?.city}
                            </span>
                          </div>

                          {/* Associated Owner Strip */}
                          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                                Property Host
                              </span>
                              <span className="font-bold text-white block">
                                {prop.owner?.firstName} {prop.owner?.lastName}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {prop.owner?.email}
                              </span>
                            </div>
                            {renderVerificationBadge(prop.owner?.verificationStatus)}
                          </div>

                          {prop.rejectionReason && (
                            <div className="rounded-xl bg-rose-950/30 border border-rose-900/50 p-2 text-[11px] text-rose-300 font-mono">
                              <span className="font-bold block text-rose-400">Rejection Note:</span>
                              {prop.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Property Actions Footer */}
                      <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPropertyDetail(prop)}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition cursor-pointer"
                        >
                          View Listing
                        </button>

                        <div className="flex items-center gap-2">
                          {prop.verificationStatus !== "verified" && (
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "property_verify",
                                  id: prop._id,
                                  title: `Approve: ${prop.title}`,
                                  subtitle: "Confirm property meets safety and pricing criteria.",
                                })
                              }
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {prop.verificationStatus !== "rejected" && (
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({
                                  type: "property_reject",
                                  id: prop._id,
                                  title: `Reject: ${prop.title}`,
                                  subtitle: "Provide a mandatory rejection reason for the owner.",
                                  defaultNote: "Fire safety NOC or clean photos missing.",
                                })
                              }
                              className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-3 py-1.5 text-xs font-bold text-rose-300 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: UNIFIED VERIFICATION HUB */}
          {currentTab === "verification" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <span>Unified Verification Center</span>
                    <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold">
                      {pendingOwnersQueue.length + pendingPropertiesQueue.length} Pending Actions
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review and verify submitted owner KYC documents and property listings.
                  </p>
                </div>
              </div>

              {/* 1. Pending Owners Queue */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-amber-400" />
                    <span>Pending Owner Verifications ({pendingOwnersQueue.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">KYC proof submissions</span>
                </div>

                {pendingOwnersQueue.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-6 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
                    No pending owner KYC verifications. All registered owners are processed!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingOwnersQueue.map((owner) => (
                      <div
                        key={owner._id}
                        className="rounded-3xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-bold">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">
                                {owner.firstName} {owner.lastName}
                              </span>
                              <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold">
                                {owner.businessName || "Owner"}
                              </span>
                              {renderVerificationBadge(owner.verificationStatus)}
                            </div>
                            <p className="text-xs text-slate-400">
                              Email: <b className="text-slate-200">{owner.email}</b> · Phone:{" "}
                              <b className="text-slate-200">{owner.phone || "N/A"}</b> · City:{" "}
                              <b className="text-slate-200">{owner.city || "Ahmedabad"}</b>
                            </p>
                            {owner.verificationNote && (
                              <p className="text-[11px] text-amber-300 font-mono bg-slate-900 p-2 rounded-xl border border-slate-800">
                                Submitted Proof: {owner.verificationNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenUserDetail(owner)}
                            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "user_verify",
                                id: owner._id,
                                title: `Approve KYC: ${owner.firstName} ${owner.lastName}`,
                                subtitle: "Enables verified owner badge across listings.",
                                defaultNote: "Owner ID proof and business credentials verified.",
                              })
                            }
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-emerald-600/20"
                          >
                            Approve Owner
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "user_reject",
                                id: owner._id,
                                title: `Reject KYC: ${owner.firstName} ${owner.lastName}`,
                                subtitle: "Explain reasons for rejection to owner.",
                                defaultNote: "Document resolution too low or unreadable.",
                              })
                            }
                            className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-3.5 py-2 text-xs font-bold text-rose-300 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Pending Properties Queue */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Home className="h-4 w-4 text-indigo-400" />
                    <span>Pending Property Approvals ({pendingPropertiesQueue.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">Accommodations awaiting validation</span>
                </div>

                {pendingPropertiesQueue.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-6 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
                    No properties pending approval. All listings have been processed!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPropertiesQueue.map((prop) => (
                      <div
                        key={prop._id}
                        className="rounded-3xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                            <Home className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{prop.title}</span>
                              <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold">
                                {prop.propertyType}
                              </span>
                              {renderVerificationBadge(prop.verificationStatus)}
                            </div>
                            <p className="text-xs text-slate-400">
                              Location:{" "}
                              <b className="text-slate-200">
                                {prop.location?.area}, {prop.location?.city}
                              </b>{" "}
                              · Rent: <b className="text-emerald-400">₹{prop.pricing?.monthlyRent}/mo</b> ·
                              Accommodation:{" "}
                              <b className="text-slate-200">
                                {prop.accommodation?.roomType} ({prop.accommodation?.availableRooms} rooms avail)
                              </b>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Host:{" "}
                              <b className="text-white">
                                {prop.owner?.firstName} {prop.owner?.lastName}
                              </b>{" "}
                              ({prop.owner?.email}) · Owner Status:{" "}
                              <span className="text-indigo-400 font-semibold">
                                {prop.owner?.verificationStatus || "unverified"}
                              </span>
                            </p>
                            {prop.verificationDocument?.fileUrl ? (
                              <div className="flex items-center gap-2 pt-1 text-[11px]">
                                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-md font-semibold">
                                  <FileText className="h-3 w-3" />
                                  {prop.verificationDocument.documentType || "Verification Doc"}
                                </span>
                                <a
                                  href={getDocumentUrl(prop.verificationDocument.fileUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1 hover:underline"
                                >
                                  <span>View Document</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic block pt-0.5">
                                No verification document file attached
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenPropertyDetail(prop)}
                            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
                          >
                            Inspect Listing
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "property_verify",
                                id: prop._id,
                                title: `Approve: ${prop.title}`,
                                subtitle: "Listing will become visible to student search immediately.",
                              })
                            }
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-emerald-600/20"
                          >
                            Approve Listing
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "property_reject",
                                id: prop._id,
                                title: `Reject: ${prop.title}`,
                                subtitle: "Specify reasons for rejecting this listing.",
                                defaultNote: "Property images or amenities mismatch verification checklist.",
                              })
                            }
                            className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-3.5 py-2 text-xs font-bold text-rose-300 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {currentTab === "reviews" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Review Moderation</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monitor student reviews and comments. Hide or flag inappropriate or fake reviews.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchReviews}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingReviews ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-12 text-center text-slate-400 text-xs">
                    No reviews in database.
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="rounded-3xl border border-slate-800 bg-[#0c1220] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{rev.rating} / 5</span>
                          </div>
                          <span className="font-bold text-sm text-white">
                            {rev.property?.title || "Property"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              rev.isVisible
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {rev.isVisible ? "Visible to Students" : "Hidden by Admin"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>
                            Author:{" "}
                            <b className="text-slate-200">
                              {rev.author?.firstName} {rev.author?.lastName}
                            </b>{" "}
                            ({rev.author?.email})
                          </span>
                          <span>·</span>
                          <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleReviewVisibility(rev._id, rev.isVisible)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                            rev.isVisible
                              ? "bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {rev.isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          {rev.isVisible ? "Hide Review" : "Make Visible"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS & DISPUTES */}
          {currentTab === "reports" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Dispute & Report Center</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Resolve tenant grievances, deposit disagreements, and inaccurate listing reports.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filter:</span>
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="all">All Reports</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Dismissed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {reports
                  .filter((r) => reportStatusFilter === "all" || r.status === reportStatusFilter)
                  .map((rep) => (
                    <div
                      key={rep._id}
                      className="rounded-3xl border border-slate-800 bg-[#0c1220] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                            Target: {rep.targetType}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              rep.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : rep.status === "rejected"
                                ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                            }`}
                          >
                            {rep.status}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-white">Reason: "{rep.reason}"</p>

                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                          <span>
                            Reported By:{" "}
                            <b className="text-slate-200">
                              {rep.reporter?.firstName} {rep.reporter?.lastName}
                            </b>{" "}
                            ({rep.reporter?.email})
                          </span>
                          <span>·</span>
                          <span>Target ID: {String(rep.targetId)}</span>
                          <span>·</span>
                          <span>Date: {new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>

                        {rep.resolution && (
                          <div className="rounded-xl bg-slate-900 p-2.5 text-[11px] text-emerald-300 font-mono border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Admin Resolution
                            </span>
                            {rep.resolution}
                          </div>
                        )}
                      </div>

                      {rep.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                type: "report_resolve",
                                id: rep._id,
                                title: "Resolve Dispute Report",
                                subtitle: "Enter administrative resolution notes and mark as resolved.",
                                defaultNote: "Investigated and communicated resolution with both parties.",
                              })
                            }
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS */}
          {currentTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Platform Analytics & Metrics</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Realtime distribution and operational statistics calculated directly from MongoDB collections.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg">
                  <span className="text-xs text-slate-400 uppercase font-semibold">User Ratio</span>
                  <div className="mt-2 text-xl font-bold text-white">
                    {stats.totalUsers > 0
                      ? `${Math.round((stats.totalStudents / stats.totalUsers) * 100)}% Students`
                      : "0%"}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {stats.totalStudents} Students vs {stats.totalOwners} Owners
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Property Approval Rate</span>
                  <div className="mt-2 text-xl font-bold text-emerald-400">
                    {stats.totalProperties > 0
                      ? `${Math.round(((stats.breakdown?.verifiedProperties || 0) / stats.totalProperties) * 100)}%`
                      : "0%"}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {stats.breakdown?.verifiedProperties || 0} approved of {stats.totalProperties}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Owner KYC Rate</span>
                  <div className="mt-2 text-xl font-bold text-blue-400">
                    {stats.totalOwners > 0
                      ? `${Math.round(((stats.breakdown?.verifiedOwners || 0) / stats.totalOwners) * 100)}%`
                      : "0%"}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {stats.breakdown?.verifiedOwners || 0} verified of {stats.totalOwners}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-lg">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Dispute Resolution</span>
                  <div className="mt-2 text-xl font-bold text-purple-400">
                    {stats.openReports === 0 ? "100% Clean" : `${stats.openReports} open`}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {stats.breakdown?.resolvedReports || 0} resolved total
                  </span>
                </div>
              </div>

              {/* Graphical Visualizations */}
              <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white">Database Entities Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Properties Approved</span>
                      <span className="font-bold text-emerald-400">
                        {stats.breakdown?.verifiedProperties || 0}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${
                            stats.totalProperties > 0
                              ? ((stats.breakdown?.verifiedProperties || 0) / stats.totalProperties) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Properties Pending Review</span>
                      <span className="font-bold text-amber-400">{stats.pendingProperties}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${
                            stats.totalProperties > 0
                              ? (stats.pendingProperties / stats.totalProperties) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Properties Rejected</span>
                      <span className="font-bold text-rose-400">
                        {stats.breakdown?.rejectedProperties || 0}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${
                            stats.totalProperties > 0
                              ? ((stats.breakdown?.rejectedProperties || 0) / stats.totalProperties) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SYSTEM SETTINGS */}
          {currentTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">System Settings & Governance</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platform security preferences, verification requirements, and admin profile summary.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Governance Rules */}
                <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    <span>Verification Governance Policies</span>
                  </h3>

                  <div className="space-y-3 text-xs text-slate-300">
                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Require Owner KYC Prior to Listing</span>
                        <span className="text-[11px] text-slate-400">
                          Owners must hold verified status before publishing properties
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.autoRequireKyc}
                        onChange={(e) =>
                          setSystemSettings((p) => ({ ...p, autoRequireKyc: e.target.checked }))
                        }
                        className="h-4 w-4 accent-indigo-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Strict Roommate Compatibility Filter</span>
                        <span className="text-[11px] text-slate-400">
                          Enforce verified student badges in roommate matching algorithms
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.strictContentFilter}
                        onChange={(e) =>
                          setSystemSettings((p) => ({ ...p, strictContentFilter: e.target.checked }))
                        }
                        className="h-4 w-4 accent-indigo-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Platform Maintenance Mode</span>
                        <span className="text-[11px] text-slate-400">
                          Restrict student logins for database indexing or migrations
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => {
                          setSystemSettings((p) => ({ ...p, maintenanceMode: e.target.checked }));
                          showToast(
                            e.target.checked
                              ? "Maintenance mode simulated: Active"
                              : "Maintenance mode disabled",
                            "info"
                          );
                        }}
                        className="h-4 w-4 accent-rose-600 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Logged in Admin Summary */}
                <div className="rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span>Administrator Identity</span>
                  </h3>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-mono font-bold text-white">
                          {loggedInUser?.email || "admin@staymatch.demo"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Role:</span>
                        <span className="font-semibold text-emerald-400">admin</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Permissions:</span>
                        <span className="font-semibold text-indigo-300">Full System Read/Write</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Database Engine:</span>
                        <span className="font-mono text-slate-300">MongoDB 7.x Mongoose</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onLogout?.()}
                      className="w-full rounded-xl bg-rose-950/40 hover:bg-rose-900/70 border border-rose-800 py-2.5 text-xs font-bold text-rose-300 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out of Admin Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: USER DETAILS MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-2xl space-y-5 my-8 text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg">
                  {selectedUserDetail.user.firstName?.[0] || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {selectedUserDetail.user.firstName} {selectedUserDetail.user.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400 font-mono">{selectedUserDetail.user.email}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-indigo-400 font-semibold capitalize">
                      {selectedUserDetail.user.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <div className="mt-1">{renderVerificationBadge(selectedUserDetail.user.verificationStatus)}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Account</span>
                  <span
                    className={`mt-1 inline-block font-bold ${
                      selectedUserDetail.user.isActive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {selectedUserDetail.user.isActive ? "Active" : "Deactivated"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="mt-1 block font-mono text-white">
                    {selectedUserDetail.user.phone || "None registered"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">City</span>
                  <span className="mt-1 block font-medium text-white">
                    {selectedUserDetail.user.city || "Ahmedabad"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {selectedUserDetail.user.role === "owner" ? "Business Organization" : "College & Course"}
                  </span>
                  <span className="mt-1 block font-semibold text-white">
                    {selectedUserDetail.user.role === "owner"
                      ? selectedUserDetail.user.businessName || "Individual Host"
                      : `${selectedUserDetail.user.college || "University"} (${
                          selectedUserDetail.user.course || "Degree"
                        })`}
                  </span>
                </div>
              </div>

              {selectedUserDetail.user.bio && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Bio</span>
                  <p className="text-slate-300 leading-relaxed">{selectedUserDetail.user.bio}</p>
                </div>
              )}

              {selectedUserDetail.user.verificationNote && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/50">
                  <span className="text-amber-400 block text-[10px] uppercase font-bold mb-1">
                    Verification History & Audit Note
                  </span>
                  <p className="text-amber-200 font-mono text-[11px]">
                    {selectedUserDetail.user.verificationNote}
                  </p>
                </div>
              )}

              {/* If Owner: List properties owned */}
              {selectedUserDetail.user.role === "owner" && selectedUserDetail.properties?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Properties Owned ({selectedUserDetail.properties.length})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedUserDetail.properties.map((p) => (
                      <div
                        key={p._id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-white block">{p.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {p.propertyType} · {p.location?.city} · ₹{p.pricing?.monthlyRent}/mo
                          </span>
                        </div>
                        {renderVerificationBadge(p.verificationStatus)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  handleToggleUserActive(
                    selectedUserDetail.user._id,
                    selectedUserDetail.user.isActive
                  )
                }
                className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedUserDetail.user.isActive
                    ? "bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900"
                    : "bg-emerald-950/40 border border-emerald-700 text-emerald-300 hover:bg-emerald-900"
                }`}
              >
                {selectedUserDetail.user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>

              <div className="flex items-center gap-2">
                {selectedUserDetail.user.verificationStatus !== "verified" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActionModal({
                        type: "user_verify",
                        id: selectedUserDetail.user._id,
                        title: `Verify ${selectedUserDetail.user.firstName} ${selectedUserDetail.user.lastName}`,
                        subtitle: "Confirm account approval and grant verified status.",
                        defaultNote: "User credentials verified by administrator.",
                      });
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Verify User
                  </button>
                )}
                {selectedUserDetail.user.verificationStatus !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActionModal({
                        type: "user_reject",
                        id: selectedUserDetail.user._id,
                        title: `Reject ${selectedUserDetail.user.firstName} ${selectedUserDetail.user.lastName}`,
                        subtitle: "Record rejection and store audit reason.",
                        defaultNote: "Identity proof incomplete or rejected.",
                      });
                    }}
                    className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-4 py-2 text-xs font-bold text-rose-300 transition cursor-pointer"
                  >
                    Reject User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PROPERTY DETAILS MODAL */}
      {selectedPropertyDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-2xl space-y-5 my-8 text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {selectedPropertyDetail.property.propertyType}
                  </span>
                  {renderVerificationBadge(selectedPropertyDetail.property.verificationStatus)}
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedPropertyDetail.property.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPropertyDetail(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {selectedPropertyDetail.property.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rent</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                    ₹{selectedPropertyDetail.property.pricing?.monthlyRent}/mo
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Deposit</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    ₹{selectedPropertyDetail.property.pricing?.securityDeposit || 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sharing</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {selectedPropertyDetail.property.accommodation?.roomType}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rooms</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {selectedPropertyDetail.property.accommodation?.availableRooms} /{" "}
                    {selectedPropertyDetail.property.accommodation?.totalRooms}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Address</span>
                <p className="text-white font-medium">
                  {selectedPropertyDetail.property.location?.address},{" "}
                  {selectedPropertyDetail.property.location?.area},{" "}
                  {selectedPropertyDetail.property.location?.city},{" "}
                  {selectedPropertyDetail.property.location?.state} -{" "}
                  {selectedPropertyDetail.property.location?.pincode}
                </p>
              </div>

              {/* Amenities */}
              {selectedPropertyDetail.property.amenities?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Amenities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPropertyDetail.property.amenities.map((am) => (
                      <span
                        key={am}
                        className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-200"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Document Section */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-400">
                    <FileText className="h-4 w-4" />
                    <span>Submitted Property Verification Document</span>
                  </div>
                  {renderVerificationBadge(selectedPropertyDetail.property.verificationStatus)}
                </div>

                {selectedPropertyDetail.property.verificationDocument?.fileUrl ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-white font-bold text-xs block">
                        {selectedPropertyDetail.property.verificationDocument.documentType || "Property Document"}
                      </span>
                      <span className="text-slate-400 text-[11px] block truncate max-w-xs">
                        File: {selectedPropertyDetail.property.verificationDocument.documentName || "document"}
                        {selectedPropertyDetail.property.verificationDocument.uploadedAt && (
                          <> · {new Date(selectedPropertyDetail.property.verificationDocument.uploadedAt).toLocaleDateString()}</>
                        )}
                      </span>
                    </div>
                    <a
                      href={getDocumentUrl(selectedPropertyDetail.property.verificationDocument.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Document</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">
                    No verification document file attached to this property.
                  </p>
                )}
              </div>

              {/* Associated Owner Details Card */}
              {selectedPropertyDetail.property.owner && (
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Associated Property Host
                    </span>
                    {renderVerificationBadge(selectedPropertyDetail.property.owner.verificationStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block text-sm">
                        {selectedPropertyDetail.property.owner.firstName}{" "}
                        {selectedPropertyDetail.property.owner.lastName}
                      </span>
                      <span className="text-slate-400 text-xs block">
                        {selectedPropertyDetail.property.owner.email} ·{" "}
                        {selectedPropertyDetail.property.owner.phone || "No phone"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPropertyDetail.property.rejectionReason && (
                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50">
                  <span className="text-rose-400 block text-[10px] uppercase font-bold mb-1">
                    Previous Rejection Reason
                  </span>
                  <p className="text-rose-200 font-mono text-[11px]">
                    {selectedPropertyDetail.property.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              {selectedPropertyDetail.property.verificationStatus !== "verified" && (
                <button
                  type="button"
                  onClick={() => {
                    setActionModal({
                      type: "property_verify",
                      id: selectedPropertyDetail.property._id,
                      title: `Approve: ${selectedPropertyDetail.property.title}`,
                      subtitle: "Listing will become live immediately.",
                    });
                  }}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                >
                  Approve Listing
                </button>
              )}
              {selectedPropertyDetail.property.verificationStatus !== "rejected" && (
                <button
                  type="button"
                  onClick={() => {
                    setActionModal({
                      type: "property_reject",
                      id: selectedPropertyDetail.property._id,
                      title: `Reject: ${selectedPropertyDetail.property.title}`,
                      subtitle: "Attach rejection reason to be saved in MongoDB.",
                      defaultNote: "Inspection standards not satisfied.",
                    });
                  }}
                  className="rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800 px-4 py-2 text-xs font-bold text-rose-300 transition cursor-pointer"
                >
                  Reject Listing
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AUDIT ACTION NOTE DIALOG */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#0c1220] p-6 shadow-2xl space-y-4 text-slate-200">
            <div>
              <h3 className="text-base font-black text-white">{actionModal.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{actionModal.subtitle}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {actionModal.type.includes("reject") ? "Rejection Reason / Feedback:" : "Audit Note (Optional):"}
              </label>
              <textarea
                rows={3}
                defaultValue={actionModal.defaultNote || ""}
                onChange={(e) => setModalInputText(e.target.value)}
                placeholder="Enter specific audit remarks saved to MongoDB..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={actionProcessing}
                onClick={() => {
                  setActionModal(null);
                  setModalInputText("");
                }}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionProcessing}
                onClick={() => {
                  const text = modalInputText || actionModal.defaultNote || "";
                  if (actionModal.type === "user_verify") {
                    handleExecuteUserVerification(actionModal.id, "verified", text);
                  } else if (actionModal.type === "user_reject") {
                    handleExecuteUserVerification(actionModal.id, "rejected", text);
                  } else if (actionModal.type === "property_verify") {
                    handleExecutePropertyVerification(actionModal.id, "verified");
                  } else if (actionModal.type === "property_reject") {
                    handleExecutePropertyVerification(actionModal.id, "rejected", text);
                  } else if (actionModal.type === "report_resolve") {
                    handleResolveReport(actionModal.id, "resolved", text);
                  }
                }}
                className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition cursor-pointer flex items-center gap-2 ${
                  actionModal.type.includes("reject")
                    ? "bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                }`}
              >
                {actionProcessing ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
