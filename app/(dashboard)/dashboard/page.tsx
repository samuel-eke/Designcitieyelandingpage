"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Copy,
  LogOut,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  MapPin,
  Activity,
  FileText,
  Check,
  Menu,
  X,
  Award,
  Briefcase,
  AlertCircle,
  Clock,
  ShieldCheck,
  ThumbsUp,
  Building,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

// Define option sets
const SUPPORT_OPTIONS = {
  scholarship: "Scholarship Track",
  medical_aid_treatment: "Medical Aid & Treatment",
  business_capital: "Business Capital Grant",
  investor_funding: "Investor Funding & Prototype Lab",
  job_opportunity: "Job & Internship Opportunity",
  visa_sponsorship: "Visa Sponsorship",
  skill_acquisition: "Digital Skills & Skill Acquisition",
};

const COHORTS = {
  scholarship: "Academic Excellence Cohort",
  medical_aid_treatment: "Healthcare Welfare Cohort",
  business_capital: "SME Empowerment Cohort",
  investor_funding: "Technological Innovation Cohort",
  job_opportunity: "Career Development Cohort",
  visa_sponsorship: "Global Mobility Cohort",
  skill_acquisition: "Digital Skills Capacity Cohort",
  default: "General Citizens Registry",
};

const METRICS = {
  scholarship: { kpis: "3/4", progress: 75, cohortActive: "92%", opportunitiesCount: 6 },
  medical_aid_treatment: { kpis: "2/3", progress: 66, cohortActive: "88%", opportunitiesCount: 4 },
  business_capital: { kpis: "4/5", progress: 80, cohortActive: "85%", opportunitiesCount: 5 },
  investor_funding: { kpis: "1/4", progress: 25, cohortActive: "90%", opportunitiesCount: 7 },
  job_opportunity: { kpis: "3/5", progress: 60, cohortActive: "84%", opportunitiesCount: 8 },
  visa_sponsorship: { kpis: "2/4", progress: 50, cohortActive: "79%", opportunitiesCount: 3 },
  skill_acquisition: { kpis: "5/6", progress: 83, cohortActive: "91%", opportunitiesCount: 9 },
  default: { kpis: "2/4", progress: 50, cohortActive: "85%", opportunitiesCount: 5 }
};

interface Opportunity {
  id: string;
  title: string;
  type: string;
  status: string;
  brief: string;
  full: string;
  docs: string;
  officerNotes: string;
  actionLabel: string;
}

