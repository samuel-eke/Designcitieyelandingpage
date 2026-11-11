"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/components/auth/authStore";
import {
  useCitizenDetail,
  useHealthRecords,
  useEducationRecords,
  useDeleteHealthRecord,
  useDeleteEducationRecord,
  useUpdateHealthRecord,
  useUpdateEducationRecord,
  HealthRecord,
  EducationRecord,
} from "@/lib/hooks/useAnalytics";
import { useAdminCitizenLifecycle } from "@/lib/hooks/useAdminCitizenLifecycle";
import { apiClient } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Activity,
  Briefcase,
  Loader2,
  Calendar,
  Layers,
  MapPin,
  ClipboardList,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  ShieldAlert,
  Info,
  HeartPulse,
  Building2,
} from "lucide-react";
import { AcademicProgressionTimeline } from "@/components/dashboard/education/AcademicProgressionTimeline";
import { VocationalPortalCard } from "@/components/dashboard/vocational/VocationalPortalCard";

interface CitizenDetailSheetProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CitizenDetailSheet({
  citizenCode,
  isOpen,
  onClose,
}: CitizenDetailSheetProps) {
  const queryClient = useQueryClient();
  const {
    data: lifecycleData,
    isLoading: isLifecycleLoading,
    error: lifecycleError,
  } = useAdminCitizenLifecycle(citizenCode);
  const { data: analyticsProfile, isLoading: isAnalyticsLoading } = useCitizenDetail(citizenCode);

  const isLoading = isLifecycleLoading && !lifecycleData && !analyticsProfile;
  const error = lifecycleError;

  // Merge backend lifecycle endpoint data with legacy analytics attributes
  const profile = React.useMemo(() => {
    if (!lifecycleData && !analyticsProfile) return null;
    return {
      ...analyticsProfile,
      ...lifecycleData,
      fullName:
        lifecycleData?.fullName ||
        `${lifecycleData?.firstName || analyticsProfile?.firstName || ""} ${lifecycleData?.lastName || analyticsProfile?.lastName || ""}`.trim(),
    };
  }, [lifecycleData, analyticsProfile]);

  const [showEmpty, setShowEmpty] = useState(false);

  // Authentication & Permissions State
  const { user } = useAuthStore();
  const userRole = (user?.role || user?.data?.role || "").toLowerCase();
  const userPermissions = user?.permissions || user?.data?.permissions || [];

  const canEditProfile = userRole === "super_admin" || userPermissions.includes("EDIT_CITIZEN_PROFILE");

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (profile) {
      setProfileForm({ ...profile });
    }
  }, [profile, isEditingProfile]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setProfileForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleStartEditProfile = () => {
    if (profile) {
      setProfileForm({ ...profile });
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Send progressive update override query param if superadmin
      await apiClient.post(
        `/api/profile/progressive-update?citizenCode=${citizenCode}`,
        profileForm
      );
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["analytics", "citizens", "detail", citizenCode] });
      queryClient.invalidateQueries({ queryKey: ["admin", "citizens", "lifecycle", citizenCode] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Health and Education record fetching
  const { data: healthRecords, isLoading: isHealthLoading } = useHealthRecords(citizenCode);
  const { data: educationRecords, isLoading: isEducationLoading } = useEducationRecords(citizenCode);

  const deleteHealthMut = useDeleteHealthRecord();
  const deleteEducationMut = useDeleteEducationRecord();
  const updateHealthMut = useUpdateHealthRecord();
  const updateEducationMut = useUpdateEducationRecord();

  // Inline edit state for records
  const [editingHealthId, setEditingHealthId] = useState<number | null>(null);
  const [healthForm, setHealthForm] = useState({ recordType: "", description: "", notes: "" });

  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);
  const [educationForm, setEducationForm] = useState({ recordType: "", institutionName: "", academicYear: "", classGrade: "", attendanceRate: "" });

  // Record Actions: Delete
  const handleDeleteHealth = async (id: number) => {
    if (confirm("Are you sure you want to delete this health record?")) {
      try {
        await deleteHealthMut.mutateAsync(id);
        toast.success("Health record deleted successfully!");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete health record.");
      }
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (confirm("Are you sure you want to delete this education record?")) {
      try {
        await deleteEducationMut.mutateAsync(id);
        toast.success("Education record deleted successfully!");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete education record.");
      }
    }
  };

  // Record Actions: Start Edit
  const handleStartEditHealth = (rec: HealthRecord) => {
    setEditingHealthId(rec.id);
    setHealthForm({
      recordType: rec.recordType,
      description: rec.description,
      notes: rec.notes || "",
    });
  };

  const handleStartEditEducation = (rec: EducationRecord) => {
    setEditingEducationId(rec.id);
    setEducationForm({
      recordType: rec.recordType,
      institutionName: rec.institutionName,
      academicYear: rec.academicYear,
      classGrade: rec.classGrade || "",
      attendanceRate: String(rec.attendanceRate || ""),
    });
  };

  // Record Actions: Save Edit
  const handleSaveHealthEdit = async () => {
    if (!editingHealthId) return;
    try {
      await updateHealthMut.mutateAsync({ id: editingHealthId, data: healthForm });
      toast.success("Health record updated successfully!");
      setEditingHealthId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update health record.");
    }
  };

  const handleSaveEducationEdit = async () => {
    if (!editingEducationId) return;
    try {
      await updateEducationMut.mutateAsync({
        id: editingEducationId,
        data: {
          ...educationForm,
          attendanceRate: educationForm.attendanceRate ? Number(educationForm.attendanceRate) : null,
        },
      });
      toast.success("Education record updated successfully!");
      setEditingEducationId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update education record.");
    }
  };

  // Helper component for displaying structured fields
  const DataField = ({ label, fieldName, value }: { label: string; fieldName?: string; value: any }) => {
    const isEmpty = value === null || value === undefined || value === "";
    if (isEmpty && !showEmpty && !isEditingProfile) return null;

    let displayValue = "";
    if (isEmpty) {
      displayValue = "Not Provided";
    } else if (typeof value === "boolean") {
      displayValue = value ? "Yes" : "No";
    } else {
      displayValue = String(value);
    }

    const isEditable = isEditingProfile && fieldName;

    return (
      <div className="flex flex-col gap-1 py-2 border-b border-slate-100 hover:bg-slate-50/60 transition-colors px-2 rounded-lg">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          {label}
        </span>
        {isEditable ? (
          typeof value === "boolean" ? (
            <select
              value={String(profileForm[fieldName!] ?? "")}
              onChange={(e) => handleFieldChange(fieldName!, e.target.value === "true")}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
              <option value="">Not Provided</option>
            </select>
          ) : (
            <input
              type="text"
              value={String(profileForm[fieldName!] ?? "")}
              onChange={(e) => handleFieldChange(fieldName!, e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
            />
          )
        ) : (
          <span
            className={`text-xs ${isEmpty ? "text-slate-400 italic font-mono" : "text-slate-700 font-semibold"
              }`}
          >
            {displayValue}
          </span>
        )}
      </div>
    );
  };

  // Section card wrapper
  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    // Count how many children (DataFields) will actually be rendered
    const childrenArray = React.Children.toArray(children);
    const visibleCount = childrenArray.filter((child: any) => {
      if (!child) return false;
      const value = child.props.value;
      const isEmpty = value === null || value === undefined || value === "";
      return !isEmpty || showEmpty || isEditingProfile;
    }).length;

    if (visibleCount === 0) return null;

    return (
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3 mb-4 shadow-xs">
        <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest border-b border-slate-200/40 pb-1">
          {title}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="bg-white border-l border-slate-200 text-slate-800 sm:max-w-2xl w-full sm:w-[640px] md:w-[720px] overflow-y-auto p-6 flex flex-col h-full outline-none"
        side="right"
      >
        <SheetHeader className="border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Citizen Profile Inspector
              </span>
            </div>
            {/* Edit / Save Actions */}
            {canEditProfile && profile && (
              <div className="flex items-center gap-2">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartEditProfile}
                    className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
          <SheetTitle className="text-xl font-serif font-bold text-slate-800 tracking-tight">
            {isLoading ? "Loading Profile..." : profile ? `${profile.firstName} ${profile.lastName}` : "Citizen Details"}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-400 font-mono">
            ID: {citizenCode || "N/A"}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Fetching ledger records...
            </span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
            <div className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-full">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-800">Data Fetch Failure</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                {error.message || "Failed to load the citizen profile from the server analytics module."}
              </p>
            </div>
          </div>
        ) : !profile ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            No profile record returned for this code.
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 mt-4 overflow-hidden">
            {/* Show Empty toggle */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl shrink-0">
              <span className="text-xs text-slate-700 font-semibold">Show unanswered profile fields</span>
              <button
                onClick={() => setShowEmpty(!showEmpty)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${showEmpty ? "bg-blue-600" : "bg-slate-200"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${showEmpty ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Critical Social Welfare Alert: Senior Care Home Placement */}
            {profile.interestedInAdultCareHome && (
              <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-900 shadow-xs animate-in fade-in">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Critical Social Welfare Action Required
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-rose-950">
                    Senior Adult Care Home Placement Requested
                  </h5>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    This senior citizen has formally requested placement in a government-assisted residential Adult Care Home.
                    {profile.pensionProviderName && (
                      <span className="block mt-1 font-mono text-[11px] text-rose-900 font-medium">
                        Pension Fund Administrator (PFA): <strong>{profile.pensionProviderName}</strong>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Age-18 Hard NIN Gate Enforced Banner */}
            {profile.isNinRequired && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 shadow-xs animate-in fade-in">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Age-18 Hard NIN Enforcement Gate
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {profile.transitionMessage ||
                      "Adult Action Required: Citizen is 18 or older and has not registered an individual 11-digit Adult NIN. Adult records are strictly locked."}
                  </p>
                </div>
              </div>
            )}

            {/* Age 16-17 Grace Period Banner */}
            {profile.isInGracePeriod && (
              <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-start gap-3 text-blue-900 shadow-xs animate-in fade-in">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Age-16 Milestone Transition (Grace Period)
                  </span>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    {profile.transitionMessage ||
                      "Citizen has reached transition age (in 2-year grace period until age 18 to register adult identity)."}
                  </p>
                </div>
              </div>
            )}

            {/* Profile Content Tabs */}
            <Tabs defaultValue="identity" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="bg-slate-50 border border-slate-200/60 p-[3px] rounded-xl w-full flex justify-between gap-1 shrink-0 h-auto">
                <TabsTrigger
                  value="identity"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-400 text-xs font-semibold py-2 px-3 flex-1 flex items-center justify-center gap-1.5 rounded-lg border-0 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Identity</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-400 text-xs font-semibold py-2 px-3 flex-1 flex items-center justify-center gap-1.5 rounded-lg border-0 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger
                  value="work"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-400 text-xs font-semibold py-2 px-3 flex-1 flex items-center justify-center gap-1.5 rounded-lg border-0 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Economy</span>
                </TabsTrigger>
                <TabsTrigger
                  value="health"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-400 text-xs font-semibold py-2 px-3 flex-1 flex items-center justify-center gap-1.5 rounded-lg border-0 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Welfare</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4 pr-1">
                {/* 1. IDENTITY & PERSONAL INFO */}
                <TabsContent value="identity" className="space-y-4 outline-none">
                  <SectionCard title="Primary Identity">
                    <DataField label="Citizen Code" value={profile.citizenCode} />
                    <DataField label="National Identity No (NIN)" value={profile.nin || "Not Registered"} />
                    {profile.parentNin && (
                      <DataField label="Parent / Guardian NIN" value={profile.parentNin} />
                    )}
                    <DataField label="First Name" fieldName="firstName" value={profile.firstName} />
                    <DataField label="Middle Name" fieldName="middleName" value={profile.middleName} />
                    <DataField label="Last Name" fieldName="lastName" value={profile.lastName} />
                    <DataField label="Phone Number" fieldName="phoneNumber" value={profile.phoneNumber} />
                    <DataField label="Email Address" fieldName="email" value={profile.email} />
                    <DataField label="Gender" fieldName="gender" value={profile.gender} />
                    <DataField label="Date of Birth" fieldName="dateOfBirth" value={profile.dateOfBirth} />
                    <DataField label="Age" value={profile.age} />
                    {profile.dependentsCount !== undefined && profile.dependentsCount > 0 && (
                      <DataField label="Linked Minor Dependents" value={profile.dependentsCount} />
                    )}
                  </SectionCard>

                  <SectionCard title="Cohort Placement & Lifecycle">
                    <DataField label="Current Cohort" value={profile.cohortName} />
                    <DataField label="Milestone Lifecycle Status" value={profile.transitionMessage || (profile.isAdult ? "Adult Citizen" : "Minor Account")} />
                    <DataField label="Age At Registration" value={profile.ageAtRegistration} />
                    <DataField label="Cohort Transitioned At" value={profile.cohortLastTransitionedAt} />
                    <DataField label="Profile Created" value={profile.registeredAt} />
                    <DataField label="Last Profile Update" value={profile.profileLastUpdated} />
                  </SectionCard>

                  <SectionCard title="Demographics & Household">
                    <DataField label="State of Origin" fieldName="stateOfOrigin" value={profile.stateOfOrigin} />
                    <DataField label="LGA of Origin" fieldName="lga" value={profile.lga} />
                    <DataField label="State of Residence" fieldName="stateOfResidence" value={profile.stateOfResidence} />
                    <DataField label="LGA of Residence" fieldName="residenceLga" value={profile.residenceLga} />
                    <DataField label="Residential Address" fieldName="address" value={profile.address} />
                    <DataField label="Hometown" fieldName="hometown" value={profile.hometown} />
                    <DataField label="Household Size" fieldName="householdSize" value={profile.householdSize} />
                    <DataField label="Marital Status" fieldName="maritalStatus" value={profile.maritalStatus} />
                    {profile.gender?.toUpperCase() === "MALE" && profile.maritalStatus?.toUpperCase() === "MARRIED" && (
                      <DataField label="Number of Wives (Polygamous)" fieldName="numberOfWives" value={profile.numberOfWives ?? 1} />
                    )}
                    <DataField label="Has Children" value={profile.hasChildren} />
                    <DataField label="Number of Children" value={profile.numberOfChildren} />
                  </SectionCard>
                </TabsContent>

                {/* 2. EDUCATION LIFECYCLE */}
                <TabsContent value="education" className="space-y-4 outline-none">
                  <SectionCard title="General Education Status">
                    <DataField label="Current Educational Level" value={profile.currentEducationalLevel} />
                    <DataField label="Highest Academic Qualification" value={profile.highestEducationalQualification} />
                  </SectionCard>

                  <SectionCard title="Early Childhood Development (Ages 0 - 5)">
                    <DataField label="Birth Weight (kg)" value={profile.birthWeightKg} />
                    <DataField label="Delivery Assistant Type" value={profile.deliveryAssistantType} />
                    <DataField label="Exclusive Breastfeeding (months)" value={profile.exclusiveBreastfeedingMonths} />
                    <DataField label="Vaccination Status Completed" value={profile.vaccinationRecordCompleted} />
                    <DataField label="Missing Vaccines" value={profile.missingVaccines} />
                    <DataField label="Is Registered Birth" value={profile.isRegisteredBirth} />
                    <DataField label="Parent/Guardian NIN" value={profile.parentGuardianNin} />
                    <DataField label="Preschool Enrollment" value={profile.preschoolEnrollment} />
                  </SectionCard>

                  <SectionCard title="Foundational Education (Ages 6 - 11)">
                    <DataField label="Primary School Name" value={profile.schoolName} />
                    <DataField label="Current Class Grade" value={profile.currentClassGrade} />
                    <DataField label="Finished Primary 6" value={profile.finishedPrimary6} />
                    <DataField label="Has First School Leaving Cert" value={profile.hasFirstSchoolLeavingCert} />
                    <DataField label="FSLC Grade" value={profile.fslcGrade} />
                    <DataField label="School Meals Recipient" value={profile.schoolMealsRecipient} />
                    <DataField label="Literacy Score (%)" value={profile.literacyScorePercent} />
                    <DataField label="Numeracy Score (%)" value={profile.numeracyScorePercent} />
                    <DataField label="Average Attendance Rate (%)" value={profile.averageAttendanceRate} />
                    <DataField label="Vision & Hearing Check Passed" value={profile.visionHearingPass} />
                    <DataField label="Commute Distance (km)" value={profile.commuteDistanceKm} />
                  </SectionCard>

                  <SectionCard title="Secondary Education (Ages 12 - 18)">
                    <DataField label="Secondary Enrollment Status" value={profile.secEnrollmentStatus} />
                    <DataField label="Annual Grade Average (%)" value={profile.annualGradeAverage} />
                    <DataField label="Registered for WAEC" value={profile.registeredWaec} />
                    <DataField label="WAEC Grades Summary" value={profile.waecGrades} />
                    <DataField label="Registered for NECO" value={profile.registeredNeco} />
                    <DataField label="NECO Grades Summary" value={profile.necoGrades} />
                    <DataField label="Qualified for Exam Subsidy" value={profile.examSubsidyQualified} />
                    <DataField label="Preferred Career Track" value={profile.preferredCareerTrack} />
                    <DataField label="Digital Literacy Certificate" value={profile.digitalLiteracyCert} />
                    <DataField label="Menstrual Kit Requested" value={profile.menstrualKitRequested} />
                    <DataField label="Indigent Status (School Fees)" value={profile.schoolFeeIndigentStatus} />
                    <DataField label="Safeguarding Issue Reported" value={profile.safeguardingIssueReported} />
                  </SectionCard>

                  <SectionCard title="Higher Education (Ages 19 - 26)">
                    <DataField label="Tertiary Institution Name" value={profile.tertiaryInstitutionName || profile.universityAttended} />
                    <DataField label="Institution Classification" value={profile.tertiaryInstitutionType} />
                    <DataField label="Course of Study" value={profile.tertiaryCourseOfStudy || profile.courseOfStudy} />
                    <DataField label="Current Academic Level" value={profile.tertiaryCurrentLevel} />
                    <DataField label="Current Semester" value={profile.tertiaryCurrentSemester} />
                    <DataField label="Academic Session" value={profile.tertiaryAcademicSession} />
                    <DataField label="Institution Code" value={profile.tertiaryInstitutionCode} />
                    <DataField label="NELFUND Student Loan Recipient" value={profile.nelfundStudentLoan} />
                    <DataField label="Cumulative GPA (CGPA)" value={profile.cgpa} />
                    <DataField label="Expected Graduation Year" value={profile.expectedGraduationYear} />
                    <DataField label="NYSC Call-up Number" value={profile.nyscCallupNumber} />
                    <DataField label="NYSC Posting State" value={profile.nyscPostingState} />
                    <DataField label="NYSC PPA Address" value={profile.nyscPpaAddress} />
                    <DataField label="Vocational Licensing" value={profile.vocationalLicensing} />
                    <DataField label="Extracurricular Activities" value={profile.extracurricularActivities} />
                    <DataField label="Exploitation/Abuse Reported" value={profile.exploitationAbuseReported} />
                    <DataField label="University Attended" value={profile.universityAttended} />
                    <DataField label="Degree Attained" value={profile.degreeAttained} />
                    <DataField label="Year of Graduation" value={profile.yearOfGraduation} />
                  </SectionCard>

                  {/* Logged Education Records */}
                  <div className="mt-6 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-2">
                      Officer-Logged Education Visits
                    </h4>
                    {isEducationLoading ? (
                      <div className="text-center py-4 text-xs font-mono text-slate-400">Loading records...</div>
                    ) : educationRecords && educationRecords.length > 0 ? (
                      <div className="space-y-3">
                        {educationRecords.map((rec) => (
                          <div key={rec.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                            {editingEducationId === rec.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Record Type</label>
                                  <input
                                    type="text"
                                    value={educationForm.recordType}
                                    onChange={(e) => setEducationForm({ ...educationForm, recordType: e.target.value })}
                                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Institution Name</label>
                                  <input
                                    type="text"
                                    value={educationForm.institutionName}
                                    onChange={(e) => setEducationForm({ ...educationForm, institutionName: e.target.value })}
                                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Academic Year</label>
                                    <input
                                      type="text"
                                      value={educationForm.academicYear}
                                      onChange={(e) => setEducationForm({ ...educationForm, academicYear: e.target.value })}
                                      className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Class Grade</label>
                                    <input
                                      type="text"
                                      value={educationForm.classGrade}
                                      onChange={(e) => setEducationForm({ ...educationForm, classGrade: e.target.value })}
                                      className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Attendance Rate (%)</label>
                                    <input
                                      type="text"
                                      value={educationForm.attendanceRate}
                                      onChange={(e) => setEducationForm({ ...educationForm, attendanceRate: e.target.value })}
                                      className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <button
                                    onClick={handleSaveEducationEdit}
                                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingEducationId(null)}
                                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="inline-block text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">
                                      {rec.recordType}
                                    </span>
                                    <h5 className="text-xs font-bold text-slate-700 mt-2">{rec.institutionName}</h5>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5 text-[11px] text-slate-500">
                                      <div>Academic Year: <span className="font-semibold text-slate-600">{rec.academicYear}</span></div>
                                      {rec.classGrade && <div>Grade: <span className="font-semibold text-slate-600">{rec.classGrade}</span></div>}
                                      {rec.attendanceRate !== null && <div>Attendance: <span className="font-semibold text-slate-600">{rec.attendanceRate}%</span></div>}
                                    </div>
                                  </div>
                                  {(userRole === "super_admin" || userPermissions.includes("EDIT_EDUCATION_RECORD") || userPermissions.includes("DELETE_EDUCATION_RECORD")) && (
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {(userRole === "super_admin" || userPermissions.includes("EDIT_EDUCATION_RECORD")) && (
                                        <button
                                          onClick={() => handleStartEditEducation(rec)}
                                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                          title="Edit Record"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      {(userRole === "super_admin" || userPermissions.includes("DELETE_EDUCATION_RECORD")) && (
                                        <button
                                          onClick={() => handleDeleteEducation(rec.id)}
                                          className="p-1 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded transition-colors cursor-pointer"
                                          title="Delete Record"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                                  <span>By Officer: {rec.officerCode}</span>
                                  <span>•</span>
                                  <span>{new Date(rec.loggedAt).toLocaleDateString()}</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs italic text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                        No custom education records logged.
                      </div>
                    )}
                  </div>

                  {/* Annual Academic Progression & Status Transitions */}
                  {citizenCode && (
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest px-2">
                        Annual Academic Progression & Audit Transitions
                      </h4>
                      <AcademicProgressionTimeline
                        citizenCode={citizenCode}
                        isOfficerReview={false}
                      />
                    </div>
                  )}
                </TabsContent>

                {/* 3. ECONOMY & WORKFORCE */}
                <TabsContent value="work" className="space-y-4 outline-none">
                  <SectionCard title="Formal Enterprise & CAC Registration">
                    <DataField label="Has Business" value={profile.hasBusiness} />
                    <DataField label="Business Name" value={profile.businessName || profile.nameOfEmployerBusiness} />
                    <DataField label="Nature of Business" value={profile.businessNature || profile.natureOfBusinessJob} />
                    <DataField label="CAC Registered Enterprise" value={profile.isCacRegistered} />
                    <DataField label="CAC Registration No (RC / BN)" value={profile.cacRegistrationNumber || profile.businessRegistrationNumber} />
                  </SectionCard>

                  <SectionCard title="Vocational Apprenticeship & Technical Training">
                    <DataField label="Enrolled in Vocational Program" value={profile.isUndergoingVocationalTraining} />
                    <DataField label="Vocational Trade Kind" value={profile.tradeSkillKind} />
                    <DataField label="Training Center Name" value={profile.trainingCenterName} />
                    <DataField label="Training Center Location" value={profile.trainingCenterLocation} />
                    <DataField label="Training Duration (Months)" value={profile.trainingDurationMonths} />
                  </SectionCard>

                  <SectionCard title="Workforce Integration (Ages 27 - 32)">
                    <DataField label="Current Employment Status" value={profile.currentEmploymentStatus} />
                    <DataField label="Detailed Employment Status" value={profile.employmentStatus} />
                    <DataField label="Employer Name" value={profile.employerName || profile.nameOfEmployerBusiness} />
                    <DataField label="Employer Address" value={profile.employerAddress || profile.placeOfEmploymentBusiness} />
                    <DataField label="Nature of Employment" value={profile.natureOfEmployment || profile.natureOfBusinessJob} />
                    <DataField label="Monthly Income Range" value={profile.monthlyIncomeRange} />
                    <DataField label="Industry Sector" value={profile.industrySector} />
                    <DataField label="Tax Identification No (TIN)" value={profile.tinNumber} />
                    <DataField label="Bank Verification No (BVN)" value={profile.bvnNumber} />
                    <DataField label="NYSC Discharge Certificate" value={profile.nyscDischargeCert} />
                  </SectionCard>

                  <SectionCard title="Career Growth & Mid-Life (Ages 33 - 44)">
                    <DataField label="Marital Status" value={profile.maritalStatus} />
                    <DataField label="Dependent Children Count" value={profile.dependentChildrenCount} />
                    <DataField label="Housing Tenure Status" value={profile.housingTenureStatus} />
                    <DataField label="NHF Contributor" value={profile.nhfContributor} />
                    <DataField label="CPS Pension PIN" value={profile.cpsPensionPin} />
                    <DataField label="Farming Land Ownership" value={profile.farmingLandOwnership} />
                    <DataField label="Cooperative Membership" value={profile.cooperativeMembership} />
                    <DataField label="Reskilling Interest" value={profile.reskillingInterest} />
                    <DataField label="Physical Obsolescence Risk" value={profile.physicalObsolescenceRisk} />
                    <DataField label="Family Education Burden ($)" value={profile.familyEducationBurden} />
                    <DataField label="Needs Business Expansion Capital" value={profile.businessExpansionCapital} />
                    <DataField label="Primary Income Source" value={profile.primaryIncomeSource} />
                    <DataField label="Digital Upskilling Courses Count" value={profile.digitalUpskillingCount} />
                    <DataField label="Interest in Political Office" value={profile.interestInPoliticalOffice} />
                  </SectionCard>

                  <SectionCard title="Pre-Retirement & Aging (Ages 49 - 60)">
                    <DataField label="Retired Status" value={profile.isRetired} />
                    <DataField label="Pension Administrator (PFA)" value={profile.pensionProviderName} />
                    <DataField label="Adult Care Home Placement Requested" value={profile.interestedInAdultCareHome ? "YES — REQUESTED" : "No"} />
                    <DataField label="Expected Retirement Age" value={profile.expectedRetirementAge} />
                    <DataField label="Years of Service" value={profile.yearsOfService} />
                    <DataField label="Retirement Livelihood Plan" value={profile.retirementLivelihoodPlan} />
                    <DataField label="PFA Pension Balance Range" value={profile.pfaPensionBalanceRange} />
                    <DataField label="Relocation Post-Retirement" value={profile.relocationPostRetirement} />
                    <DataField label="Mortgage Outstanding" value={profile.mortgageOutstanding} />
                    <DataField label="Number of Co-dependent Students" value={profile.coDependentStudents} />
                    <DataField label="Active Aging Status" value={profile.activeAgingStatus} />
                    <DataField label="Interest in Senior Mentorship" value={profile.seniorMentorInterest} />
                    <DataField label="Senior Center Membership" value={profile.seniorCenterMembership} />
                  </SectionCard>

                  {/* Dedicated Vocational Profile for Artisans & Unemployed */}
                  {citizenCode && (
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest px-2">
                        Artisan & Vocational Skills Profile
                      </h4>
                      <VocationalPortalCard
                        citizenCode={citizenCode}
                        employmentStatus={profile.employmentStatus || profile.currentEmploymentStatus || ""}
                      />
                    </div>
                  )}
                </TabsContent>

                {/* 4. HEALTH & SOCIAL WELFARE */}
                <TabsContent value="health" className="space-y-4 outline-none">
                  {/* Decoupled Maternal Antenatal Care Tracker (Females) */}
                  {(profile.gender?.toUpperCase() === "FEMALE" || profile.isPregnant) && (
                    <SectionCard title="Maternal Health & Antenatal Care (ANC)">
                      <DataField label="Currently Pregnant" value={profile.isPregnant} />
                      <DataField label="Enrolled in Antenatal Care" value={profile.hasStartedAntenatal} />
                      <DataField label="Antenatal Hospital Name" value={profile.antenatalHospitalName} />
                      <DataField label="Estimated Due Date (EDD)" value={profile.estimatedDueDate} />
                      <DataField label="Gestational Trimester" value={profile.trimester ? `Trimester ${profile.trimester}` : null} />
                      <DataField label="High-Risk Pregnancy Alert" value={profile.highRiskPregnancyFlag ? "YES — HIGH RISK" : "Normal"} />
                      <DataField label="Completed ANC Visits" value={profile.ancVisitsCount} />
                      <DataField label="Maternal Clinical Notes" value={profile.maternalNotes} />
                    </SectionCard>
                  )}

                  {/* Critical Senior Citizen Welfare & Care Home Section */}
                  <SectionCard title="Senior Citizen Welfare & Care Home Placement">
                    <DataField label="Retired Status" value={profile.isRetired} />
                    <DataField label="Pension Administrator (PFA)" value={profile.pensionProviderName} />
                    <DataField label="Adult Care Home Placement Requested" value={profile.interestedInAdultCareHome ? "YES — REQUESTED" : "No"} />
                  </SectionCard>

                  {/* Health Insurance Coverage */}
                  <SectionCard title="Health Insurance Coverage (HMO & NHIS)">
                    <DataField label="HMO Insurance Enrolled" value={profile.hasHmo} />
                    <DataField label="HMO Provider Name" value={profile.hmoProviderName} />
                    <DataField label="HMO Policy Number" value={profile.hmoPolicyNumber} />
                    <DataField label="NHIS Enrolled" value={profile.nhisEnrolled} />
                    <DataField label="NHIS Senior Plan Active" value={profile.nhisSeniorPlan} />
                  </SectionCard>

                  <SectionCard title="Primary Health Indicators">
                    <DataField label="Blood Group" value={profile.bloodGroup} />
                    <DataField label="Blood Genotype" value={profile.bloodGenotype} />
                    <DataField label="Is Expectant Parent" value={profile.isExpectantParent} />
                    <DataField label="Is Pregnant" value={profile.isPregnant} />
                    <DataField label="Hypertension & Diabetes Flag" value={profile.hypertensionDiabetesFlag} />
                    <DataField label="Chronic Health Registry Name" value={profile.chronicHealthRegistry} />
                    <DataField label="Cardio Screening Date" value={profile.cardioScreeningDate} />
                  </SectionCard>

                  <SectionCard title="Legacy Planning (Ages 45 - 48)">
                    <DataField label="Estate Plan/Will Registered" value={profile.estatePlanWillRegistered} />
                    <DataField label="Land Title Number" value={profile.landTitleNumber} />
                    <DataField label="Life Insurance Enrolled" value={profile.lifeInsuranceEnrolled} />
                    <DataField label="Elder Dependents Count" value={profile.elderDependentsCount} />
                    <DataField label="Secondary Income Sector" value={profile.secondaryIncomeSector} />
                    <DataField label="Cooperative Savings Status" value={profile.cooperativeSavingsStatus} />
                  </SectionCard>

                  <SectionCard title="Elderly Care & Support (Ages 61+)">
                    <DataField label="Annual Geriatric Checkup Date" value={profile.annualGeriatricCheckup} />
                    <DataField label="Pension Disbursement Status" value={profile.pensionDisbursementStatus} />
                    <DataField label="Mobility Level" value={profile.mobilityLevel} />
                    <DataField label="Primary Geriatric Clinic" value={profile.primaryGeriatricClinic} />
                    <DataField label="Social Support Network" value={profile.socialSupportNetwork} />
                    <DataField label="Primary Caregiver Name" value={profile.primaryCaregiverName} />
                    <DataField label="Primary Caregiver Phone" value={profile.primaryCaregiverPhone} />
                    <DataField label="Elderly Living Arrangement" value={profile.elderlyLivingArrangement} />
                    <DataField label="ADL Assistance Level Needed" value={profile.adlAssistanceLevel} />
                    <DataField label="Chronic Illness Diagnoses" value={profile.chronicIllnessDiagnoses} />
                    <DataField label="Has Clean Water & Electricity" value={profile.cleanWaterElectricity} />
                    <DataField label="NASSA Welfare Registered" value={profile.nassaWelfareRegistered} />
                  </SectionCard>

                  {/* Logged Health Records */}
                  <div className="mt-6 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-2">
                      Officer-Logged Health Visits
                    </h4>
                    {isHealthLoading ? (
                      <div className="text-center py-4 text-xs font-mono text-slate-400">Loading records...</div>
                    ) : healthRecords && healthRecords.length > 0 ? (
                      <div className="space-y-3">
                        {healthRecords.map((rec) => (
                          <div key={rec.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                            {editingHealthId === rec.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Record Type</label>
                                  <input
                                    type="text"
                                    value={healthForm.recordType}
                                    onChange={(e) => setHealthForm({ ...healthForm, recordType: e.target.value })}
                                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Description</label>
                                  <input
                                    type="text"
                                    value={healthForm.description}
                                    onChange={(e) => setHealthForm({ ...healthForm, description: e.target.value })}
                                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">Notes</label>
                                  <textarea
                                    value={healthForm.notes}
                                    onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 w-full min-h-[60px]"
                                  />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <button
                                    onClick={handleSaveHealthEdit}
                                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingHealthId(null)}
                                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="inline-block text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">
                                      {rec.recordType}
                                    </span>
                                    <p className="text-xs font-semibold text-slate-700 mt-2">{rec.description}</p>
                                    {rec.notes && <p className="text-[11px] text-slate-400 mt-1 italic">Note: {rec.notes}</p>}
                                  </div>
                                  {(userRole === "super_admin" || userPermissions.includes("EDIT_HEALTH_RECORD") || userPermissions.includes("DELETE_HEALTH_RECORD")) && (
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {(userRole === "super_admin" || userPermissions.includes("EDIT_HEALTH_RECORD")) && (
                                        <button
                                          onClick={() => handleStartEditHealth(rec)}
                                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                          title="Edit Record"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      {(userRole === "super_admin" || userPermissions.includes("DELETE_HEALTH_RECORD")) && (
                                        <button
                                          onClick={() => handleDeleteHealth(rec.id)}
                                          className="p-1 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded transition-colors cursor-pointer"
                                          title="Delete Record"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                                  <span>By Officer: {rec.officerCode}</span>
                                  <span>•</span>
                                  <span>{new Date(rec.loggedAt).toLocaleDateString()}</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs italic text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                        No custom health records logged.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

