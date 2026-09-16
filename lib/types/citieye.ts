/**
 * CitiEye Server — TypeScript type contracts
 *
 * These interfaces mirror the exact shapes returned by the CitiEye Spring Boot API.
 * Do NOT add fields here that the server does not return — keep this file in sync
 * with the Java DTOs and entity classes.
 */

// ---------------------------------------------------------------------------
// Enums (mirror the PostgreSQL enum types and Java enum classes)
// ---------------------------------------------------------------------------

/**
 * citizen_profile.desired_support_type
 * Maps to: DesiredSupport.java
 */
export type DesiredSupport =
  | "scholarship"
  | "medical_aid_treatment"
  | "business_capital"
  | "investor_funding"
  | "job_opportunity"
  | "visa_sponsorship"
  | "skill_acquisition";

/**
 * citizen_profile.employment_status_type
 * Maps to: EmploymentStatus.java
 */
export type EmploymentStatus = "employed" | "unemployed" | "business_owner" | "artisan";

/**
 * cohort_placement.citizen_kpis.status
 * Maps to: KpiStatus.java
 */
export type KpiStatus = "not_started" | "in_progress" | "met" | "failed";

/**
 * cohort_placement.citizen_milestones.status
 * Maps to: MilestoneStatus.java
 */
export type MilestoneStatus = "pending" | "in_progress" | "completed" | "waived";

/**
 * cohort_placement.kpi_templates.metric_type
 * Maps to: MetricType.java
 * Note: server stores "boolean" as the literal — we alias it here.
 */
export type MetricType = "numeric" | "boolean" | "percentage" | "scale";

// ---------------------------------------------------------------------------
// Admin CMS — GET /api/citizen/dashboard response item
// Maps to: PostDto.java
// ---------------------------------------------------------------------------

export interface PostDto {
  /** UUID string of the CMS content record */
  id: string;
  title: string;
  /** Full post body text */
  content: string;
  /** Admin username or display name that authored the post */
  author: string;
  /** e.g. "Cohort Update", "Health Notice", "Grant Opportunity" */
  contentCategory: string;
  /** ISO-8601 OffsetDateTime string */
  datePublished: string;
  pictureUrl: string | null;

  // Targeting metadata — nullable (post may target by a single criterion, or none for broadcast)
  targetCohortId: number | null;
  targetStateResidence: string | null;
  targetStateOrigin: string | null;
  targetDesiredSupport: DesiredSupport | null;
}

/**
 * Filter categories derived from the four targeting columns on AdminCMSContentEntity.
 * Used client-side to tag posts and drive filter chip behaviour.
 */
export type PostTargetType = "cohort" | "state_residence" | "state_origin" | "support_group" | "everyone";

// ---------------------------------------------------------------------------
// Citizen Profile — citizen_profile.profiles table
// Maps to: Profile.java
// ---------------------------------------------------------------------------

