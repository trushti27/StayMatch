
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TopNavbar from "../../components/layout/TopNavbar";
import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import StatCards from "../../components/dashboard/StatCards";
import HeroBanner from "../../components/dashboard/HeroBanner";
import RecommendedPGs from "../../components/dashboard/RecommendedPGs";
import TrustFeaturesStrip from "../../components/dashboard/TrustFeaturesStrip";
import PaymentModal from "../../components/modals/PaymentModal";
import InviteModal from "../../components/modals/InviteModal";
import PropertyDetailModal from "../../components/modals/PropertyDetailModal";
import FloatingChatButton from "../../components/chat/FloatingChatButton";
import api from "../../services/api";
import {
  Search,
  Sparkles,
  Users,
  Heart,
  MessageSquare,
  Clock,
  BookOpen,
  Utensils,
  CigaretteOff,
  Check,
  CalendarDays,
  ShieldAlert,
  Send,
  Star,
  CreditCard,
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  User as UserIcon,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const GUJARAT_CITIES = [
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

export default function StudentDashboard({ user, onLogout, personaSwitcher }) {
  // Sync tab navigation with browser URL search parameters for Back/Forward history
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const setCurrentTab = (tab) => {
    if (tab === "overview") {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ tab }, { replace: false });
    }
  };

  // Student details & location
  const [currentUser, setCurrentUser] = useState(user || null);
  const [selectedCity, setSelectedCity] = useState(user?.city || "Ahmedabad");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Live database-backed states
  const [properties, setProperties] = useState([]);
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(null);

  // Profile Edit Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    college: "",
    course: "",
    city: "",
    bio: "",
    graduationYear: 2026,
    sleepSchedule: "flexible",
    cleanliness: 4,
    studyHabit: "flexible",
    dietaryPreference: "vegetarian",
    smoking: false,
    drinking: "no",
    minBudget: 6000,
    maxBudget: 12000,
    preferredRoomType: "any",
  });
  const [profileStatusMsg, setProfileStatusMsg] = useState("");
  const [profileStatusType, setProfileStatusType] = useState("success");
  const [questionnaireStatusMsg, setQuestionnaireStatusMsg] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 1. Initial Load: Fetch User, Profile, Favorites, Matches, Reviews
  const fetchDashboardData = async () => {
    try {
      // User Profile
      try {
        const userRes = await api.get("/users/me");
        if (userRes.data?.data?.user) {
          const u = userRes.data.data.user;
          setCurrentUser(u);
          if (u.city) setSelectedCity(u.city);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }

      // Compatibility Profile
      try {
        const profRes = await api.get("/profiles/me");
        if (profRes.data?.data?.profile) {
          const p = profRes.data.data.profile;
          setProfile(p);
          if (p.preferredLocations?.[0]) {
            setSelectedCity(p.preferredLocations[0]);
          }
        }
      } catch {
        // No compatibility profile created yet
      }

      // Shortlisted PGs
      try {
        const favRes = await api.get("/favorites");
        const rawFavs = favRes.data?.data?.favorites || [];
        const validFavs = rawFavs.filter(
          (f) => f && f.property && (f.property._id || typeof f.property === "string")
        );
        setFavorites(validFavs);
      } catch (err) {
        console.error("Failed to load favorites", err);
      }

      // Roommate Matches
      try {
        const matchRes = await api.get("/lci/matches");
        setMatches(matchRes.data?.data?.matches || []);
      } catch {
        setMatches([]);
      }

      // Reviews written by student
      try {
        const revRes = await api.get("/reviews/my");
        setMyReviews(revRes.data?.data?.reviews || []);
      } catch {
        setMyReviews([]);
      }

      // Chats
      try {
        const chatRes = await api.get("/chats");
        setChats(chatRes.data?.data?.chats || []);
      } catch {
        setChats([]);
      }
    } catch (error) {
      console.error("Dashboard initialization error", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sync profileForm when currentUser or profile updates
  useEffect(() => {
    const studentCity = profile?.preferredLocations?.[0] || currentUser?.city || "Ahmedabad";
    setProfileForm({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phone: currentUser?.phone || "",
      college: currentUser?.college || profile?.collegeName || "",
      course: currentUser?.course || profile?.course || "",
      city: studentCity,
      bio: currentUser?.bio || "",
      graduationYear: currentUser?.graduationYear || profile?.graduationYear || 2026,
      sleepSchedule: profile?.sleepSchedule || "flexible",
      cleanliness: profile?.cleanliness || 4,
      studyHabit: profile?.studyHabit || "flexible",
      dietaryPreference: profile?.dietaryPreference || "vegetarian",
      smoking: Boolean(profile?.smoking),
      drinking: profile?.drinking || "no",
      minBudget: profile?.budget?.min !== undefined ? profile.budget.min : 6000,
      maxBudget: profile?.budget?.max !== undefined ? profile.budget.max : 12000,
      preferredRoomType: profile?.preferredRoomType || "any",
    });
  }, [currentUser, profile]);

  // 2. Fetch properties matching current city / search
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get("/properties", {
          params: { city: selectedCity, q: searchQuery },
        });
        setProperties(res.data?.data?.properties || []);
      } catch {
        setProperties([]);
      }
    };
    fetchProps();
  }, [selectedCity, searchQuery]);

  // Toggle Property Favorite / Shortlist
  const handleToggleFavorite = async (propertyId) => {
    try {
      const isFav = favorites.some(
        (f) => String(f.property?._id || f.property) === String(propertyId)
      );

      if (isFav) {
        await api.delete(`/favorites/${propertyId}`);
        const res = await api.get("/favorites");
        const rawFavs = res.data?.data?.favorites || [];
        const validFavs = rawFavs.filter(
          (f) => f && f.property && (f.property._id || typeof f.property === "string")
        );
        setFavorites(validFavs);
      } else {
        await api.post(`/favorites/${propertyId}`);
        const res = await api.get("/favorites");
        const rawFavs = res.data?.data?.favorites || [];
        const validFavs = rawFavs.filter(
          (f) => f && f.property && (f.property._id || typeof f.property === "string")
        );
        setFavorites(validFavs);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  // Save Student Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileStatusMsg("");

    const minB = Number(profileForm.minBudget);
    const maxB = Number(profileForm.maxBudget);

    if (isNaN(minB) || minB < 500) {
      setProfileStatusMsg("Minimum monthly budget must be at least ₹500.");
      setProfileStatusType("error");
      setIsSavingProfile(false);
      return;
    }

    if (isNaN(maxB) || minB >= maxB) {
      setProfileStatusMsg("Minimum budget must be strictly less than maximum budget.");
      setProfileStatusType("error");
      setIsSavingProfile(false);
      return;
    }

    try {
      const chosenCity = profileForm.city || selectedCity || "Ahmedabad";

      // 1. Update user fields
      const userRes = await api.put("/users/me", {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        college: profileForm.college,
        course: profileForm.course,
        city: chosenCity,
        bio: profileForm.bio,
        graduationYear: Number(profileForm.graduationYear),
      });
      if (userRes.data?.data?.user) {
        setCurrentUser(userRes.data.data.user);
      }

      // 2. Update compatibility profile
      const profRes = await api.post("/profiles", {
        collegeName: profileForm.college || "Nirma University",
        course: profileForm.course || "General",
        graduationYear: Number(profileForm.graduationYear) || 2026,
        sleepSchedule: profileForm.sleepSchedule,
        cleanliness: Number(profileForm.cleanliness) || 4,
        studyHabit: profileForm.studyHabit,
        socialHabit: 3,
        dietaryPreference: profileForm.dietaryPreference,
        smoking: Boolean(profileForm.smoking),
        drinking: profileForm.drinking,
        budget: {
          min: minB,
          max: maxB,
        },
        preferredLocations: [chosenCity],
        preferredRoomType: profileForm.preferredRoomType || "any",
      });
      if (profRes.data?.data?.profile) {
        setProfile(profRes.data.data.profile);
      }

      // 3. Immediately sync dashboard default city
      setSelectedCity(chosenCity);

      setProfileStatusMsg("Profile updated successfully!");
      setProfileStatusType("success");
      setIsEditingProfile(false);
      // Refresh dashboard data
      await fetchDashboardData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setProfileStatusMsg(msg);
      setProfileStatusType("error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const renderTabContent = () => {
    // ------------------------------------
    // TAB: OVERVIEW / DASHBOARD
    // ------------------------------------
    if (currentTab === "overview") {
      return (
        <div className="flex-1 space-y-6 min-w-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back, {currentUser?.firstName || user?.firstName || "Student"}! 👋
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Let's find your perfect home and compatible roommate in {selectedCity}.
            </p>
          </div>

          {/* Actual database-backed statistics */}
          <StatCards
            shortlistedCount={favorites.length}
            roommateMatchesCount={matches.length}
            reviewsCount={myReviews.length}
            totalSavedAmount={0}
            onNavigateTab={setCurrentTab}
          />

          <HeroBanner onFindMatch={() => setCurrentTab("matches")} />

          <RecommendedPGs
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={setSelectedProperty}
            onViewAll={() => setCurrentTab("properties")}
          />

          <TrustFeaturesStrip />
        </div>
      );
    }

    // ------------------------------------
    // TAB: PROPERTIES / SEARCH
    // ------------------------------------
    if (currentTab === "properties") {
      return (
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find PG & Student Rooms</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Explore verified accommodations across {selectedCity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area (e.g. Gota, Vastrapur)..."
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-xs"
              />
            </div>
          </div>
          <RecommendedPGs
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={setSelectedProperty}
            onViewAll={() => {}}
            title={`Available Listings in ${selectedCity} (${properties.length})`}
            emptyMessage={`No verified listings found matching your search in ${selectedCity}. Try changing the city or search term.`}
          />
        </div>
      );
    }

    // ------------------------------------
    // TAB: ROOMMATE MATCHES
    // ------------------------------------
    if (currentTab === "matches") {
      return (
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Roommate Matches</h2>
                <span className="rounded-full bg-[#5b3bf5]/10 px-2.5 py-0.5 text-xs font-bold text-[#5b3bf5]">
                  {matches.length} matches
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Computed using your Lifestyle Compatibility Index (LCI)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab("questionnaire")}
              className="rounded-xl bg-[#5b3bf5] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer hover:bg-[#4a2ce0]"
            >
              Update Preferences
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-xs space-y-3">
              <div className="h-12 w-12 mx-auto rounded-2xl bg-[#f5f2ff] text-[#5b3bf5] flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Roommate Matches Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Complete your lifestyle questionnaire or adjust your preferences to find compatible student roommates.
              </p>
              <button
                type="button"
                onClick={() => setCurrentTab("questionnaire")}
                className="rounded-xl bg-[#5b3bf5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4a2ce0] cursor-pointer"
              >
                Complete Questionnaire
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m) => {
                const matchName = m.name || `${m.user?.firstName || "Student"} ${m.user?.lastName || ""}`.trim();
                const matchCollege = m.user?.college || "University Student";
                const matchCourse = m.user?.course || "";
                const matchCity = m.user?.city || selectedCity;
                const matchBio = m.user?.bio || "";

                return (
                  <div
                    key={m.studentId || m._id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            m.user?.profileImage ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                          }
                          alt={matchName}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {matchName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {matchCollege}
                          </p>
                          {matchCourse && (
                            <p className="text-[11px] text-gray-400 truncate">
                              {matchCourse}
                            </p>
                          )}
                        </div>
                        <span className="rounded-full bg-[#e6f9ed] px-2.5 py-1 text-[11px] font-bold text-[#16a34a] shrink-0">
                          {m.compatibilityScore || 85}% Match
                        </span>
                      </div>

                      {matchBio && (
                        <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-2.5 italic">
                          "{matchBio}"
                        </p>
                      )}

                      <div className="space-y-1.5 pt-1 text-xs text-gray-600">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400">Compatibility Level</span>
                          <span className="font-bold text-[#5b3bf5]">
                            {m.compatibilityLevel || "Compatible"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400">Location</span>
                          <span className="font-semibold text-gray-800">{matchCity}</span>
                        </div>
                        {m.matchedFactors && m.matchedFactors.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                              Matching Habits
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {m.matchedFactors.slice(0, 4).map((f) => (
                                <span
                                  key={f}
                                  className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 capitalize"
                                >
                                  {f.replace(/([A-Z])/g, " $1")}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api.post(`/connections/${m.user?._id || m.studentId}`);
                          alert(`Connection request sent to ${matchName}!`);
                        } catch (err) {
                          alert(err.response?.data?.message || `Request sent to ${matchName}!`);
                        }
                      }}
                      className="w-full rounded-xl border border-[#5b3bf5] py-2.5 text-xs font-bold text-[#5b3bf5] transition hover:bg-[#f5f2ff] cursor-pointer"
                    >
                      Send Connection Request
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // ------------------------------------
    // TAB: SHORTLISTED PGS
    // ------------------------------------
    if (currentTab === "favorites") {
      const shortlistedProperties = favorites
        .map((f) => f.property)
        .filter(Boolean);

      return (
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shortlisted PGs</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {favorites.length} accommodation{favorites.length === 1 ? "" : "s"} bookmarked for your stay
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                type="button"
                onClick={() => setCurrentTab("properties")}
                className="text-xs font-semibold text-[#5b3bf5] hover:underline cursor-pointer"
              >
                + Find More PGs
              </button>
            )}
          </div>

          <RecommendedPGs
            properties={shortlistedProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={setSelectedProperty}
            title={`Your Bookmarked Accommodations (${shortlistedProperties.length})`}
            emptyMessage="You haven't bookmarked any PGs yet. Explore verified listings and click the heart icon on any accommodation to save it here."
          />
        </div>
      );
    }

    // ------------------------------------
    // TAB: REVIEWS GIVEN
    // ------------------------------------
    if (currentTab === "reviews") {
      return (
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reviews Given</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Reviews you have contributed to help students find trustworthy accommodations
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
              {myReviews.length} review{myReviews.length === 1 ? "" : "s"}
            </span>
          </div>

          {myReviews.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-xs space-y-3">
              <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Reviews Written Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You haven't reviewed any properties. When you inspect or stay at a student PG, leave feedback to help other students.
              </p>
              <button
                type="button"
                onClick={() => setCurrentTab("properties")}
                className="rounded-xl bg-[#5b3bf5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4a2ce0] cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">
                        {rev.property?.title || "Property"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {rev.property?.location?.area ? `${rev.property.location.area}, ` : ""}
                        {rev.property?.location?.city || "Ahmedabad"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{rev.rating} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-3">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                    <span>
                      Posted on {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="text-emerald-600 font-semibold">✓ Verified Review</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ------------------------------------
    // TAB: STUDENT PROFILE
    // ------------------------------------
    if (currentTab === "profile") {
      const studentName = `${currentUser?.firstName || user?.firstName || "Student"} ${currentUser?.lastName || user?.lastName || ""}`.trim();

      return (
        <div className="flex-1 max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your personal information, college enrollment, and lifestyle preferences
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                setProfileStatusMsg("");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b3bf5] hover:bg-[#4a2ce0] px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditingProfile ? "Cancel Editing" : "Edit Profile"}</span>
            </button>
          </div>

          {profileStatusMsg && (
            <div
              className={`rounded-xl border p-3.5 text-xs flex items-center gap-2 font-medium ${
                profileStatusType === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              {profileStatusType === "error" ? (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              )}
              <span>{profileStatusMsg}</span>
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#5b3bf5] to-[#7c3aed] text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
              {currentUser?.firstName?.[0] || user?.firstName?.[0] || "S"}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{studentName}</h3>
                  <p className="text-xs text-gray-500">
                    {currentUser?.college || profile?.collegeName || "University Student"}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold self-center sm:self-start">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-gray-600 pt-1">
                {currentUser?.bio || "No biography added yet. Update your profile to describe yourself to potential roommates."}
              </p>
            </div>
          </div>

          {/* View Mode or Edit Form */}
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Personal Details Form Card */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-[#5b3bf5]" />
                  <span>Personal & Academic Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">College / University</label>
                    <input
                      type="text"
                      required
                      value={profileForm.college}
                      onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Department / Course</label>
                    <input
                      type="text"
                      value={profileForm.course}
                      onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Bio / About Yourself</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Share your hobbies, study goals, or daily routine..."
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Preferences Form Card */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#5b3bf5]" />
                  <span>Lifestyle & Accommodation Preferences</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Preferred City</label>
                    <select
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    >
                      {GUJARAT_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Sleep Schedule</label>
                    <select
                      value={profileForm.sleepSchedule}
                      onChange={(e) => setProfileForm({ ...profileForm, sleepSchedule: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    >
                      <option value="early_bird">Early Riser (Wake up by 6-7 AM)</option>
                      <option value="night_owl">Night Owl (Sleep past 1 AM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Dietary Preference</label>
                    <select
                      value={profileForm.dietaryPreference}
                      onChange={(e) => setProfileForm({ ...profileForm, dietaryPreference: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    >
                      <option value="vegetarian">Vegetarian</option>
                      <option value="jain">Jain</option>
                      <option value="non_vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="no_preference">No Preference</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Cleanliness Standard (1-5)</label>
                    <select
                      value={profileForm.cleanliness}
                      onChange={(e) => setProfileForm({ ...profileForm, cleanliness: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    >
                      <option value={5}>5 - Very Clean & Organized</option>
                      <option value={4}>4 - Clean / Tidy</option>
                      <option value={3}>3 - Moderate / Normal</option>
                      <option value={2}>2 - Relaxed</option>
                      <option value={1}>1 - Very Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Study Habits</label>
                    <select
                      value={profileForm.studyHabit}
                      onChange={(e) => setProfileForm({ ...profileForm, studyHabit: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    >
                      <option value="complete_silence">Focused (Complete Silence)</option>
                      <option value="light_music">Light Music / Ambient</option>
                      <option value="group_study">Group Study</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Monthly Budget (Min ₹)</label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={profileForm.minBudget}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, minBudget: e.target.value });
                        if (profileStatusMsg) setProfileStatusMsg("");
                      }}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                    {Number(profileForm.minBudget) < 500 && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">
                        Minimum budget must be at least ₹500
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Monthly Budget (Max ₹)</label>
                    <input
                      type="number"
                      min="501"
                      step="500"
                      value={profileForm.maxBudget}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, maxBudget: e.target.value });
                        if (profileStatusMsg) setProfileStatusMsg("");
                      }}
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs"
                    />
                    {Number(profileForm.minBudget) >= Number(profileForm.maxBudget) && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">
                        Minimum budget must be strictly less than maximum budget
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#5b3bf5] hover:bg-[#4a2ce0] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Academic & Contact */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#5b3bf5]" />
                  <span>Academic & Contact Information</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Email Address</span>
                    <span className="font-semibold text-gray-900">{currentUser?.email || user?.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Phone Number</span>
                    <span className="font-semibold text-gray-900">{currentUser?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">City / Location</span>
                    <span className="font-semibold text-gray-900">{currentUser?.city || selectedCity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">College</span>
                    <span className="font-semibold text-gray-900">{currentUser?.college || profile?.collegeName || "Nirma University"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Department / Course</span>
                    <span className="font-semibold text-gray-900">{currentUser?.course || profile?.course || "Computer Engineering"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Graduation Year</span>
                    <span className="font-semibold text-gray-900">{currentUser?.graduationYear || profile?.graduationYear || 2026}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Lifestyle & Roommate Preferences */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#5b3bf5]" />
                  <span>Lifestyle & Compatibility Factors</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Preferred City</span>
                    <span className="font-semibold text-gray-900">
                      {profile?.preferredLocations?.[0] || currentUser?.city || selectedCity}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Sleep Schedule</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {profile?.sleepSchedule ? profile.sleepSchedule.replace("_", " ") : "Flexible"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Cleanliness Level</span>
                    <span className="font-semibold text-gray-900">
                      {profile?.cleanliness || 4} / 5
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Study Habits</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {profile?.studyHabit ? profile.studyHabit.replace("_", " ") : "Flexible"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Food Preference</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {profile?.dietaryPreference || "Vegetarian"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Monthly Budget</span>
                    <span className="font-semibold text-[#5b3bf5]">
                      ₹{profile?.budget?.min?.toLocaleString("en-IN") || "6,000"} - ₹{profile?.budget?.max?.toLocaleString("en-IN") || "13,000"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Smoking / Alcohol</span>
                    <span className="font-semibold text-gray-900">
                      {profile?.smoking ? "Smoker" : "Non-smoker"} · {profile?.drinking || "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ------------------------------------
    // TAB: QUESTIONNAIRE
    // ------------------------------------
    if (currentTab === "questionnaire") {
      return (
        <div className="flex-1 max-w-3xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Lifestyle Questionnaire</h2>
            <p className="text-xs text-gray-500">
              Your answers help our AI match you with compatible roommates using LCI
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Preferred City</label>
                <select
                  value={profileForm.city || selectedCity}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, city: e.target.value });
                    if (questionnaireStatusMsg) setQuestionnaireStatusMsg("");
                  }}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  {GUJARAT_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Monthly Budget (Min ₹)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={profileForm.minBudget}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, minBudget: e.target.value });
                    if (questionnaireStatusMsg) setQuestionnaireStatusMsg("");
                  }}
                  placeholder="e.g. 5000 (min ₹500)"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                />
                {Number(profileForm.minBudget) < 500 && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">
                    Minimum budget must be at least ₹500
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Monthly Budget (Max ₹)</label>
                <input
                  type="number"
                  min="501"
                  step="500"
                  value={profileForm.maxBudget}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, maxBudget: e.target.value });
                    if (questionnaireStatusMsg) setQuestionnaireStatusMsg("");
                  }}
                  placeholder="e.g. 15000"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                />
                {Number(profileForm.minBudget) >= Number(profileForm.maxBudget) && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">
                    Minimum budget must be strictly less than maximum budget
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Sleep Schedule</label>
                <select
                  value={profileForm.sleepSchedule}
                  onChange={(e) => setProfileForm({ ...profileForm, sleepSchedule: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value="early_bird">Early Riser (Wake up by 6-7 AM)</option>
                  <option value="night_owl">Night Owl (Sleep past 1 AM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Cleanliness Standard</label>
                <select
                  value={profileForm.cleanliness}
                  onChange={(e) => setProfileForm({ ...profileForm, cleanliness: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value={5}>5 - Very Clean & Organized</option>
                  <option value={4}>4 - Clean / Tidy</option>
                  <option value={3}>3 - Moderate / Normal</option>
                  <option value={2}>2 - Relaxed</option>
                  <option value={1}>1 - Very Relaxed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Study Habits</label>
                <select
                  value={profileForm.studyHabit}
                  onChange={(e) => setProfileForm({ ...profileForm, studyHabit: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value="complete_silence">Focused (Complete Silence)</option>
                  <option value="light_music">Light Music / Ambient</option>
                  <option value="group_study">Group Study</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Dietary Preference</label>
                <select
                  value={profileForm.dietaryPreference}
                  onChange={(e) => setProfileForm({ ...profileForm, dietaryPreference: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="jain">Jain</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Smoking</label>
                <select
                  value={profileForm.smoking ? "yes" : "no"}
                  onChange={(e) => setProfileForm({ ...profileForm, smoking: e.target.value === "yes" })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value="no">No (Non-smoker)</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Alcohol Consumption</label>
                <select
                  value={profileForm.drinking}
                  onChange={(e) => setProfileForm({ ...profileForm, drinking: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                >
                  <option value="no">No</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {questionnaireStatusMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{questionnaireStatusMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  setQuestionnaireStatusMsg("");
                  const minB = Number(profileForm.minBudget);
                  const maxB = Number(profileForm.maxBudget);

                  if (isNaN(minB) || minB < 500) {
                    setQuestionnaireStatusMsg("Minimum monthly budget must be at least ₹500.");
                    return;
                  }

                  if (isNaN(maxB) || minB >= maxB) {
                    setQuestionnaireStatusMsg("Minimum budget must be strictly less than maximum budget.");
                    return;
                  }

                  try {
                    const chosenCity = profileForm.city || selectedCity || "Ahmedabad";

                    // 1. Update user profile city
                    await api.put("/users/me", {
                      city: chosenCity,
                    });

                    // 2. Save compatibility profile
                    await api.post("/profiles", {
                      collegeName: currentUser?.college || profile?.collegeName || "Nirma University",
                      course: currentUser?.course || profile?.course || "General",
                      graduationYear: currentUser?.graduationYear || profile?.graduationYear || 2026,
                      sleepSchedule: profileForm.sleepSchedule,
                      cleanliness: Number(profileForm.cleanliness) || 4,
                      studyHabit: profileForm.studyHabit,
                      socialHabit: 3,
                      dietaryPreference: profileForm.dietaryPreference,
                      smoking: Boolean(profileForm.smoking),
                      drinking: profileForm.drinking,
                      budget: {
                        min: minB,
                        max: maxB,
                      },
                      preferredLocations: [chosenCity],
                      preferredRoomType: profileForm.preferredRoomType || "any",
                    });

                    // 3. Immediately sync dashboard default city
                    setSelectedCity(chosenCity);

                    alert("Preferences updated! Roommate matches recalculated.");
                    await fetchDashboardData();
                    setCurrentTab("matches");
                  } catch (err) {
                    console.error("Failed to save questionnaire", err);
                    const msg = err.response?.data?.message || "Failed to save preferences. Please check your inputs.";
                    setQuestionnaireStatusMsg(msg);
                  }
                }}
                className="rounded-xl bg-[#5b3bf5] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#4a2ce0] cursor-pointer"
              >
                Save Preferences & Calculate Matches
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ------------------------------------
    // TAB: PAYMENTS (HONEST EMPTY STATE - NO FAKE 2025 DATA)
    // ------------------------------------
    if (currentTab === "payments") {
      return (
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payments & Receipts</h2>
              <p className="text-xs text-gray-500">
                Track your rent schedule, security deposit, and payment receipts
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-xs space-y-3">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Active Invoices or Dues</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              You do not have any active rental agreements or upcoming rent payments at this time. When a property host confirms your room booking, your payment schedule and receipts will be displayed here.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentTab("properties")}
                className="rounded-xl bg-[#5b3bf5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4a2ce0] cursor-pointer"
              >
                Explore Verified Accommodations
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ------------------------------------
    // TAB: CHATS / MESSAGES
    // ------------------------------------
    if (currentTab === "chats") {
      return (
        <div className="flex-1 rounded-3xl border border-gray-100 bg-white shadow-xs overflow-hidden h-[600px] flex flex-col md:flex-row">
          <aside className="w-full md:w-72 border-r border-gray-100 p-4 space-y-3">
            <h3 className="text-base font-bold text-gray-900">Messages</h3>
            <div className="space-y-2">
              {chats.length === 0 ? (
                <p className="text-xs text-gray-400 p-2">No active conversations yet.</p>
              ) : (
                chats.map((c, i) => {
                  const otherParticipant = c.participants?.find((p) => p._id !== currentUser?._id) || c.participants?.[0];
                  const title = otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : "Host";
                  return (
                    <div
                      key={c._id || i}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-full bg-[#5b3bf5] text-white flex items-center justify-center font-bold text-sm">
                        {title[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <b className="text-xs text-gray-900 truncate">{title}</b>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMessage || "Conversation started"}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex-1 flex flex-col bg-[#fbfbfe] items-center justify-center p-8 text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-[#f5f2ff] text-[#5b3bf5] flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Chat with Roommates & Hosts</h4>
            <p className="text-xs text-gray-500 max-w-sm">
              Connect with fellow students or property hosts directly on StayMatch to discuss sharing accommodations.
            </p>
          </section>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="flex-1 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xs space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ff] text-[#5b3bf5]">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 capitalize">{currentTab} Section</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          You are viewing the {currentTab} section.
        </p>
        <button
          type="button"
          onClick={() => setCurrentTab("overview")}
          className="rounded-xl bg-[#5b3bf5] px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
        >
          Back to Overview
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-gray-900 flex flex-col selection:bg-[#5b3bf5] selection:text-white">
      {personaSwitcher}

      <TopNavbar
        user={currentUser || user}
        selectedCity={selectedCity}
        onCityChange={(newCity) => {
          setSelectedCity(newCity);
          setProfileForm((prev) => ({ ...prev, city: newCity }));
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateTab={setCurrentTab}
        onLogout={onLogout}
      />

      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        <LeftSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenInvite={() => setIsInviteOpen(true)}
          onLogout={onLogout}
          favoritesCount={favorites.length}
          reviewsCount={myReviews.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 min-w-0 overflow-x-hidden">
          {renderTabContent()}

          {currentTab === "overview" && (
            <RightSidebar
              onNavigateTab={setCurrentTab}
              onOpenPayment={() => setIsPaymentOpen(true)}
              matches={matches}
            />
          )}
        </main>
      </div>

      <FloatingChatButton onOpenFullChat={() => setCurrentTab("chats")} />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onContact={() => setCurrentTab("chats")}
      />
    </div>
  );
}

