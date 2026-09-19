import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home,
  Building2,
  PlusCircle,
  Users,
  MessageSquare,
  Star,
  CalendarDays,
  CreditCard,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Filter,
  Check,
  Send,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  Info,
  Bed,
  CheckSquare,
  AlertCircle,
  FileText,
  UploadCloud,
  ExternalLink,
  FileCheck,
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

export default function OwnerDashboard({ user: initialUser, onLogout, personaSwitcher }) {
  // Navigation & search state
  const [currentTab, setCurrentTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Real backend data states
  const [currentUser, setCurrentUser] = useState(initialUser || {});
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Modals state
  const [viewProperty, setViewProperty] = useState(null);
  const [editProperty, setEditProperty] = useState(null);
  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Add property form state
  const [newProp, setNewProp] = useState({
    title: "",
    propertyType: "PG",
    roomType: "2-sharing",
    genderPreference: "any",
    monthlyRent: "",
    securityDeposit: "",
    area: "",
    city: currentUser?.city || "Ahmedabad",
    totalRooms: 6,
    availableRooms: 2,
    amenities: "Wi-Fi, Daily Food, Laundry, Security",
    rules: "No smoking indoors",
    description: "",
    documentType: "Electricity bill",
    documentFile: null,
  });
  const [formSuccess, setFormSuccess] = useState("");
  const [submittingProp, setSubmittingProp] = useState(false);

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    businessName: "",
    bio: "",
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleCancelEditProfile = () => {
    setProfileForm({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phone: currentUser?.phone || "",
      city: currentUser?.city || "Ahmedabad",
      businessName: currentUser?.businessName || "",
      bio: currentUser?.bio || "",
    });
    setIsEditingProfile(false);
  };

  // Ref for messages auto-scroll
  const messagesEndRef = useRef(null);

  // 1. Fetch current user from /users/me
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/me");
        if (res.data?.data?.user) {
          const u = res.data.data.user;
          setCurrentUser(u);
          setProfileForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            phone: u.phone || "",
            city: u.city || "Ahmedabad",
            businessName: u.businessName || "",
            bio: u.bio || "",
          });
          localStorage.setItem("staymatch_user", JSON.stringify(u));
        }
      } catch {
        if (initialUser) {
          setCurrentUser(initialUser);
          setProfileForm({
            firstName: initialUser.firstName || "",
            lastName: initialUser.lastName || "",
            phone: initialUser.phone || "",
            city: initialUser.city || "Ahmedabad",
            businessName: initialUser.businessName || "",
            bio: initialUser.bio || "",
          });
        }
      }
    };
    fetchMe();
  }, [initialUser]);

  // 2. Fetch owner properties from /properties/my
  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await api.get("/properties/my");
      const list = res.data?.data?.properties || [];
      const mapped = list.map((p) => ({
        id: p._id,
        _id: p._id,
        title: p.title,
        description: p.description,
        propertyType: p.propertyType || "PG",
        subType: p.accommodation?.roomType || p.propertyType || "PG",
        roomType: p.accommodation?.roomType || "2-sharing",
        totalRooms: p.accommodation?.totalRooms || 1,
        availableRooms: p.accommodation?.availableRooms || 0,
        genderPreference: p.preferences?.genderPreference || "any",
        location: `${p.location?.area || ""}, ${p.location?.city || "Ahmedabad"}`,
        area: p.location?.area || "",
        city: p.location?.city || "Ahmedabad",
        address: p.location?.address || "",
        pincode: p.location?.pincode || "380060",
        rent: p.pricing?.monthlyRent || 0,
        monthlyRent: p.pricing?.monthlyRent || 0,
        securityDeposit: p.pricing?.securityDeposit || 0,
        status:
          p.verificationStatus === "verified"
            ? "Approved"
            : p.verificationStatus === "rejected"
            ? "Rejected"
            : "Pending",
        verificationStatus: p.verificationStatus || "pending",
        verificationDocument: p.verificationDocument || null,
        rejectionReason: p.rejectionReason || null,
        amenities: p.amenities || [],
        rules: p.rules || [],
        images: p.images || [],
        views: 0,
        image:
          p.images?.[0] ||
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
      }));
      setOwnerProperties(mapped);
    } catch {
      setOwnerProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 3. Fetch chats/inquiries from /chats
  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await api.get("/chats");
      const chatList = res.data?.data?.chats || [];
      setChats(chatList);
      if (chatList.length > 0 && !selectedChatId) {
        setSelectedChatId(chatList[0]._id);
      }
    } catch {
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // 4. Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setChatMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${selectedChatId}/messages`);
        setChatMessages(res.data?.data?.messages || []);
      } catch {
        setChatMessages([]);
      }
    };
    fetchMessages();
  }, [selectedChatId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 5. Fetch reviews for owner's properties
  useEffect(() => {
    const fetchAllReviews = async () => {
      if (ownerProperties.length === 0) {
        setReviews([]);
        return;
      }
      setLoadingReviews(true);
      try {
        const all = [];
        for (const prop of ownerProperties) {
          try {
            const res = await api.get(`/reviews/${prop.id}`);
            const list = res.data?.data?.reviews || [];
            list.forEach((r) => {
              all.push({
                ...r,
                propertyTitle: prop.title,
                propertyLocation: prop.location,
              });
            });
          } catch {
            // ignore individual error
          }
        }
        setReviews(all);
      } catch {
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchAllReviews();
  }, [ownerProperties]);

  // Dynamic Owner Name computation
  const ownerFullName = useMemo(() => {
    const first = currentUser?.firstName?.trim();
    const last = currentUser?.lastName?.trim();
    if (first && last) return `${first} ${last}`;
    if (first) return first;
    return "Jayesh Patel";
  }, [currentUser]);

  const ownerBusiness = currentUser?.businessName || "Patel Accommodations & PG Services";
  const ownerEmail = currentUser?.email || "jayesh@gmail.com";
  const ownerPhone = currentUser?.phone || "+91 98980 12345";
  const ownerCity = currentUser?.city || "Ahmedabad";

  // Filter properties by search query and status filter
  const filteredProperties = useMemo(() => {
    return ownerProperties.filter((p) => {
      // Status filter
      if (propertyFilter === "verified" && p.verificationStatus !== "verified") return false;
      if (propertyFilter === "pending" && p.verificationStatus !== "pending") return false;
      if (propertyFilter === "rejected" && p.verificationStatus !== "rejected") return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = (p.title || "").toLowerCase();
      const loc = (p.location || "").toLowerCase();
      const area = (p.area || "").toLowerCase();
      const city = (p.city || "").toLowerCase();
      const subType = (p.subType || "").toLowerCase();
      const status = (p.status || "").toLowerCase();
      const type = (p.propertyType || "").toLowerCase();
      return (
        title.includes(q) ||
        loc.includes(q) ||
        area.includes(q) ||
        city.includes(q) ||
        subType.includes(q) ||
        status.includes(q) ||
        type.includes(q)
      );
    });
  }, [ownerProperties, searchQuery, propertyFilter]);

  // Send message in chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await api.post(`/chats/${selectedChatId}/messages`, { body: replyText.trim() });
      if (res.data?.data?.message) {
        setChatMessages((prev) => [...prev, res.data.data.message]);
        setReplyText("");
        fetchChats(); // refresh lastMessage in list
      }
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  // Add Property Submit
  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    setSubmittingProp(true);
    setFormSuccess("");
    try {
      const formData = new FormData();
      formData.append("title", newProp.title);
      formData.append(
        "description",
        newProp.description ||
          "Well-maintained student PG accommodation with all essential amenities."
      );
      formData.append("propertyType", newProp.propertyType);
      formData.append(
        "location",
        JSON.stringify({
          address: newProp.area ? `${newProp.area}, ${newProp.city}` : newProp.city,
          area: newProp.area,
          city: newProp.city,
          state: "Gujarat",
          pincode: "380060",
        })
      );
      formData.append(
        "pricing",
        JSON.stringify({
          monthlyRent: Number(newProp.monthlyRent),
          securityDeposit:
            Number(newProp.securityDeposit) || Number(newProp.monthlyRent),
        })
      );
      formData.append(
        "accommodation",
        JSON.stringify({
          roomType: newProp.roomType,
          totalRooms: Number(newProp.totalRooms) || 1,
          availableRooms: Number(newProp.availableRooms) || 1,
        })
      );
      formData.append(
        "preferences",
        JSON.stringify({
          genderPreference: newProp.genderPreference,
        })
      );
      formData.append(
        "amenities",
        JSON.stringify(
          newProp.amenities
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        )
      );
      formData.append(
        "rules",
        JSON.stringify(
          newProp.rules
            ? newProp.rules.split(",").map((x) => x.trim()).filter(Boolean)
            : ["No smoking indoors"]
        )
      );

      if (newProp.documentFile) {
        formData.append("document", newProp.documentFile);
        formData.append("documentType", newProp.documentType);
      }

      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormSuccess("Property submitted successfully! It is now pending admin verification.");
      fetchProperties();
      setNewProp({
        title: "",
        propertyType: "PG",
        roomType: "2-sharing",
        genderPreference: "any",
        monthlyRent: "",
        securityDeposit: "",
        area: "",
        city: currentUser?.city || "Ahmedabad",
        totalRooms: 6,
        availableRooms: 2,
        amenities: "Wi-Fi, Daily Food, Laundry, Security",
        rules: "No smoking indoors",
        description: "",
        documentType: "Electricity bill",
        documentFile: null,
      });

      setTimeout(() => {
        setFormSuccess("");
        setCurrentTab("properties");
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create property. Check required fields.");
    } finally {
      setSubmittingProp(false);
    }
  };

  // Edit Property Save
  const handleEditPropertySave = async (e) => {
    e.preventDefault();
    if (!editProperty) return;
    try {
      await api.put(`/properties/${editProperty.id}`, {
        title: editProperty.title,
        description: editProperty.description,
        propertyType: editProperty.propertyType,
        location: {
          address: editProperty.address || `${editProperty.area}, ${editProperty.city}`,
          area: editProperty.area,
          city: editProperty.city,
          state: "Gujarat",
          pincode: editProperty.pincode || "380060",
        },
        pricing: {
          monthlyRent: Number(editProperty.monthlyRent),
          securityDeposit: Number(editProperty.securityDeposit),
        },
        accommodation: {
          roomType: editProperty.roomType,
          totalRooms: Number(editProperty.totalRooms),
          availableRooms: Number(editProperty.availableRooms),
        },
        preferences: {
          genderPreference: editProperty.genderPreference,
        },
        amenities: Array.isArray(editProperty.amenities)
          ? editProperty.amenities
          : String(editProperty.amenities).split(",").map((x) => x.trim()).filter(Boolean),
        rules: Array.isArray(editProperty.rules)
          ? editProperty.rules
          : String(editProperty.rules).split(",").map((x) => x.trim()).filter(Boolean),
      });

      if (editProperty.documentFile) {
        const docForm = new FormData();
        docForm.append("document", editProperty.documentFile);
        docForm.append(
          "documentType",
          editProperty.documentType || "Electricity bill"
        );
        await api.post(
          `/properties/${editProperty.id}/verification-document`,
          docForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setActionSuccess("Property updated successfully! Status is set to pending review.");
      fetchProperties();
      setEditProperty(null);
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update property.");
    }
  };

  // Delete Property
  const handleDeleteProperty = async () => {
    if (!deletePropertyId) return;
    try {
      await api.delete(`/properties/${deletePropertyId}`);
      setActionSuccess("Property deleted successfully.");
      setDeletePropertyId(null);
      fetchProperties();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    }
  };

  // Profile Save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess("");
    try {
      const res = await api.put("/users/me", profileForm);
      if (res.data?.data?.user) {
        const u = res.data.data.user;
        setCurrentUser(u);
        localStorage.setItem("staymatch_user", JSON.stringify(u));
        setProfileSuccess("Owner profile updated successfully!");
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    if (status === "Approved" || status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#e6f9ed] px-2.5 py-1 text-xs font-bold text-[#16a34a]">
          <CheckCircle2 className="h-3 w-3" /> Approved
        </span>
      );
    }
    if (status === "Rejected" || status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
          <XCircle className="h-3 w-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
        <Clock className="h-3 w-3" /> Pending Review
      </span>
    );
  };

  // Sidebar navigation items
  const navItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "properties", label: "My Properties", icon: Building2, badge: ownerProperties.length },
    { id: "add-property", label: "Add Property", icon: PlusCircle },
    { id: "inquiries", label: "Inquiries", icon: Users, badge: chats.length },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: chats.filter((c) => c.unreadCount > 0).length || undefined },
    { id: "reviews", label: "Reviews", icon: Star, badge: reviews.length || undefined },
    { id: "bookings", label: "Bookings & Occupancy", icon: CalendarDays },
    { id: "profile", label: "Owner Profile", icon: User },
  ];

  // Active chat participant info
  const selectedChat = chats.find((c) => c._id === selectedChatId);
  const otherParticipant = selectedChat?.participants?.find(
    (p) => String(p._id) !== String(currentUser._id || currentUser.id)
  );

  return (
    <div className="min-h-screen bg-[#f7f8f9] text-gray-900 flex flex-col selection:bg-[#16a34a] selection:text-white font-sans">
      {personaSwitcher}

      {/* Top Notification Toast */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <Check className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e9ecef] bg-white px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          className="flex cursor-pointer items-center gap-3 select-none"
          onClick={() => {
            setCurrentTab("overview");
            setSearchQuery("");
          }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bbf7d0] bg-[#eaf7f0] text-[#16a34a] shadow-xs">
            <Home className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-[#16172d]">
                Stay<span className="text-[#16a34a]">Match</span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#7c78aa]">Owner Portal</span>
          </div>
        </div>

        {/* Center: Search with clear explanations */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-xl px-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== "overview" && currentTab !== "properties") {
                  setCurrentTab("properties");
                }
              }}
              placeholder="Search properties by name, area, city, room type, or status..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-[#f9fafb] pl-10 pr-9 text-xs text-gray-800 placeholder-gray-400 focus:border-[#16a34a] focus:bg-white focus:ring-2 focus:ring-[#16a34a]/15 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Chat Icon with Unread Badge */}
          <button
            type="button"
            onClick={() => setCurrentTab("messages")}
            title="Messages & Inquiries"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#16a34a] cursor-pointer"
          >
            <MessageSquare className="h-[18px] w-[18px]" />
            {chats.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#16a34a] text-[10px] font-bold text-white">
                {chats.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#16a34a] cursor-pointer"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {ownerProperties.length > 0 ? "2" : "1"}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl z-50">
                <div className="border-b border-gray-100 pb-2 text-xs font-bold text-gray-900 flex justify-between items-center">
                  <span>Owner Updates</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    Real-time
                  </span>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  {chats.length > 0 ? (
                    <div
                      className="rounded-xl bg-[#eaf7f0] p-2.5 text-[#16a34a] cursor-pointer hover:bg-[#dcfce7]"
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab("messages");
                      }}
                    >
                      <b>Inquiry from {chats[0].participants?.find(p => String(p._id) !== String(currentUser._id))?.firstName || "Student"}</b>
                      <p className="text-gray-600 text-[11px] mt-0.5 truncate">
                        "{chats[0].lastMessage || "New property inquiry"}"
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-2.5 text-gray-600">
                      <b>No new inquiries</b>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Student inquiries for your listings will appear here.
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl bg-gray-50 p-2.5 text-gray-700">
                    <b>Partner Status: {currentUser?.isVerified ? "Verified" : "Active"}</b>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {ownerProperties.length} properties managed in {ownerCity}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu with Dynamic Name */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition"
            >
              <div className="h-9 w-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {currentUser?.firstName?.[0] || "J"}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-bold text-gray-900">{ownerFullName}</span>
                <span className="block text-[11px] font-medium text-gray-500">Property Owner</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{ownerFullName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{ownerEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setCurrentTab("profile");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  Owner Profile
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Tab Content */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 border-r border-[#ececf6] bg-white p-4 flex flex-col justify-between min-h-[calc(100vh-76px)] hidden lg:flex">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentTab(item.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-[#eaf7f0] text-[#16a34a] shadow-xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#16a34a]" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? "bg-[#16a34a] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer with Logged In Owner Info */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="rounded-xl bg-[#f7f8f9] p-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verified Owner</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5 truncate">{ownerBusiness}</p>
            </div>

            <button
              type="button"
              onClick={() => onLogout?.()}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {/* Active Search Banner / Helper if search is active */}
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-emerald-600" />
                <span>
                  Filtering properties by: <b>"{searchQuery}"</b> ({filteredProperties.length} results found)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {currentTab === "overview" && (
            <div className="space-y-6">
              {/* Header Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back, {currentUser?.firstName || "Jayesh"}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    Managing <b>{ownerBusiness}</b> in {ownerCity}.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  <span>
                    {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* 4 Real KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Properties */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Total Properties</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf7f0] text-[#16a34a]">
                      <Home className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {ownerProperties.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">Listings</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Managed under your owner account</p>
                </div>

                {/* Verified / Active Listings */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Live & Approved</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf7f0] text-[#16a34a]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                      {ownerProperties.filter((p) => p.verificationStatus === "verified").length}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      of {ownerProperties.length} total
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Verified by StayMatch Admins</p>
                </div>

                {/* Student Inquiries */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Student Inquiries</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2efff] text-[#7c3aed]">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {chats.length}
                    </span>
                    <span className="text-xs font-bold text-purple-700">Active</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Connected student chats</p>
                </div>

                {/* Total Rooms Capacity */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Rooms Capacity</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Bed className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {ownerProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0)}
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      ({ownerProperties.reduce((sum, p) => sum + (p.availableRooms || 0), 0)} available)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Total student accommodation units</p>
                </div>
              </div>

              {/* Call-to-action Banner */}
              <div className="rounded-3xl bg-gradient-to-r from-[#eaf7f0] to-[#f0fdf4] border border-[#bbf7d0] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Quality Students. Better Occupancy.
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                    List verified PG accommodations in Ahmedabad, connect with matched university students, and manage bookings transparently.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab("add-property")}
                  className="rounded-xl bg-[#16a34a] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#15803d] transition cursor-pointer shrink-0"
                >
                  Add New Property →
                </button>
              </div>

              {/* Your Properties Table */}
              <div className="rounded-3xl border border-gray-100 bg-white shadow-xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Your Properties</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredProperties.length} listings registered under {ownerFullName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab("properties")}
                    className="text-xs font-bold text-[#16a34a] hover:underline cursor-pointer"
                  >
                    View all listings →
                  </button>
                </div>

                {loadingProperties ? (
                  <div className="p-8 text-center text-xs text-gray-500">Loading your properties...</div>
                ) : filteredProperties.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-800">No properties found</p>
                    <p className="text-xs text-gray-500">
                      {searchQuery ? `No properties match "${searchQuery}"` : "You have not registered any properties yet."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("add-property")}
                      className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f9fafb] text-gray-400 font-semibold border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3">Property</th>
                          <th className="px-5 py-3">Location</th>
                          <th className="px-5 py-3">Monthly Rent</th>
                          <th className="px-5 py-3">Rooms Available</th>
                          <th className="px-5 py-3">Verification</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredProperties.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="h-10 w-14 rounded-lg object-cover border border-gray-200"
                                />
                                <div>
                                  <span className="font-bold text-gray-900 block">{p.title}</span>
                                  <span className="text-gray-400 text-[11px] block">{p.subType}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-700">{p.location}</td>
                            <td className="px-5 py-3.5 font-bold text-gray-900">
                              ₹{p.rent?.toLocaleString()} / mo
                            </td>
                            <td className="px-5 py-3.5 text-gray-700">
                              <span className="font-bold text-emerald-700">{p.availableRooms}</span> of {p.totalRooms} rooms
                            </td>
                            <td className="px-5 py-3.5">{getStatusBadge(p.status)}</td>
                            <td className="px-5 py-3.5 text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setViewProperty(p)}
                                  title="View details"
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditProperty({ ...p })}
                                  title="Edit property"
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-700 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletePropertyId(p.id)}
                                  title="Delete property"
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bottom Two Columns: Inquiries & Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Inquiries Card */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Recent Student Inquiries</h3>
                      <p className="text-[11px] text-gray-400">Real chats from interested students</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("inquiries")}
                      className="text-xs font-bold text-[#16a34a] hover:underline cursor-pointer"
                    >
                      View all ({chats.length}) →
                    </button>
                  </div>

                  {chats.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No inquiries received yet. When students contact you about your properties, they will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chats.slice(0, 3).map((c) => {
                        const student = c.participants?.find(
                          (p) => String(p._id) !== String(currentUser._id || currentUser.id)
                        );
                        return (
                          <div
                            key={c._id}
                            onClick={() => {
                              setSelectedChatId(c._id);
                              setCurrentTab("messages");
                            }}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-50">
                                {student?.firstName?.[0] || "S"}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-gray-900">
                                    {student ? `${student.firstName} ${student.lastName}` : "Student"}
                                  </span>
                                  {c.property?.title && (
                                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 truncate max-w-[140px]">
                                      {c.property.title}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                  "{c.lastMessage || "Interested in your property"}"
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#16a34a] hover:underline shrink-0">
                              Reply →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Reviews Card */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Tenant Reviews</h3>
                      <p className="text-[11px] text-gray-400">Verified student feedback</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("reviews")}
                      className="text-xs font-bold text-[#16a34a] hover:underline cursor-pointer"
                    >
                      View all ({reviews.length}) →
                    </button>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No reviews submitted yet for your properties.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.slice(0, 3).map((rev) => (
                        <div
                          key={rev._id}
                          className="p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">
                                {rev.author?.firstName} {rev.author?.lastName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                for {rev.propertyTitle}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 font-normal">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PROPERTIES */}
          {currentTab === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage all listings, rooms availability, pricing, and verification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab("add-property")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15803d] cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add New Listing</span>
                </button>
              </div>

              {/* Filter Pills & Live Search Information */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Filter status:</span>
                  {["all", "verified", "pending", "rejected"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPropertyFilter(st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                        propertyFilter === st
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {st === "all" ? `All (${ownerProperties.length})` : st}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing <b>{filteredProperties.length}</b> of {ownerProperties.length} listings
                </div>
              </div>

              {/* Properties Grid */}
              {loadingProperties ? (
                <div className="p-12 text-center text-xs text-gray-500">Loading your listings...</div>
              ) : filteredProperties.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center space-y-3">
                  <Building2 className="h-10 w-10 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-900">No properties match your filter</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? `We couldn't find any listings matching "${searchQuery}". Check the spelling or try searching by area (e.g. Gota, Thaltej) or room type.`
                      : "You have no properties under this status filter."}
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentTab("add-property")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Add New Property
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProperties.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full bg-gray-100">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3">{getStatusBadge(p.status)}</div>
                          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] font-bold">
                            {p.subType}
                          </div>
                        </div>

                        <div className="p-4 space-y-2.5">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-base text-gray-900 truncate">{p.title}</h3>
                            <span className="font-extrabold text-[#16a34a] text-sm shrink-0">
                              ₹{p.rent?.toLocaleString()} / mo
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            {p.location}
                          </p>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                            <span>
                              Capacity: <b>{p.totalRooms} rooms</b>
                            </span>
                            <span>
                              Available: <b className="text-emerald-700">{p.availableRooms} rooms</b>
                            </span>
                          </div>

                          {p.verificationStatus === "rejected" && p.rejectionReason && (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-2 text-[11px] text-red-700">
                              <span className="font-bold block text-red-800">Rejection Reason:</span>
                              {p.rejectionReason}
                            </div>
                          )}

                          {p.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {p.amenities.slice(0, 3).map((a, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                                >
                                  {a}
                                </span>
                              ))}
                              {p.amenities.length > 3 && (
                                <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                                  +{p.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-0 border-t border-gray-100 flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setViewProperty(p)}
                          className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditProperty({ ...p })}
                          className="rounded-xl border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletePropertyId(p.id)}
                          className="rounded-xl border border-gray-200 p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD PROPERTY */}
          {currentTab === "add-property" && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Property Listing</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Submit listing details for admin verification and student matching.
                </p>
              </div>

              {formSuccess && (
                <div className="rounded-2xl bg-[#e6f9ed] p-4 text-xs font-bold text-[#16a34a] flex items-center gap-2 border border-[#bbf7d0]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form
                onSubmit={handleAddPropertySubmit}
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Property Title *</label>
                    <input
                      type="text"
                      required
                      value={newProp.title}
                      onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                      placeholder="e.g. Royal Living PG & Student Residence"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Property Type *</label>
                    <select
                      value={newProp.propertyType}
                      onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 bg-white"
                    >
                      <option value="PG">PG (Paying Guest)</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Room">Private Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Room Configuration *</label>
                    <select
                      value={newProp.roomType}
                      onChange={(e) => setNewProp({ ...newProp, roomType: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 bg-white"
                    >
                      <option value="1-sharing">1-sharing (Single Room)</option>
                      <option value="2-sharing">2-sharing (Double Room)</option>
                      <option value="3-sharing">3-sharing (Triple Room)</option>
                      <option value="4-sharing">4-sharing (Four Sharing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Allowed Tenants *</label>
                    <select
                      value={newProp.genderPreference}
                      onChange={(e) => setNewProp({ ...newProp, genderPreference: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 bg-white"
                    >
                      <option value="any">Anyone (Co-ed / All welcome)</option>
                      <option value="female">Girls only</option>
                      <option value="male">Boys only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={newProp.monthlyRent}
                      onChange={(e) => setNewProp({ ...newProp, monthlyRent: e.target.value })}
                      placeholder="e.g. 7500"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={newProp.securityDeposit}
                      onChange={(e) => setNewProp({ ...newProp, securityDeposit: e.target.value })}
                      placeholder="e.g. 15000"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Total Rooms</label>
                    <input
                      type="number"
                      min="1"
                      value={newProp.totalRooms}
                      onChange={(e) => setNewProp({ ...newProp, totalRooms: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Available Rooms</label>
                    <input
                      type="number"
                      min="0"
                      value={newProp.availableRooms}
                      onChange={(e) => setNewProp({ ...newProp, availableRooms: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Area / Neighborhood *</label>
                    <input
                      type="text"
                      required
                      value={newProp.area}
                      onChange={(e) => setNewProp({ ...newProp, area: e.target.value })}
                      placeholder="e.g. Gota, Near Nirma University"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">City *</label>
                    <input
                      type="text"
                      required
                      value={newProp.city}
                      onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    value={newProp.amenities}
                    onChange={(e) => setNewProp({ ...newProp, amenities: e.target.value })}
                    placeholder="Wi-Fi, Daily Food, Laundry, Security, AC"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">House Rules (comma-separated)</label>
                  <input
                    type="text"
                    value={newProp.rules}
                    onChange={(e) => setNewProp({ ...newProp, rules: e.target.value })}
                    placeholder="No smoking indoors, Gate closes at 10 PM"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Description (at least 20 characters) *</label>
                  <textarea
                    rows={3}
                    required
                    minLength={20}
                    value={newProp.description}
                    onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                    placeholder="Describe facilities, meal schedule, campus proximity, transport connectivity..."
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-800"
                  />
                </div>

                {/* Property Verification Document */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      <span>Property Verification Document</span>
                    </div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Required for Approval
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Upload official proof of property ownership, management, or utility to submit for admin verification.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Document Type *
                      </label>
                      <select
                        value={newProp.documentType}
                        onChange={(e) =>
                          setNewProp({ ...newProp, documentType: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 bg-white"
                      >
                        <option value="Electricity bill">Electricity bill</option>
                        <option value="Property tax receipt">Property tax receipt</option>
                        <option value="Rent/lease agreement">Rent/lease agreement</option>
                        <option value="Property ownership document">Property ownership document</option>
                        <option value="Property authorization/management document">
                          Property authorization/management document
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Upload Document (PDF or Image) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={(e) =>
                          setNewProp({
                            ...newProp,
                            documentFile: e.target.files?.[0] || null,
                          })
                        }
                        className="w-full text-xs text-gray-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                      />
                      {newProp.documentFile && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          ✓ Selected: {newProp.documentFile.name} ({(newProp.documentFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    Note: This is an admin-reviewed property verification system. Uploading documents submits them for review by platform administrators.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingProp}
                    className="rounded-xl bg-[#16a34a] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#15803d] disabled:opacity-50 transition cursor-pointer"
                  >
                    {submittingProp ? "Submitting Listing..." : "Submit Property for Verification"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {currentTab === "inquiries" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Inquiries</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified university students who contacted you about your listings.
                </p>
              </div>

              {loadingChats ? (
                <div className="p-12 text-center text-xs text-gray-500">Loading inquiries...</div>
              ) : chats.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center space-y-3">
                  <Users className="h-10 w-10 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-900">No student inquiries yet</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    When students browse your verified PG listings and click "Contact Owner", their inquiries and direct chats will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chats.map((c) => {
                    const student = c.participants?.find(
                      (p) => String(p._id) !== String(currentUser._id || currentUser.id)
                    );
                    return (
                      <div
                        key={c._id}
                        className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 ring-2 ring-emerald-50">
                            {student?.firstName?.[0] || "S"}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-sm text-gray-900">
                                {student ? `${student.firstName} ${student.lastName}` : "Interested Student"}
                              </h4>
                              {student?.college && (
                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                  {student.college}
                                </span>
                              )}
                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                Verified Student
                              </span>
                            </div>

                            {c.property?.title && (
                              <p className="text-xs font-semibold text-gray-700">
                                Inquiring for: <span className="text-[#16a34a]">{c.property.title}</span>
                              </p>
                            )}

                            <p className="text-xs text-gray-600 max-w-xl bg-gray-50 p-2 rounded-xl">
                              "{c.lastMessage || "Hello, I am interested in your property."}"
                            </p>

                            <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                              {student?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {student.phone}
                                </span>
                              )}
                              {student?.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {student.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatId(c._id);
                              setCurrentTab("messages");
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#16a34a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#15803d] transition cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Reply in Messages</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MESSAGES (Interactive Two-Pane Chat) */}
          {currentTab === "messages" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Messages & Chat</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time chat with students regarding room visits, pricing, and amenities.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white shadow-xs overflow-hidden h-[640px] flex flex-col md:flex-row">
                {/* Left: Chat List */}
                <aside className="w-full md:w-80 border-r border-gray-100 flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Conversations ({chats.length})
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {chats.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No active chat conversations.
                      </div>
                    ) : (
                      chats.map((c) => {
                        const student = c.participants?.find(
                          (p) => String(p._id) !== String(currentUser._id || currentUser.id)
                        );
                        const isSelected = c._id === selectedChatId;
                        return (
                          <div
                            key={c._id}
                            onClick={() => setSelectedChatId(c._id)}
                            className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                              isSelected ? "bg-emerald-50/70 border-l-4 border-emerald-600" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {student?.firstName?.[0] || "S"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <b className="text-xs text-gray-900 truncate">
                                  {student ? `${student.firstName} ${student.lastName}` : "Student"}
                                </b>
                                {c.lastMessageAt && (
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(c.lastMessageAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </div>
                              {c.property?.title && (
                                <span className="text-[10px] text-emerald-700 font-semibold block truncate">
                                  {c.property.title}
                                </span>
                              )}
                              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                {c.lastMessage || "Started conversation"}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </aside>

                {/* Right: Message Window */}
                <section className="flex-1 flex flex-col bg-[#fcfcfd]">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            {otherParticipant?.firstName?.[0] || "S"}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">
                              {otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : "Student"}
                            </h4>
                            <span className="text-[11px] text-emerald-700 font-medium">
                              {otherParticipant?.college || "Verified Student"} · {selectedChat.property?.title || "StayMatch"}
                            </span>
                          </div>
                        </div>

                        {otherParticipant?.phone && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            📞 {otherParticipant.phone}
                          </span>
                        )}
                      </header>

                      {/* Chat History */}
                      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/50">
                        {chatMessages.length === 0 ? (
                          <div className="py-12 text-center text-xs text-gray-400">
                            No messages yet in this conversation. Send a reply below!
                          </div>
                        ) : (
                          chatMessages.map((m) => {
                            const isMine =
                              String(m.sender?._id || m.sender) === String(currentUser._id || currentUser.id);
                            return (
                              <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                    isMine
                                      ? "bg-[#16a34a] text-white rounded-tr-xs"
                                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-xs"
                                  }`}
                                >
                                  <p>{m.body}</p>
                                  <span
                                    className={`block text-[10px] mt-1.5 text-right ${
                                      isMine ? "text-emerald-100" : "text-gray-400"
                                    }`}
                                  >
                                    {m.createdAt &&
                                      new Date(m.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input Box */}
                      <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-gray-100 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Type your reply to ${otherParticipant?.firstName || "the student"}...`}
                          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !replyText.trim()}
                          className="rounded-xl bg-[#16a34a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#15803d] disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Send</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="m-auto text-center p-8 text-xs text-gray-400">
                      Select a student conversation from the left pane to view message history.
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {currentTab === "reviews" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Property Reviews & Ratings</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real feedback left by student tenants for your properties.
                </p>
              </div>

              {loadingReviews ? (
                <div className="p-12 text-center text-xs text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center space-y-3">
                  <Star className="h-10 w-10 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-900">No reviews yet</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Once students move in and submit reviews for your verified properties, their ratings and honest testimonials will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {rev.author?.firstName?.[0] || "S"}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">
                              {rev.author?.firstName} {rev.author?.lastName}
                            </h4>
                            <span className="text-[10px] text-emerald-700 font-semibold block">
                              {rev.propertyTitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-normal bg-gray-50 p-3 rounded-2xl">
                        "{rev.comment}"
                      </p>

                      <div className="text-[10px] text-gray-400 pt-1">
                        Verified student review
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BOOKINGS & OCCUPANCY */}
          {currentTab === "bookings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Room Occupancy & Capacity</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Accurate breakdown of room capacity, occupied rooms, and available inventory.
                </p>
              </div>

              {/* Occupancy Metrics */}
              {(() => {
                const totalRooms = ownerProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
                const availableRooms = ownerProperties.reduce((sum, p) => sum + (p.availableRooms || 0), 0);
                const occupiedRooms = Math.max(0, totalRooms - availableRooms);
                const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
                const monthlyRevenue = ownerProperties.reduce(
                  (sum, p) => sum + (p.rent || 0) * (p.totalRooms - p.availableRooms),
                  0
                );

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                        <span className="text-xs font-semibold text-gray-400">Total Rooms Managed</span>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalRooms}</p>
                        <span className="text-[11px] text-gray-500">
                          {occupiedRooms} occupied · {availableRooms} available
                        </span>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                        <span className="text-xs font-semibold text-gray-400">Occupancy Rate</span>
                        <p className="text-2xl font-extrabold text-[#16a34a] mt-1">{occupancyRate}%</p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-[#16a34a] h-full rounded-full"
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                        <span className="text-xs font-semibold text-gray-400">Estimated Monthly Revenue</span>
                        <p className="text-2xl font-extrabold text-blue-700 mt-1">
                          ₹{monthlyRevenue.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-gray-500">
                          From currently occupied student rooms
                        </span>
                      </div>
                    </div>

                    {/* Room Inventory by Property */}
                    <div className="rounded-3xl border border-gray-100 bg-white shadow-xs overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="text-base font-bold text-gray-900">Property-wise Room Inventory</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#f9fafb] text-gray-400 font-semibold border-b border-gray-100">
                            <tr>
                              <th className="px-5 py-3">Property</th>
                              <th className="px-5 py-3">Room Type</th>
                              <th className="px-5 py-3">Total Rooms</th>
                              <th className="px-5 py-3">Available</th>
                              <th className="px-5 py-3">Occupied</th>
                              <th className="px-5 py-3">Monthly Rent</th>
                              <th className="px-5 py-3">Est. Property Income</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {ownerProperties.map((p) => {
                              const occ = Math.max(0, p.totalRooms - p.availableRooms);
                              const income = occ * p.rent;
                              return (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                  <td className="px-5 py-3.5 font-bold text-gray-900">{p.title}</td>
                                  <td className="px-5 py-3.5 text-gray-600">{p.subType}</td>
                                  <td className="px-5 py-3.5">{p.totalRooms}</td>
                                  <td className="px-5 py-3.5 text-emerald-700 font-bold">{p.availableRooms}</td>
                                  <td className="px-5 py-3.5 text-blue-700 font-bold">{occ}</td>
                                  <td className="px-5 py-3.5">₹{p.rent?.toLocaleString()}</td>
                                  <td className="px-5 py-3.5 font-bold text-gray-900">
                                    ₹{income.toLocaleString()} / mo
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Transparent notice on Escrow & Booking contracts */}
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3 text-xs text-blue-800">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <b className="font-bold">Digital Rent Escrow & Automated Agreements</b>
                        <p className="text-blue-700 mt-0.5">
                          Digital escrow rent collection and instant e-sign tenant agreements are launching in the upcoming StayMatch release. Currently, inquiries connect you directly with students to inspect rooms and finalize agreements.
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 8: OWNER PROFILE */}
          {currentTab === "profile" && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Owner Profile</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your registered property owner identity and credentials.
                </p>
              </div>

              {profileSuccess && (
                <div className="rounded-2xl bg-[#e6f9ed] p-4 text-xs font-bold text-[#16a34a] flex items-center gap-2 border border-[#bbf7d0] animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {/* Profile Card showing Basic Profile Information by default */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                      {currentUser?.firstName?.[0] || "J"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{ownerFullName}</h3>
                      <p className="text-xs text-gray-500">Property Owner</p>
                      <div className="mt-1">
                        {currentUser?.isVerified || currentUser?.verificationStatus === "verified" ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#e6f9ed] px-2.5 py-0.5 text-xs font-bold text-[#16a34a]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified Partner
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                            <Clock className="h-3.5 w-3.5" /> Verification Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileForm({
                          firstName: currentUser?.firstName || "",
                          lastName: currentUser?.lastName || "",
                          phone: currentUser?.phone || "",
                          city: currentUser?.city || "Ahmedabad",
                          businessName: currentUser?.businessName || "",
                          bio: currentUser?.bio || "",
                        });
                        setIsEditingProfile(true);
                      }}
                      className="inline-flex items-center gap-2 self-start sm:self-center rounded-xl bg-[#16a34a] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15803d] transition cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {/* 6 Required Basic Profile Information items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 text-xs border-t border-gray-100">
                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Name</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{ownerFullName}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Business Name</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{ownerBusiness}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Email</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{ownerEmail}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Phone Number</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{ownerPhone}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Operating City</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{ownerCity}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <span className="text-gray-400 font-medium block">Verification Status</span>
                    <p className="font-bold text-sm text-gray-900 mt-1">
                      {currentUser?.isVerified || currentUser?.verificationStatus === "verified"
                        ? "Verified Partner"
                        : "Verification Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form - Hidden by default, visible only when isEditingProfile is true */}
              {isEditingProfile && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Edit Profile Information</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Update your contact details and business identity.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEditProfile}
                      className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700">First Name *</label>
                        <input
                          type="text"
                          required
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Business Name</label>
                        <input
                          type="text"
                          value={profileForm.businessName}
                          onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Phone Number</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700">Operating City</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 transition"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="rounded-xl bg-[#16a34a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#15803d] disabled:opacity-50 transition cursor-pointer"
                      >
                        {savingProfile ? "Saving..." : "Save Profile"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditProfile}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: VIEW PROPERTY DETAILS */}
      {viewProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          onClick={() => setViewProperty(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {viewProperty.propertyType}
                  </span>
                  {getStatusBadge(viewProperty.status)}
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mt-1">{viewProperty.title}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {viewProperty.address || viewProperty.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewProperty(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
              <img src={viewProperty.image} alt={viewProperty.title} className="h-full w-full object-cover" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="text-[11px] text-gray-400 block">Monthly Rent</span>
                <b className="text-base text-gray-900 font-bold">₹{viewProperty.rent?.toLocaleString()}</b>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="text-[11px] text-gray-400 block">Security Deposit</span>
                <b className="text-base text-gray-900 font-bold">
                  ₹{viewProperty.securityDeposit?.toLocaleString()}
                </b>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="text-[11px] text-gray-400 block">Room Type</span>
                <b className="text-base text-gray-900 font-bold">{viewProperty.subType}</b>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="text-[11px] text-gray-400 block">Rooms Availability</span>
                <b className="text-base text-emerald-700 font-bold">
                  {viewProperty.availableRooms} / {viewProperty.totalRooms}
                </b>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Description</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl">
                {viewProperty.description}
              </p>
            </div>

            {viewProperty.amenities?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-1.5">Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewProperty.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                    >
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewProperty.rules?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-1.5">House Rules</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewProperty.rules.map((r, i) => (
                    <span key={i} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                      • {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification & Rejection Status Card */}
            {viewProperty.verificationStatus === "rejected" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>Verification Rejected by Administrator</span>
                </div>
                <p className="text-xs text-red-700">
                  <strong>Reason:</strong> {viewProperty.rejectionReason || "Uploaded documentation did not satisfy verification criteria."}
                </p>
                <p className="text-[11px] text-red-600 pt-1">
                  Click "Edit This Property" below to re-upload clear proof documents and re-submit for review.
                </p>
              </div>
            )}

            {/* Verification Document Info */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>Submitted Verification Document</span>
                </div>
                {getStatusBadge(viewProperty.status)}
              </div>
              {viewProperty.verificationDocument ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-800 block">
                      {viewProperty.verificationDocument.documentType}
                    </span>
                    <span className="text-[11px] text-gray-400 block truncate max-w-xs">
                      {viewProperty.verificationDocument.documentName}
                    </span>
                  </div>
                  {viewProperty.verificationDocument.fileUrl && (
                    <a
                      href={getDocumentUrl(viewProperty.verificationDocument.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Document</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 pt-1 italic">
                  No verification document file attached to this property listing.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const toEdit = { ...viewProperty };
                  setViewProperty(null);
                  setEditProperty(toEdit);
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
              >
                Edit This Property
              </button>
              <button
                type="button"
                onClick={() => setViewProperty(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROPERTY */}
      {editProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          onClick={() => setEditProperty(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Edit Property Details</h3>
              <button
                type="button"
                onClick={() => setEditProperty(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditPropertySave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={editProperty.title}
                    onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={editProperty.monthlyRent}
                    onChange={(e) =>
                      setEditProperty({
                        ...editProperty,
                        monthlyRent: e.target.value,
                        rent: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={editProperty.securityDeposit}
                    onChange={(e) =>
                      setEditProperty({ ...editProperty, securityDeposit: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Total Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={editProperty.totalRooms}
                    onChange={(e) =>
                      setEditProperty({ ...editProperty, totalRooms: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Available Rooms</label>
                  <input
                    type="number"
                    min="0"
                    value={editProperty.availableRooms}
                    onChange={(e) =>
                      setEditProperty({ ...editProperty, availableRooms: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Area</label>
                  <input
                    type="text"
                    value={editProperty.area}
                    onChange={(e) => setEditProperty({ ...editProperty, area: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">City</label>
                  <input
                    type="text"
                    value={editProperty.city}
                    onChange={(e) => setEditProperty({ ...editProperty, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editProperty.description}
                  onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(editProperty.amenities)
                      ? editProperty.amenities.join(", ")
                      : editProperty.amenities || ""
                  }
                  onChange={(e) => setEditProperty({ ...editProperty, amenities: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800"
                />
              </div>

              {/* Re-upload Verification Document */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>Property Verification Document</span>
                  </div>
                  {editProperty.verificationDocument && (
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Current: {editProperty.verificationDocument.documentType}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Document Type
                    </label>
                    <select
                      value={editProperty.documentType || editProperty.verificationDocument?.documentType || "Electricity bill"}
                      onChange={(e) =>
                        setEditProperty({ ...editProperty, documentType: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 bg-white"
                    >
                      <option value="Electricity bill">Electricity bill</option>
                      <option value="Property tax receipt">Property tax receipt</option>
                      <option value="Rent/lease agreement">Rent/lease agreement</option>
                      <option value="Property ownership document">Property ownership document</option>
                      <option value="Property authorization/management document">
                        Property authorization/management document
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {editProperty.verificationDocument ? "Re-upload Document (PDF / Image)" : "Upload Document (PDF / Image)"}
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) =>
                        setEditProperty({
                          ...editProperty,
                          documentFile: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full text-xs text-gray-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    />
                    {editProperty.documentFile && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1">
                        ✓ Selected: {editProperty.documentFile.name} ({(editProperty.documentFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProperty(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#16a34a] px-5 py-2 text-xs font-bold text-white hover:bg-[#15803d] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deletePropertyId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          onClick={() => setDeletePropertyId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center"
          >
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Property Listing?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this property? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletePropertyId(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