export interface CitizenProfile {
  citizenCode: string;
  lga: string | null;
  hometown: string | null;
  currentEducationalLevel: string | null;
  highestEducationalQualification: string | null;
  courseOfStudy: string | null;
  age: number | null;
  universityAttended: string | null;
  degreeAttained: string | null;
  yearOfGraduation: number | null;
  isExpectantParent: boolean | null;
  householdSize: number | null;
  isPregnant: boolean | null;
  bloodGroup: string | null;
  bloodGenotype: string | null;
  currentEmploymentStatus: EmploymentStatus | null;
  placeOfEmploymentBusiness: string | null;
  nameOfEmployerBusiness: string | null;
  natureOfBusinessJob: string | null;
  desiredSupport: DesiredSupport;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Cohort & Placement — cohort_placement module
// Maps to: Cohort.java, Placement.java
// ---------------------------------------------------------------------------

export interface Cohort {
  id: number;
  name: string;
  minAge: number;
  maxAge: number | null;
  description: string | null;
  createdAt: string;
}

export interface CohortPlacement {
  citizenCode: string;
  cohort: Cohort;
  ageAtRegistration: number;
  lastTransitionedAt: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// KPI Templates & Citizen KPIs — cohort_placement module
// Maps to: KpiTemplate.java, CitizenKpi.java
// ---------------------------------------------------------------------------

export interface KpiTemplate {
  id: number;
  cohort: Pick<Cohort, "id" | "name">;
  title: string;
  description: string | null;
  metricType: MetricType;
  /** Raw JSONB object — shape varies per template */
  targetCriteria: Record<string, unknown>;
  createdAt: string;
}

export interface CitizenKpi {
  id: number;
  citizenCode: string;
  kpiTemplate: KpiTemplate;
  /** Raw JSONB — actual current metric value */
  currentValue: Record<string, unknown>;
  status: KpiStatus;
  /** JSONB array of historical values */
  historyLog: Array<Record<string, unknown>> | null;
  lastUpdatedAt: string;
}

// ---------------------------------------------------------------------------
// Milestone Templates & Citizen Milestones — cohort_placement module
// Maps to: MilestoneTemplate.java, CitizenMilestone.java
// ---------------------------------------------------------------------------

export interface MilestoneTemplate {
  id: number;
  cohort: Pick<Cohort, "id" | "name">;
  title: string;
  description: string | null;
  isMandatory: boolean;
  /** JSONB schema definition */
  metaSchema: Record<string, unknown> | null;
  createdAt: string;
}

export interface CitizenMilestone {
  id: number;
  citizenCode: string;
  milestoneTemplate: MilestoneTemplate;
  status: MilestoneStatus;
  assignedAt: string;
  completedAt: string | null;
  /** JSONB evidence/verification data */
  verificationData: Record<string, unknown> | null;
  lastUpdatedAt: string;
}

// ---------------------------------------------------------------------------
// SSE — /api/posts/stream event payload
// The server dispatches this when a new targeted post is published.
// Maps to: PostPublishedEvent.java fields piped through the SSESessionRegistry.
// ---------------------------------------------------------------------------

export interface PostSseEvent {
  postId: string;
  title: string;
  content: string;
  author: string;
  targetCohortId: number | null;
  targetStateResidence: string | null;
  targetStateOrigin: string | null;
  targetDesiredSupport: DesiredSupport | null;
}

// ---------------------------------------------------------------------------
// Utility — API wrapper response shape
// ---------------------------------------------------------------------------

export interface ApiError {
  message: string;
  status: number;
}

// ---------------------------------------------------------------------------
// Analytics Module — DTOs
// ---------------------------------------------------------------------------

export interface AnalyticsSummaryDto {
  totalCitizens: number;
  totalCitizensLast7Days: number;
  totalCitizensLast30Days: number;
  maleCitizens: number;
  femaleCitizens: number;
  byStateAndLga: Array<{
    stateOfOrigin: string;
    stateOfResidence: string;
    lga: string;
    totalCitizens: number;
    maleCount: number;
    femaleCount: number;
    registeredLast7Days: number;
    registeredLast30Days: number;
  }>;
  byCohort: Array<{
    cohortId: number;
    cohortName: string;
    minAge: number | null;
    maxAge: number | null;
    totalCitizens: number;
    citizensWithAnyMilestoneCompleted: number;
    avgAgeAtRegistration: number | null;
  }>;
  byEmploymentStatus: Array<{
    employmentStatus: string;
    monthlyIncomeRange: string | null;
    industrySector: string | null;
    highestAcademicQualification: string | null;
    stateOfOrigin: string;
    lga: string;
    citizenCount: number;
  }>;
  healthIndicators: {
    totalCitizensProfiled: number;
    vaccinationComplete: number;
    pregnantCount: number;
    expectantParents: number;
    hypertensionDiabetesCount: number;
    nhisEnrolledCount: number;
    nhisSeniorPlanCount: number;
    bloodGroupRecorded: number;
    chronicIllnessCount: number;
  };
}

export interface PagedResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CitizenListItemDto {
  citizenCode: string;
  fullName: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  lga: string;
  residenceLga: string;
  gender: string;
  age: number | null;
  cohortName: string;
  registeredAt: string; // ISO 8601 string
}

export interface CitizenProfileAnalyticsDto {
  // Identity
  citizenCode: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string; // YYYY-MM-DD
  age: number | null;
  gender: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  lga: string;
  residenceLga: string;
  address: string;
  registeredAt: string;

  // Cohort
  cohortName: string;
  ageAtRegistration: number;
  cohortLastTransitionedAt: string;

  // Basic Profile
  hometown: string | null;
  currentEducationalLevel: string | null;
  highestEducationalQualification: string | null;
  courseOfStudy: string | null;
  universityAttended: string | null;
  degreeAttained: string | null;
  yearOfGraduation: number | null;
  isExpectantParent: boolean | null;
  householdSize: number | null;
  isPregnant: boolean | null;
  bloodGroup: string | null;
  bloodGenotype: string | null;
  currentEmploymentStatus: string | null;
  placeOfEmploymentBusiness: string | null;
  nameOfEmployerBusiness: string | null;
  natureOfBusinessJob: string | null;

