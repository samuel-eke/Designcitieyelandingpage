/**
 * CitiEye — Admin Citizen Lifecycle Data Contract
 *
 * Direct TypeScript interface matching the backend Spring Boot DTO:
 * com.goldbyte.citieye_server.fieldofficer.internal.dto.AdminCitizenLifecycleViewDto
 *
 * Returned by: GET /api/admin/citizens/{citizenCode}
 * Restricted to: agency_admin and super_admin
 */

export interface AdminCitizenLifecycleViewDto {
  // Identity & Core Demographics
  citizenCode: string;
  fullName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber?: string | null;
  email?: string | null;
  dateOfBirth?: string | null; // YYYY-MM-DD
  age: number;
  gender: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  lga: string;
  residenceLga?: string | null;
  address?: string | null;
  nin?: string | null;
  parentNin?: string | null;
  registeredAt?: string | null;
  cohortName: string;

  // Lifecycle & Milestone Transition Status (PRD Module 1.2 & Sprint 5)
  isMinor: boolean;
  isInGracePeriod: boolean; // Age 16-17 two-year grace period
  isAdult: boolean; // Age 18+
  hasNin: boolean;
  isNinRequired: boolean; // True if age >= 18 and lacks personal 11-digit NIN
  transitionMessage: string;
  dependentsCount: number;

  // Household Demographics (PRD Module 3.4 & Sprint 4)
  maritalStatus?: string | null;
  numberOfWives?: number | null; // Aggregate count for married males
  hasChildren: boolean;
  numberOfChildren: number;

  // Economic & Enterprise Status (PRD Module 3.2 Tracks A-D & Sprint 3)
  isUndergoingVocationalTraining: boolean;
  tradeSkillKind?: string | null;
  trainingCenterName?: string | null;
  trainingCenterLocation?: string | null;
  trainingDurationMonths?: number | null;

  hasBusiness: boolean;
  businessName?: string | null;
  businessNature?: string | null;
  isCacRegistered: boolean;
  cacRegistrationNumber?: string | null;

  isEmployed: boolean;
  employerName?: string | null;
  employerAddress?: string | null;
  natureOfEmployment?: string | null;

  isUnemployed: boolean;
  desiredNextStep?: string | null;

  // Critical Social Welfare Alert for Senior Citizens (PRD Module 3.2 Track E & Sprint 5)
  isRetired: boolean;
  pensionProviderName?: string | null;
  interestedInAdultCareHome: boolean; // Priority flag for state residential care intervention

  // Healthcare & HMO
  hasHmo: boolean;
  hmoProviderName?: string | null;
  hmoPolicyNumber?: string | null;

  // Maternal Health & Antenatal Care (PRD Module 3.4 & Sprint 4)
  isPregnant: boolean;
  hasStartedAntenatal: boolean;
  antenatalHospitalName?: string | null;
  estimatedDueDate?: string | null;
  trimester?: number | null;
  highRiskPregnancyFlag: boolean;
  ancVisitsCount: number;
  maternalNotes?: string | null;

  // Education Summary (PRD Module 2 & 3.1)
  schoolName?: string | null;
  currentClassGrade?: string | null;
  tertiaryInstitutionName?: string | null;
  tertiaryInstitutionType?: string | null;
  tertiaryCourseOfStudy?: string | null;
  tertiaryCurrentLevel?: string | null;
  tertiaryCurrentSemester?: string | null;
  tertiaryAcademicSession?: string | null;
}

