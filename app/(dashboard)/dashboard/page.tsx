"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { motion, AnimatePresence } from "motion/react";
import { Award, User, FileText, Megaphone, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

import { SidebarItem, ChatMessage } from "@/components/dashboard/types";
import {
  COHORTS,
  OPPORTUNITIES_DATA,
  DEFAULT_OPPORTUNITIES,
  INITIAL_COMPLAINTS,
} from "@/components/dashboard/constants";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FieldOfficerChat } from "@/components/dashboard/FieldOfficerChat";
import { AnnouncementFeed } from "@/components/dashboard/AnnouncementFeed";
import { DashboardOverviewTab } from "@/components/dashboard/tabs/DashboardOverviewTab";
import { OpportunitiesTab } from "@/components/dashboard/tabs/OpportunitiesTab";
import { ProfileTab } from "@/components/dashboard/tabs/ProfileTab";
import { ComplaintsTab } from "@/components/dashboard/tabs/ComplaintsTab";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Destructure non-sensitive payload properties from user state
  const {
    address = "",
    age,
    cohortDescription = "",
    dateOfBirth = "",
    gender = "",
    nin = "",
    phoneNumber = "",
    stateOfOrigin = "",
    stateOfResidence = "",
  } = user || {};

  // Extract user details from user auth store or localStorage dynamically
  const citizenName = useMemo(() => {
    if (user?.firstName || user?.lastName) {
      const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean);
      return parts.join(" ");
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("citi_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.firstName || parsed?.lastName) {
            const parts = [parsed.firstName, parsed.middleName, parsed.lastName].filter(Boolean);
            return parts.join(" ");
          }
        } catch (e) {}
      }
    }
    return user?.email ? user.email.split("@")[0] : "";
  }, [user]);

  const citizenEmail = user?.email || "";
  const desiredSupportCode = user?.desiredSupport || "";

  const cohortName =
    user?.cohortName ||
    (desiredSupportCode ? COHORTS[desiredSupportCode as keyof typeof COHORTS] : "") ||
    "General Citizens Registry";

  const citizenCode = useMemo(() => {
    if (user?.citizenCode) return user.citizenCode;
    if (user?.data?.citizenCode) return user.data.citizenCode;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("citi_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.citizenCode) return parsed.citizenCode;
        } catch (e) {}
      }
    }
    return "";
  }, [user]);

  // Copy citizen code function
  const copyCitizenCode = () => {
    if (!citizenCode) return;
    navigator.clipboard.writeText(citizenCode).then(() => {
      toast.success("Citizen Code copied to clipboard!");
    });
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Avatar
  const avatarInitials = useMemo(() => {
    if (!citizenName) return "CE";
    const parts = citizenName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return citizenName.slice(0, 2).toUpperCase();
  }, [citizenName]);

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarImage(event.target.result as string);
          toast.success("Profile photo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Opportunities State ───────────────────────────────────────────────────
  const matchingOpportunities = useMemo(() => {
    if (
      desiredSupportCode &&
      OPPORTUNITIES_DATA[desiredSupportCode as keyof typeof OPPORTUNITIES_DATA]
    ) {
      return OPPORTUNITIES_DATA[desiredSupportCode as keyof typeof OPPORTUNITIES_DATA];
    }
    return DEFAULT_OPPORTUNITIES;
  }, [desiredSupportCode]);

  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState<Record<string, boolean>>({});

  const handleApply = (id: string, title: string) => {
    setAppliedOpportunities((prev) => ({ ...prev, [id]: true }));
    toast.success(`Application for "${title}" submitted!`);
  };

  // ── Complaints State ──────────────────────────────────────────────────────
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "Infrastructure",
    description: "",
  });
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      toast.error("Please fill in all complaint details.");
      return;
    }
    setIsSubmittingComplaint(true);
    setTimeout(() => {
      setIsSubmittingComplaint(false);
      setComplaints((prev) => [
        {
          id: `comp-${Date.now()}`,
          title: newComplaint.title,
          category: newComplaint.category,
          description: newComplaint.description,
          status: "Pending",
          date: "Just now",
        },
        ...prev,
      ]);
      setNewComplaint({ title: "", category: "Infrastructure", description: "" });
      toast.success("Complaint registered!");
    }, 1000);
  };

  // ── Field Officer Chat State ──────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const greetingName = citizenName ? citizenName.split(" ")[0] : "Citizen";
    const cohortStr = cohortName ? ` for ${cohortName}` : "";
    setChatMessages([
      {
        sender: "officer",
        text: `Hello ${greetingName}, I am Officer Aisha Bello, your assigned Field Officer${cohortStr}. How can I assist you with your benefits, applications, or complaints today?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [citizenName, cohortName]);

  const [officerTyping, setOfficerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, officerTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "citizen", text: userText, time: timeStr }]);
    setChatInput("");
    setOfficerTyping(true);
    setTimeout(() => {
      setOfficerTyping(false);
      let replyText = `I have received your message. I am currently cross-referencing your profile credentials (${citizenCode}) with our federal dashboard. Is there anything else I can add to your review notes?`;
      const textLower = userText.toLowerCase();
      if (
        textLower.includes("grant") ||
        textLower.includes("capital") ||
        textLower.includes("loan") ||
        textLower.includes("money")
      ) {
        replyText = `Regarding your Business Capital Grant application: I see you are registered under ${cohortName}. I've noted down your inquiry. Please ensure your profile section is fully completed. I will expedite the vetting this afternoon!`;
      } else if (
        textLower.includes("scholarship") ||
        textLower.includes("tuition") ||
        textLower.includes("study")
      ) {
        replyText = `For the Scholarship programs, please complete your profile data in the 'Complete Profile' tab. I'm verifying local university admission letters today.`;
      } else if (
        textLower.includes("complaint") ||
        textLower.includes("waste") ||
        textLower.includes("power")
      ) {
        replyText = `I see your complaint. The municipal team is currently dispatched for primary inspections. I've tagged your citizen code to escalate this ticket to high-priority.`;
      } else if (textLower.includes("hello") || textLower.includes("hi") || textLower.includes("hey")) {
        replyText = `Hello! Hope your day is going well. Let me know what information you need about your welfare track or assigned tasks.`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "officer",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1800);
  };

  // ── Sidebar Items ─────────────────────────────────────────────────────────
  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "announcements", label: "Announcements Feed", icon: Megaphone },
    { id: "opportunities", label: "View Opportunities", icon: Award },
    { id: "profile", label: "Complete Profile", icon: User },
    { id: "complaints", label: "Lodge Complaint", icon: FileText, badge: complaints.length },
  ];

  return (
    <div className="min-h-screen bg-stone-50/60 flex relative font-sans">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        citizenName={citizenName}
        citizenEmail={citizenEmail}
        cohortName={cohortName}
        avatarInitials={avatarInitials}
        avatarImage={avatarImage}
        fileInputRef={fileInputRef}
        handleAvatarChange={handleAvatarChange}
        handleLogout={handleLogout}
        sidebarItems={sidebarItems}
      />

      {/* Main Content Window */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Header */}
        <DashboardHeader
          activeTab={activeTab}
          setMobileMenuOpen={setMobileMenuOpen}
          citizenCode={citizenCode}
          copyCitizenCode={copyCitizenCode}
        />

        {/* Dynamic Tab Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {activeTab === "overview" && (
                <DashboardOverviewTab
                  cohortName={cohortName}
                  cohortDescription={cohortDescription}
                  desiredSupportCode={desiredSupportCode}
                  matchingOpportunities={matchingOpportunities}
                  appliedOpportunities={appliedOpportunities}
                  onApply={handleApply}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === "announcements" && <AnnouncementFeed />}

              {activeTab === "opportunities" && (
                <OpportunitiesTab
                  kpisCompletedCount={0}
                  totalKpisCount={0}
                  kpiPercentage={0}
                  desiredSupportCode={desiredSupportCode}
                  matchingOpportunities={matchingOpportunities}
                  expandedOpportunityId={expandedOpportunityId}
                  setExpandedOpportunityId={setExpandedOpportunityId}
                  appliedOpportunities={appliedOpportunities}
                  handleApply={handleApply}
                  cohortName={cohortName}
                />
              )}

              {activeTab === "profile" && (
                <ProfileTab
                  avatarImage={avatarImage}
                  avatarInitials={avatarInitials}
                  citizenName={citizenName}
                  fileInputRef={fileInputRef}
                  address={address}
                  age={age}
                  dateOfBirth={dateOfBirth}
                  gender={gender}
                  nin={nin}
                  phoneNumber={phoneNumber}
                  stateOfOrigin={stateOfOrigin}
                  stateOfResidence={stateOfResidence}
                  citizenCode={citizenCode}
                  email={citizenEmail}
                />
              )}

              {activeTab === "complaints" && (
                <ComplaintsTab
                  complaints={complaints}
                  newComplaint={newComplaint}
                  setNewComplaint={setNewComplaint}
                  isSubmittingComplaint={isSubmittingComplaint}
                  handleLodgeComplaint={handleLodgeComplaint}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Officer Chat */}
      <FieldOfficerChat
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatMessages={chatMessages}
        officerTyping={officerTyping}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}