  // Early Childhood (0-5)
  birthWeightKg: number | null;
  deliveryAssistantType: string | null;
  exclusiveBreastfeedingMonths: number | null;
  vaccinationRecordCompleted: boolean | null;
  missingVaccines: string | null;
  isRegisteredBirth: boolean | null;
  parentGuardianNin: string | null;
  preschoolEnrollment: boolean | null;

  // Foundational Education (6-11)
  schoolName: string | null;
  currentClassGrade: string | null;
  finishedPrimary6: boolean | null;
  hasFirstSchoolLeavingCert: boolean | null;
  fslcGrade: string | null;
  schoolMealsRecipient: boolean | null;
  literacyScorePercent: number | null;
  numeracyScorePercent: number | null;
  averageAttendanceRate: number | null;
  visionHearingPass: boolean | null;
  commuteDistanceKm: number | null;

  // Secondary Education (12-18)
  secEnrollmentStatus: string | null;
  annualGradeAverage: number | null;
  registeredWaec: boolean | null;
  waecGrades: string | null;
  registeredNeco: boolean | null;
  necoGrades: string | null;
  examSubsidyQualified: boolean | null;
  preferredCareerTrack: string | null;
  digitalLiteracyCert: boolean | null;
  menstrualKitRequested: boolean | null;
  schoolFeeIndigentStatus: boolean | null;
  safeguardingIssueReported: string | null;

  // Higher Education (19-26)
  tertiaryInstitutionName: string | null;
  tertiaryInstitutionCode: string | null;
  nelfundStudentLoan: boolean | null;
  cgpa: number | null;
  expectedGraduationYear: number | null;
  nyscCallupNumber: string | null;
  nyscPostingState: string | null;
  nyscPpaAddress: string | null;
  vocationalLicensing: string | null;
  extracurricularActivities: string | null;
  exploitationAbuseReported: string | null;

  // Workforce Integration (27-32)
  employmentStatus: string | null;
  highestAcademicQualification: string | null;
  tinNumber: string | null;
  bvnNumber: string | null;
  monthlyIncomeRange: string | null;
  nhisEnrolled: boolean | null;
  industrySector: string | null;
  businessRegistrationNumber: string | null;
  nyscDischargeCert: string | null;

  // Career Growth (33-41)
  maritalStatus: string | null;
  dependentChildrenCount: number | null;
  housingTenureStatus: string | null;
  nhfContributor: boolean | null;
  cpsPensionPin: string | null;
  farmingLandOwnership: boolean | null;
  cooperativeMembership: string | null;
  chronicHealthRegistry: string | null;

  // Mid-Life Reinvention (42-44)
  reskillingInterest: boolean | null;
  physicalObsolescenceRisk: string | null;
  familyEducationBurden: number | null;
  businessExpansionCapital: boolean | null;
  cardioScreeningDate: string | null;
  primaryIncomeSource: string | null;
  digitalUpskillingCount: number | null;
  interestInPoliticalOffice: boolean | null;

  // Legacy Planning (45-48)
  estatePlanWillRegistered: boolean | null;
  landTitleNumber: string | null;
  lifeInsuranceEnrolled: boolean | null;
  elderDependentsCount: number | null;
  hypertensionDiabetesFlag: boolean | null;
  secondaryIncomeSector: string | null;
  cooperativeSavingsStatus: boolean | null;

  // Pre-Retirement (49-54)
  expectedRetirementAge: number | null;
  yearsOfService: number | null;
  retirementLivelihoodPlan: string | null;
  pfaPensionBalanceRange: string | null;
  relocationPostRetirement: string | null;
  annualGeriatricCheckup: string | null;
  mortgageOutstanding: boolean | null;
  coDependentStudents: number | null;

  // Active Aging (55-60)
  activeAgingStatus: string | null;
  seniorMentorInterest: boolean | null;
  seniorCenterMembership: boolean | null;
  mobilityLevel: string | null;
  primaryGeriatricClinic: string | null;
  nhisSeniorPlan: boolean | null;
  socialSupportNetwork: string | null;

  // Elderly Care (61+)
  pensionDisbursementStatus: string | null;
  primaryCaregiverName: string | null;
  primaryCaregiverPhone: string | null;
  elderlyLivingArrangement: string | null;
  adlAssistanceLevel: string | null;
  chronicIllnessDiagnoses: string | null;
  cleanWaterElectricity: boolean | null;
  nassaWelfareRegistered: boolean | null;

  profileLastUpdated: string;
}