const OPPORTUNITIES_DATA: Record<string, Opportunity[]> = {
  scholarship: [
    {
      id: "op1",
      title: "Federal Tertiary Education Trust Fund (TETFund)",
      type: "Full Tuition Scholarship",
      status: "Open",
      brief: "Covers tuition, accommodation, and stipend for Nigerian students in federal universities.",
      full: "The TETFund Scholarship Scheme aims to support brilliant but financially disadvantaged students studying in Nigerian public universities. Selected scholars receive full coverage of tuition, a yearly book stipend of ₦150,000, and fully paid campus accommodation.",
      docs: "Admission letter, CGPA statement of results (min 3.5/5.0), Local Government Certificate of Origin.",
      officerNotes: "Please ensure your State of Origin matches your uploaded Certificate of Origin. Applications close this Friday.",
      actionLabel: "Submit Scholarship Application",
    },
    {
      id: "op2",
      title: "Chevening - CitiEye Bilateral Partnership Program",
      type: "International Study Grant",
      status: "Upcoming",
      brief: "Joint funding for post-graduate leadership programs in the UK.",
      full: "A unique partnership between the UK Chevening Secretariat and CitiEye to sponsor 50 young Nigerian leaders for Master's degrees in public policy, community development, and public health in the United Kingdom. Covers flights, tuition, and living costs.",
      docs: "Bachelor's Degree Certificate (First Class or 2:1), IELTS Academic (min 7.0), 2 Academic Reference Letters.",
      officerNotes: "This track will open for applications next month. Please prepare your essay drafts in advance.",
      actionLabel: "Set Reminder & Notify Officer",
    },
    {
      id: "op3",
      title: "MTN Foundation Science & Tech Scholarship",
      type: "Annual Cash Grant",
      status: "Open",
      brief: "₦200,000 annual scholarship for students in STEM fields.",
      full: "The MTN Foundation awards annual scholarships to high-achieving 300-level students in public tertiary institutions. Beneficiaries must maintain a cumulative GPA of 3.5 or above to retain the scholarship until graduation.",
      docs: "Student ID card, Departmental Head's recommendation, current academic transcript.",
      officerNotes: "Verify your CGPA with your department before applying to avoid disqualification.",
      actionLabel: "Submit Academic Records",
    },
  ],
  medical_aid_treatment: [
    {
      id: "op4",
      title: "National Health Insurance Authority (NHIA) Subsidy",
      type: "Healthcare Subsidy",
      status: "Active",
      brief: "Up to 90% discount on prescription drugs and general consultation fees.",
      full: "This welfare program covers 90% of the cost of generic drugs and essential consultations at approved federal medical centers. The subsidy is credited directly to your CitiEye citizen health code.",
      docs: "CitiEye citizen code, NIN validation, Doctor's referral prescription.",
      officerNotes: "Officer Aisha Bello has pre-approved your eligibility. Present your code at any NHIA-partnered pharmacy.",
      actionLabel: "Claim Health Insurance Voucher",
    },
    {
      id: "op5",
      title: "Maternal Health & Child Nutrition Aid",
      type: "Nutrition Package",
      status: "Open",
      brief: "Free monthly prenatal checkups and child nutrition packs.",
      full: "For expectant mothers and parents with children under 5 years old. This program provides monthly medical consultations, immunization schedules, and nutrition food baskets containing essential supplements and fortifiers.",
      docs: "Antenatal card, Child birth certificate/registration.",
      officerNotes: "Vouchers are distributed on the 1st and 15th of every month. Check in at your local primary health center.",
      actionLabel: "Schedule Clinic Appointment",
    },
  ],
  business_capital: [
    {
      id: "op6",
      title: "SMEDAN Micro-Enterprise Seed Grant",
      type: "Equity-Free Grant",
      status: "Open",
      brief: "₦500,000 seed grant for registered micro-businesses and artisans.",
      full: "The Small and Medium Enterprises Development Agency of Nigeria (SMEDAN) is partnering with CitiEye to distribute seed capital to registered young business owners. This grant is equity-free and is intended for purchasing capital equipment or inventory.",
      docs: "CAC registration certificate, Tax Identification Number (TIN), Business plan/proposal (maximum 2 pages).",
      officerNotes: "Be sure to upload a video demo of your workshop or products in the 'Metrics' section to increase chance.",
      actionLabel: "Apply for SME Grant",
    },
    {
      id: "op7",
      title: "Bank of Industry (BOI) Interest-Free Tech Loan",
      type: "Interest-Free Loan",
      status: "Open",
      brief: "Interest-free working capital loan up to ₦2,000,000 with 18 months repayment.",
      full: "BOI provides interest-free loan facility to tech startups, digital service agencies, and tech-driven hubs. The loan is payable over 18 months after a 3-month moratorium period.",
      docs: "CAC registration, 2 Guarantors (Level 12+ civil servants or recognized community leaders), 6-month bank statement.",
      officerNotes: "A credit bureau check will be performed. Please ensure you have no outstanding default loans.",
      actionLabel: "Initiate Loan Application",
    },
  ],
  investor_funding: [
    {
      id: "op8",
      title: "National Tech Development Fund & Prototype Lab",
      type: "Incubation Grant",
      status: "Open",
      brief: "₦5,000,000 research and prototyping grant for hardware/software builders.",
      full: "For hardware makers, IoT engineers, and software architects building local solutions. Provides access to state-of-the-art labs in Abuja and Lagos, hardware prototyping materials, and a cash grant to construct pilot versions.",
      docs: "Technical architecture document, circuit design (if hardware), Github repo link (if software), pitch deck.",
      officerNotes: "You will be requested to pitch to the evaluation board on Zoom next month. Prepare a 5-minute slide deck.",
      actionLabel: "Submit Lab Proposal",
    },
  ],
  job_opportunity: [
    {
      id: "op9",
      title: "Federal Graduate Internship Program (FGIP)",
      type: "Paid Internship",
      status: "Open",
      brief: "12-month paid internship with ₦80,000 monthly stipend at federal agencies.",
      full: "FGIP matches young graduates with government ministries, departments, and agencies (MDAs) or partnered private corporations. The program includes professional mentoring and a monthly stipend funded by the federal government.",
      docs: "NYSC Discharge Certificate, Degree certificate (B.Sc/HND, min Second Class Lower), CV.",
      officerNotes: "Please ensure your CV details are fully updated in the profile section before submitting your application.",
      actionLabel: "Apply for Internship Match",
    },
  ],
  visa_sponsorship: [
    {
      id: "op10",
      title: "Global Talent Tech Mission Sponsorship",
      type: "Visa Support & Travel Grant",
      status: "Open",
      brief: "Visa endorsement assistance and travel grant for international tech conferences.",
      full: "CitiEye supports tech talent representing Nigeria at global scaleups and events. Covers visa application fees, flight logistics, and recommendation letters from the Ministry of Communications and Digital Economy.",
      docs: "Conference invitation letter, Github profile with active contributions, passport bio data page.",
      officerNotes: "Applications take 3 weeks for ministerial review. Apply early to accommodate visa processing time.",
      actionLabel: "Request Visa Sponsorship Letter",
    },
  ],
  skill_acquisition: [
    {
      id: "op11",
      title: "3MTT - 3 Million Technical Talents Program",
      type: "Technical Training",
      status: "Open",
      brief: "Free intensive training in software development, AI, data science, and product design.",
      full: "The Ministry of Communications, Innovation and Digital Economy is offering free tech training with placement opportunities. Trainees receive monthly internet allowance and access to physical learning hubs in all 36 states.",
      docs: "NIN validation, secondary school certificate (WAEC/NECO).",
      officerNotes: "Classes are held in cohorts. Select your closest physical hub in your profile page under residence details.",
      actionLabel: "Register for 3MTT Cohort",
    },
    {
      id: "op12",
      title: "Renewed Hope Artisan Skill Training Initiative",
      type: "Artisan Certification",
      status: "Open",
      brief: "Certified vocational training in solar installation, fashion design, and auto-mechanics.",
      full: "A 3-month fully funded vocational program aiming to empower youths with practical trade skills. At graduation, participants receive a certified trade test license and a business startup toolkit.",
      docs: "WAEC or primary school leaving certificate, passport photo.",
      officerNotes: "Toolkits are distributed upon 90% attendance. Your field officer will perform weekly spot checks.",
      actionLabel: "Claim Training Seat",
    },
  ],
};

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "op_def",
    title: "CitiEye National Civic Welfare Support Program",
    type: "General Welfare Program",
    status: "Open",
    brief: "Access to community-level food vouchers, education, and medical checkups.",
    full: "General citizen support program providing community welfare packages. Vouchers can be redeemed for groceries, school books, or primary health center visits.",
    docs: "CitiEye citizen code, State residency certificate.",
    officerNotes: "Please complete your NIN profile details to qualify for targeted tier-2 programs.",
    actionLabel: "Claim General Support Voucher",
  },
];

interface ChatMessage {
  sender: "citizen" | "officer";
  text: string;
  time: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("opportunities");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract user details or use realistic mock placeholders if backend isn't populated
  const citizenName = useMemo(() => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`;
    }
    // Read from localStorage directly just in case
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("citi_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.firstName) return `${parsed.firstName} ${parsed.lastName || ""}`;
        } catch (e) { }
      }
    }
    return "Emeka Obi";
  }, [user]);

  const citizenEmail = user?.email || "emeka.obi@nigeria.gov.ng";
  const citizenPhone = user?.phoneNumber || "08031234567";
  const desiredSupportCode = user?.desiredSupport || "business_capital";

  const cohortName = useMemo(() => {
    return COHORTS[desiredSupportCode as keyof typeof COHORTS] || COHORTS.default;
  }, [desiredSupportCode]);

  const citizenCode = useMemo(() => {
    // Generate a beautiful unique citizen code based on user name, or show default
    if (user?.citizenCode) return user.citizenCode;
    if (user?.data?.citizenCode) return user.data.citizenCode;

    // Hash letters to keep it consistent
    const codePart = citizenName.replace(/[^A-Z]/gi, "").toUpperCase().slice(0, 8);
    const suffix = user?.nin ? user.nin.slice(-4) : "2026";
    return `CTE-${codePart || "CITIZEN"}-${suffix}`;
  }, [user, citizenName]);

  // Copy citizen code function
  const [copied, setCopied] = useState(false);
  const copyCitizenCode = () => {
    navigator.clipboard.writeText(citizenCode).then(() => {
      setCopied(true);
      toast.success("Citizen Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Dedicated Logout
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // --- Dynamic Avatar Generator ---
  const avatarInitials = useMemo(() => {
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

  // --- 1. Opportunities Tab State ---
  const matchingOpportunities = useMemo(() => {
    return OPPORTUNITIES_DATA[desiredSupportCode as keyof typeof OPPORTUNITIES_DATA] || DEFAULT_OPPORTUNITIES;
  }, [desiredSupportCode]);

  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState<Record<string, boolean>>({});

  const handleApply = (id: string, title: string) => {
    setAppliedOpportunities((prev) => ({ ...prev, [id]: true }));
    toast.success(`Application for "${title}" submitted to Officer Aisha!`);
  };

  // --- 2. KPIs Tab State ---
  const [kpiChecklist, setKpiChecklist] = useState([
    { id: "kpi1", label: "Register for Permanent Voter's Card (PVC)", completed: true, points: 20 },
    { id: "kpi2", label: "Link National Identification Number (NIN) to Citizen Profile", completed: true, points: 15 },
    { id: "kpi3", label: "Attend Ward Community Town Hall Meeting (Virtual or Physical)", completed: false, points: 30 },
    { id: "kpi4", label: "Complete Yearly Basic Health Assessment at Federal Center", completed: false, points: 25 },
    { id: "kpi5", label: "Submit Neighborhood Safety Feedback Form", completed: false, points: 10 },
  ]);

  const kpisCompletedCount = kpiChecklist.filter((k) => k.completed).length;
  const totalKpisCount = kpiChecklist.length;
  const kpiPercentage = Math.round((kpisCompletedCount / totalKpisCount) * 100);

  const toggleKpi = (id: string) => {
    setKpiChecklist((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextState = !k.completed;
          toast.info(
            nextState
              ? `Completed: ${k.label} (+${k.points} points!)`
              : `Marked incomplete: ${k.label}`
          );
          return { ...k, completed: nextState };
        }
        return k;
      })
    );
  };

  // --- 3. Profile Completion Tab State ---
  const [profileData, setProfileData] = useState({
    bio: "Passionate Nigerian citizen contributing to local growth and welfare governance.",
    bankName: "Access Bank Plc",
    accountNumber: "0725896324",
    ninVerified: true,
    bvnNumber: "22285963214",
    educationalLevel: "Bachelor's Degree",
    occupation: "Self-employed Artisan",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success("Supplementary profile details saved successfully!");
    }, 1200);
  };

  // --- 4. Metrics Tab State ---
  const [metricsFeedback, setMetricsFeedback] = useState({
    securityRating: "3",
    powerRating: "2",
    roadRating: "3",
    healthcareRating: "4",
    satisfactionText: "",
  });
  const [isSubmittingMetrics, setIsSubmittingMetrics] = useState(false);

  const handleSubmitMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMetrics(true);
    setTimeout(() => {
      setIsSubmittingMetrics(false);
      toast.success("Civic governance metrics survey submitted! Thank you for participating.");
      setMetricsFeedback({
        securityRating: "3",
        powerRating: "2",
        roadRating: "3",
        healthcareRating: "4",
        satisfactionText: "",
      });
      // Toggle Town Hall KPI automatically
      setKpiChecklist((prev) =>
        prev.map((k) => (k.id === "kpi5" ? { ...k, completed: true } : k))
      );
    }, 1000);
  };

  // --- 5. Complaint Tab State ---
  const [complaints, setComplaints] = useState([
    {
      id: "comp1",
      title: "Delayed waste clearance on Herbert Macaulay Way",
      category: "Sanitation & Environment",
      description: "Waste bins are overflowing, causing health hazards for shop owners and pedestrians.",
      status: "Resolved",
      date: "2 days ago",
    },
    {
      id: "comp2",
      title: "Frequent grid failure at local transformer",
      category: "Power Infrastructure",
      description: "Local distribution transformer sparks weekly, causing sudden outages in Zone 3.",
      status: "In Review",
      date: "5 days ago",
    },
  ]);
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
      toast.success("Complaint registered! Officer Aisha will review and respond shortly.");
    }, 1000);
  };

  // --- 6. Floating Action Button (FAB) Field Officer Chat ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "officer",
      text: `Hello ${citizenName.split(" ")[0]}, I am Officer Aisha Bello, your assigned Field Officer for the ${cohortName}. How can I assist you with your benefits, applications, or complaints today?`,
      time: "10:15 AM",
    },
  ]);
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

    // 1. Add user message
    setChatMessages((prev) => [...prev, { sender: "citizen", text: userText, time: timeStr }]);
    setChatInput("");

    // 2. Trigger simulated typing response after delay
    setOfficerTyping(true);
    setTimeout(() => {
      setOfficerTyping(false);
      let replyText = `I have received your message. I am currently cross-referencing your profile credentials (${citizenCode}) with our federal dashboard. Is there anything else I can add to your review notes?`;

      // Custom keywords replies
      const textLower = userText.toLowerCase();
      if (textLower.includes("grant") || textLower.includes("capital") || textLower.includes("loan") || textLower.includes("money")) {
        replyText = `Regarding your Business Capital Grant application: I see you are registered under ${cohortName}. I've noted down your inquiry. Please ensure your CAC registration number and Bank Details are completed in the 'Profile' section. I will expedite the vetting this afternoon!`;
      } else if (textLower.includes("scholarship") || textLower.includes("tuition") || textLower.includes("study")) {
        replyText = `For the Scholarship programs, please upload your CGPA transcripts or WAEC/NECO certificates in the 'Complete Profile' tab. I'm verifying local university admission letters today. I'll make sure your slot remains secured.`;
      } else if (textLower.includes("complaint") || textLower.includes("waste") || textLower.includes("power")) {
        replyText = `I see your complaint. The municipal team in Abuja is currently dispatched for primary inspections. I've tagged your citizen code to escalate this ticket to high-priority.`;
      } else if (textLower.includes("pvc") || textLower.includes("nin") || textLower.includes("kpi")) {
        replyText = `Good job tracking your civic KPIs! Completing these actions directly improves your citizen engagement tier, making you eligible for priority disbursements. Keep checking them off!`;
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

  // --- Sidebar Items Definition ---
  const sidebarItems = [
    { id: "opportunities", label: "View Opportunities", icon: Award },
    { id: "profile", label: "Complete Profile", icon: User },
    { id: "kpis", label: "Complete KPIs", icon: CheckCircle2, badge: `${kpisCompletedCount}/${totalKpisCount}` },
    { id: "metrics", label: "Metrics Activities", icon: Activity },
    { id: "complaints", label: "Lodge Complaint", icon: FileText, badge: complaints.length },
  ];

  return (
    <div className="min-h-screen bg-stone-50/60 flex relative font-sans">
      {/* Hidden input for picture uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* --- SIDEBAR - Desktop --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-white border-r border-stone-200/80 p-6 z-25 overflow-y-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-[#FFD100] shadow-sm">
            <span className="font-bold font-serif text-base text-yellow-400">CE</span>
          </div>
          <span className="text-lg font-serif font-bold text-stone-900 tracking-tight">
            CitiEye Governance
          </span>
        </div>

        {/* Profile Card in Sidebar */}
        <div className="flex flex-col items-center text-center p-4 bg-stone-50 border border-stone-200/60 rounded-3xl mb-6 relative group">
          <div className="relative mb-3">
            <div className="w-18 h-18 rounded-full bg-green-800 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md overflow-hidden border-2 border-white">
              {avatarImage ? (
                <img src={avatarImage} alt={citizenName} className="w-full h-full object-cover" />
              ) : (
                avatarInitials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-green-700 hover:bg-green-800 text-white rounded-full p-1.5 shadow-sm border border-white cursor-pointer transition-transform group-hover:scale-110"
              title="Upload profile picture"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>
          <h4 className="text-sm font-semibold text-stone-900 leading-tight mb-1">{citizenName}</h4>
          <p className="text-[10px] text-stone-400 font-mono tracking-wider mb-2">{citizenEmail}</p>
          <div className="px-3 py-1 bg-green-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
            {cohortName}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer ${isActive
                    ? "bg-green-700 text-white shadow-sm shadow-green-750/10"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-400 group-hover:text-green-700"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* App Download Promo */}
        <div className="mt-auto pt-6 border-t border-stone-100 space-y-4">
          <div className="p-3.5 bg-gradient-to-br from-green-50 to-stone-50 border border-green-200/80 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-700 opacity-5 rounded-full translate-x-4 -translate-y-4"></div>
            <div className="flex gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg text-green-700 shrink-0 self-start">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-green-900 uppercase tracking-wide">Download Mobile App</h5>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">
                  Access notifications, scanning, and offline logs instantly.
                </p>
                <a
                  href="#download-app"
                  onClick={() => toast.info("CitiEye Mobile app binary download started (Mock).")}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 hover:text-green-800 mt-2 transition-colors"
                >
                  Download (.apk) →
                </a>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-stone-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-2xl font-semibold text-xs text-stone-600 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Workspace
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR - Mobile Slider --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white p-6 z-50 overflow-y-auto flex flex-col lg:hidden border-r border-stone-200"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-yellow-500">
                    <span className="font-bold font-serif text-base text-yellow-400">CE</span>
                  </div>
                  <span className="text-lg font-serif font-bold text-stone-900">
                    CitiEye Governance
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex flex-col items-center text-center p-4 bg-stone-50 border border-stone-200/60 rounded-3xl mb-6">
                <div className="w-16 h-16 rounded-full bg-green-800 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md mb-2 overflow-hidden border border-white">
                  {avatarImage ? (
                    <img src={avatarImage} alt={citizenName} className="w-full h-full object-cover" />
                  ) : (
                    avatarInitials
                  )}
                </div>
                <h4 className="text-sm font-semibold text-stone-900 mb-0.5">{citizenName}</h4>
                <p className="text-[10px] text-stone-400 font-mono mb-2">{citizenEmail}</p>
                <div className="px-3 py-1 bg-green-700 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  {cohortName}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${isActive ? "bg-green-700 text-white shadow-sm" : "text-stone-600 hover:bg-stone-50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-650"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Footer Actions */}
              <div className="mt-auto pt-6 border-t border-stone-100 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toast.info("Artisan mobile app download scheduled.");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-2xl cursor-pointer"
                >
                  <Download className="w-4 h-4 text-green-700" />
                  Download Mobile App
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-150 hover:bg-red-50 hover:text-red-650 rounded-2xl font-semibold text-xs text-stone-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out Workspace
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT WINDOW --- */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* --- HEADER --- */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-4 flex items-center justify-between z-20 shadow-sm shadow-stone-100/30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-stone-100 border border-stone-200 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5 text-stone-700" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Citizen Workspace</span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-stone-900 capitalize">
                {activeTab === "opportunities" ? "Programs & Support Opportunities" : activeTab.replace("-", " ")}
              </h1>
            </div>
          </div>

          {/* Citizen Code / Reference Card */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3 md:px-4 py-2 rounded-2xl shadow-inner max-w-xs md:max-w-md">
            <div className="hidden md:block">
              <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400 block leading-none">Citizen Ref</span>
              <code className="text-xs font-mono font-bold text-stone-700 tracking-wide">{citizenCode}</code>
            </div>
            <div className="md:hidden">
              <code className="text-[11px] font-mono font-bold text-stone-700">{citizenCode.slice(0, 11)}..</code>
            </div>
            <button
              onClick={copyCitizenCode}
              className="p-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="Copy Citizen Code"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* --- DYNAMIC BODY CONTAINER --- */}
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
              {/* --- TAB 1: VIEW OPPORTUNITIES (Default View) --- */}
              {activeTab === "opportunities" && (
                <div className="space-y-6">
                  {/* --- METRICS CARDS GRID --- */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* KPI Card */}
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm shadow-stone-100/50 relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-700"></div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">KPIs Completed</span>
                        <div className="p-2 bg-green-50 rounded-xl text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif font-bold text-stone-900">{kpisCompletedCount}</span>
                        <span className="text-stone-400 text-sm">/ {totalKpisCount}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-green-700 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${kpiPercentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-stone-400">
                          <span>CIVIC SCORE</span>
                          <span className="text-green-700">{kpiPercentage}% DONE</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Cohort Metric Card */}
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm shadow-stone-100/50 relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-500"></div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Cohort Metrics</span>
                        <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                          <Activity className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif font-bold text-stone-900">
                          {METRICS[desiredSupportCode as keyof typeof METRICS]?.cohortActive || "85%"}
                        </span>
                        <span className="text-stone-400 text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          +4.2% Active
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-4 leading-normal">
                        Percentage of your cohort members currently completing weekly activities.
                      </p>
                    </motion.div>

                    {/* Opportunities Available Card */}
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm shadow-stone-100/50 relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#030213]"></div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Targeted Programs</span>
                        <div className="p-2 bg-stone-100 rounded-xl text-stone-700">
                          <Briefcase className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif font-bold text-stone-900">
                          {matchingOpportunities.length} Available
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-4 leading-normal">
                        Program offers tailored specifically to your chosen track:{" "}
                        <strong className="text-stone-700">{SUPPORT_OPTIONS[desiredSupportCode as keyof typeof SUPPORT_OPTIONS] || "General"}</strong>.
                      </p>
                    </motion.div>
                  </div>

                  {/* Opportunities Header Info */}
                  <div className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-3xl p-6 shadow-md shadow-green-800/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-300">Welfare Track Recommendation</span>
                      <h3 className="text-xl font-serif font-bold leading-tight">
                        Programs for {SUPPORT_OPTIONS[desiredSupportCode as keyof typeof SUPPORT_OPTIONS] || "General Welfare"}
                      </h3>
                      <p className="text-xs text-green-100 max-w-xl leading-relaxed">
                        Based on your citizen profile details, state of residence, and registry evaluation, you have been prioritized for these federal benefits. Expand below to apply.
                      </p>
                    </div>
                    <div className="shrink-0 z-10 px-4 py-2 border border-white/20 bg-white/10 rounded-2xl text-xs font-semibold text-white">
                      Cohort: {cohortName}
                    </div>
                    {/* Decorative Pattern Background */}
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 w-48 h-48 border-[12px] border-white rounded-full"></div>
                  </div>

                  {/* --- OPPORTUNITIES ACCORDION LIST --- */}
                  <div className="space-y-4">
                    {matchingOpportunities.map((op) => {
                      const isExpanded = expandedOpportunityId === op.id;
                      const isApplied = appliedOpportunities[op.id];
                      return (
                        <div
                          key={op.id}
                          className={`bg-white border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? "border-green-600/60 ring-1 ring-green-600/10" : "border-stone-200/80"
                            }`}
                        >
                          {/* Summary Row */}
                          <div
                            onClick={() => setExpandedOpportunityId(isExpanded ? null : op.id)}
                            className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                  {op.type}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1 ${isApplied
                                      ? "bg-green-100 text-green-750"
                                      : op.status === "Open"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-stone-200 text-stone-500"
                                    }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isApplied || op.status === "Open" ? "bg-green-500" : "bg-stone-400"}`}></span>
                                  {isApplied ? "Submitted" : op.status}
                                </span>
                              </div>
                              <h4 className="text-sm md:text-base font-semibold text-stone-900 truncate">
                                {op.title}
                              </h4>
                              <p className="text-xs text-stone-500 leading-normal line-clamp-1">
                                {op.brief}
                              </p>
                            </div>
                            <div className="shrink-0 p-2 bg-stone-50 rounded-xl border border-stone-150 text-stone-400 hover:text-stone-800 transition-colors">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Expandable Details Container */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="border-t border-stone-100 bg-stone-50/40"
                              >
                                <div className="p-5 md:p-6 space-y-5 text-xs md:text-sm">
                                  {/* Full Description */}
                                  <div className="space-y-1.5">
                                    <h5 className="font-bold text-stone-850">Program Overview</h5>
                                    <p className="text-stone-600 leading-relaxed">{op.full}</p>
                                  </div>

                                  {/* Documentation Required */}
                                  <div className="bg-white border border-stone-200/80 p-4 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-stone-800 font-bold">
                                      <FileText className="w-4 h-4 text-green-700" />
                                      <span>Required Documents for Registry Validation</span>
                                    </div>
                                    <p className="text-xs text-stone-500 leading-relaxed font-mono pl-6">
                                      {op.docs}
                                    </p>
                                  </div>

                                  {/* Officer Notes */}
                                  <div className="bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-2xl space-y-1">
                                    <div className="flex items-center gap-2 text-yellow-800 font-bold">
                                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                                      <span>Notes from Field Officer Aisha Bello</span>
                                    </div>
                                    <p className="text-xs text-yellow-750 leading-relaxed pl-6">
                                      "{op.officerNotes}"
                                    </p>
                                  </div>

                                  {/* Action Bar */}
                                  <div className="flex justify-end pt-2">
                                    <button
                                      disabled={isApplied || op.status === "Upcoming"}
                                      onClick={() => handleApply(op.id, op.title)}
                                      className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${isApplied
                                          ? "bg-stone-100 text-stone-400 border border-stone-200 shadow-none"
                                          : op.status === "Upcoming"
                                            ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                                            : "bg-green-700 hover:bg-green-800 text-white shadow-green-750/10 active:scale-[0.98]"
                                        }`}
                                    >
                                      {isApplied && <Check className="w-4 h-4 text-green-600" />}
                                      {isApplied ? "Applied Successfully" : op.actionLabel}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- TAB 2: COMPLETE PROFILE --- */}
              {activeTab === "profile" && (
                <div className="max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="text-base font-bold text-stone-900">Supplementary Citizen Profile Registry</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Provide verified bank details and supplementary documentation to clear security clearance for grant disbursements.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Profile Picture (Direct Trigger) */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 bg-stone-50 p-4 border border-stone-200 rounded-2xl">
                      <div className="w-20 h-20 rounded-full bg-green-800 text-white flex items-center justify-center font-serif text-2xl font-bold overflow-hidden shadow-sm relative">
                        {avatarImage ? (
                          <img src={avatarImage} alt={citizenName} className="w-full h-full object-cover" />
                        ) : (
                          avatarInitials
                        )}
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Avatar Photo Upload</h4>
                        <p className="text-[11px] text-stone-400 leading-normal">
                          JPEG or PNG format. Ensure clear lighting for biometrics assessment.
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          Choose Profile Picture
                        </button>
                      </div>
                    </div>

                    {/* Bio Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 block">Citizen Bio Statement</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl p-4 text-xs font-sans text-stone-800 outline-none resize-none"
                        placeholder="Tell us about yourself and goals..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Verified NIN */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 block">NIMC Identity Verification</label>
                        <div className="flex items-center gap-2.5 px-4 py-3.5 bg-green-50/50 border border-green-200 text-green-800 rounded-2xl">
                          <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                          <div className="text-left">
                            <span className="text-[10px] font-bold block">NIN STAMP APPROVED</span>
                            <span className="text-xs font-semibold opacity-80">Connected with NIMC database</span>
                          </div>
                        </div>
                      </div>

                      {/* Occupation */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 block">Educational / Trade Level</label>
                        <select
                          value={profileData.educationalLevel}
                          onChange={(e) => setProfileData({ ...profileData, educationalLevel: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl px-4 py-3 text-xs text-stone-800 outline-none cursor-pointer"
                        >
                          <option value="Primary Education">Primary School Leaving Certificate</option>
                          <option value="Secondary Education">WAEC / NECO Secondary Certificate</option>
                          <option value="Vocational / Trade License">Vocational / Trade Test License</option>
                          <option value="Diploma / NCE">Diploma / NCE</option>
                          <option value="Bachelor's Degree">Bachelor's Degree / HND</option>
                          <option value="Post-Graduate Degree">Master's or Ph.D</option>
                        </select>
                      </div>
                    </div>

                    {/* Bank Disbursement Linking */}
                    <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-stone-150 pb-2">
                        <Building className="w-4 h-4 text-green-700" />
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Direct Benefit Deposit Accounts</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-stone-500">Beneficiary Bank Name</label>
                          <input
                            type="text"
                            value={profileData.bankName}
                            onChange={(e) => setProfileData({ ...profileData, bankName: e.target.value })}
                            className="w-full bg-white border border-stone-250 focus:border-green-600 rounded-xl px-3 py-2.5 text-xs text-stone-800 outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-stone-500">Bank Account Number (NUBAN)</label>
                          <input
                            type="text"
                            maxLength={10}
                            value={profileData.accountNumber}
                            onChange={(e) => setProfileData({ ...profileData, accountNumber: e.target.value })}
                            className="w-full bg-white border border-stone-250 focus:border-green-600 rounded-xl px-3 py-2.5 text-xs font-mono text-stone-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-stone-500">Bank Verification Number (BVN)</label>
                        <input
                          type="text"
                          maxLength={11}
                          value={profileData.bvnNumber}
                          onChange={(e) => setProfileData({ ...profileData, bvnNumber: e.target.value })}
                          className="w-full bg-white border border-stone-250 focus:border-green-600 rounded-xl px-3 py-2.5 text-xs font-mono text-stone-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        {isSavingProfile ? "Saving Credentials..." : "Save Registry Credentials"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* --- TAB 3: COMPLETE KPIS --- */}
              {activeTab === "kpis" && (
                <div className="max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Citizen Key Performance Indicators (KPIs)</h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Your civic engagement scores dictate your priority standing in federal funding waitlists.
                      </p>
                    </div>
                    <div className="px-4 py-2.5 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-green-700 block">Civic KPI Ratio</span>
                      <span className="text-base font-bold">{kpisCompletedCount} / {totalKpisCount} Tasks</span>
                    </div>
                  </div>

                  {/* Progress bar info */}
                  <div className="bg-stone-50 border border-stone-200/80 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>Registry Score Progress</span>
                      <span className="text-green-700">{kpiPercentage}% Completed</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-green-700 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${kpiPercentage}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      💡 <strong>Tip:</strong> Reach 70% or more to qualify for fast-track micro-enterprise seed disbursements.
                    </p>
                  </div>

                  {/* KPI Checklist */}
                  <div className="space-y-3.5">
                    {kpiChecklist.map((k) => (
                      <div
                        key={k.id}
                        onClick={() => toggleKpi(k.id)}
                        className={`flex items-start gap-4 p-4 border rounded-2xl transition-all cursor-pointer select-none ${k.completed
                            ? "bg-green-50/20 border-green-200 text-stone-800"
                            : "bg-white border-stone-200 hover:bg-stone-50/30 text-stone-600"
                          }`}
                      >
                        <div
                          className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${k.completed ? "bg-green-600 border-green-600 text-white" : "border-stone-300 bg-white"
                            }`}
                        >
                          {k.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-xs md:text-sm font-semibold block leading-tight">{k.label}</span>
                          <span className="text-[10px] font-bold text-stone-400 mt-1 inline-block">
                            CIVIC VALUE: +{k.points} POINTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TAB 4: METRICS ACTIVITIES --- */}
              {activeTab === "metrics" && (
                <div className="max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="text-base font-bold text-stone-900">Community Governance Surveys</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Report on the status of public infrastructure in your local government area (LGA) to assist planning.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitMetrics} className="space-y-5">
                    {/* 1. Security */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 block">
                        How would you rate the neighborhood security presence in your LGA?
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {["1", "2", "3", "4", "5"].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setMetricsFeedback({ ...metricsFeedback, securityRating: num })}
                            className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${metricsFeedback.securityRating === num
                                ? "bg-green-700 text-white border-green-700"
                                : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                              }`}
                          >
                            {num === "1" ? "Poor (1)" : num === "5" ? "Excellent (5)" : num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Power */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 block">
                        Average grid power supply availability per day:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: "1", label: "< 4 Hrs" },
                          { val: "2", label: "4 - 8 Hrs" },
                          { val: "3", label: "8 - 16 Hrs" },
                          { val: "4", label: "16+ Hrs" },
                        ].map((opt) => (
                          <button
                            type="button"
                            key={opt.val}
                            onClick={() => setMetricsFeedback({ ...metricsFeedback, powerRating: opt.val })}
                            className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${metricsFeedback.powerRating === opt.val
                                ? "bg-green-700 text-white border-green-700"
                                : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Roads */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 block">
                        Status of road networks and drainage in your immediate community:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: "1", label: "Deplorable" },
                          { val: "2", label: "Manageable" },
                          { val: "3", label: "Excellent" },
                        ].map((opt) => (
                          <button
                            type="button"
                            key={opt.val}
                            onClick={() => setMetricsFeedback({ ...metricsFeedback, roadRating: opt.val })}
                            className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${metricsFeedback.roadRating === opt.val
                                ? "bg-green-700 text-white border-green-700"
                                : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text comment */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 block">
                        What is the single most urgent infrastructure issue that needs attention in your LGA?
                      </label>
                      <textarea
                        value={metricsFeedback.satisfactionText}
                        onChange={(e) => setMetricsFeedback({ ...metricsFeedback, satisfactionText: e.target.value })}
                        rows={4}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl p-4 text-xs text-stone-850 outline-none resize-none"
                        placeholder="Please specify roads, health clinics, schools, public safety, or local market centers..."
                      />
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={isSubmittingMetrics}
                        className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        {isSubmittingMetrics ? "Submitting feedback..." : "Submit Local Metrics Questionnaire"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* --- TAB 5: LODGE COMPLAINTS --- */}
              {activeTab === "complaints" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Form panel */}
                  <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="border-b border-stone-100 pb-4">
                      <h3 className="text-base font-bold text-stone-900">Lodge Civic Redress Ticket</h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Report community grievances, public corruption, or infrastructural failures. Checked by local officer.
                      </p>
                    </div>

                    <form onSubmit={handleLodgeComplaint} className="space-y-4">
                      {/* Category */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 block">Grievance Category</label>
                        <select
                          value={newComplaint.category}
                          onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 rounded-2xl px-4 py-3 text-xs text-stone-800 outline-none cursor-pointer"
                        >
                          <option value="Infrastructure">Infrastructure (Roads, Water, Bridges)</option>
                          <option value="Power Infrastructure">Power Infrastructure (Transformers, Grid)</option>
                          <option value="Sanitation & Environment">Sanitation & Waste Management</option>
                          <option value="Security / Policing">Public Security & Neighborhood Policing</option>
                          <option value="Welfare Disbursements">Welfare & Grant Disbursements Issues</option>
                          <option value="Official Misconduct">Official Misconduct & Corruption Reporting</option>
                        </select>
                      </div>

                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 block">Subject Summary</label>
                        <input
                          type="text"
                          value={newComplaint.title}
                          onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 rounded-2xl px-4 py-3 text-xs text-stone-800 outline-none"
                          placeholder="e.g. Defective transformer on Ahmadu Bello road"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 block">Detailed Statement of Grievance</label>
                        <textarea
                          value={newComplaint.description}
                          onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                          rows={5}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl p-4 text-xs text-stone-850 outline-none resize-none"
                          placeholder="Please state dates, precise locations, safety impact, and details to speed up dispatch..."
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingComplaint}
                          className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          {isSubmittingComplaint ? "Registering ticket..." : "File Complaint Ticket"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* History panel */}
                  <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Your Tickets History</h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Track the live updates of your filed reports.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {complaints.map((c) => (
                        <div key={c.id} className="p-4 bg-stone-50/50 border border-stone-200 rounded-2xl space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-2 py-0.5 bg-stone-200/60 text-stone-600 text-[9px] font-bold rounded uppercase tracking-wide">
                              {c.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wide flex items-center gap-1 ${c.status === "Resolved"
                                  ? "bg-green-100 text-green-700"
                                  : c.status === "In Review"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Resolved" ? "bg-green-500" : c.status === "In Review" ? "bg-yellow-500" : "bg-amber-500"}`}></span>
                              {c.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-850">{c.title}</h4>
                          <p className="text-[11px] text-stone-500 leading-relaxed">{c.description}</p>
                          <div className="flex justify-between items-center text-[10px] text-stone-400 pt-2 border-t border-stone-150">
                            <span>LODGED: {c.date}</span>
                            <span>OFFICER IN CHARGE: AISHA B.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* --- FLOATING ACTION BUTTON (FAB) & CHAT DOCK --- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Chat window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-[90vw] sm:w-[380px] h-[450px] bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-300/40 mb-4 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Photo or Initials */}
                  <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center border-2 border-white/30 text-xs">
                    AB
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold leading-tight">Officer Aisha Bello</h4>
                    <span className="text-[9px] font-bold text-green-300 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                      Assigned Field Officer
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[80%] ${msg.sender === "citizen" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${msg.sender === "citizen"
                          ? "bg-green-700 text-white rounded-tr-none"
                          : "bg-white border border-stone-200 text-stone-850 rounded-tl-none"
                        }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 font-mono">{msg.time}</span>
                  </div>
                ))}

                {/* Typing indicator */}
                {officerTyping && (
                  <div className="flex flex-col items-start mr-auto max-w-[80%]">
                    <div className="p-3 bg-white border border-stone-200 text-stone-500 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="border-t border-stone-150 p-3 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Officer Aisha..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-850 outline-none focus:border-green-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 bg-green-700 text-white rounded-xl shadow hover:bg-green-800 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB Button Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className={`flex items-center justify-center gap-2 p-4 rounded-full text-white cursor-pointer shadow-lg transition-colors border-2 border-white ${chatOpen ? "bg-[#030213] hover:bg-black" : "bg-green-700 hover:bg-green-800"
            }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden font-bold text-xs tracking-wide uppercase group-hover:max-w-xs transition-all whitespace-nowrap hidden sm:inline">
            Talk to Officer
          </span>
        </motion.button>
      </div>
    </div>
  );
}

// Small missing helper for plus icon inside avatar upload
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
