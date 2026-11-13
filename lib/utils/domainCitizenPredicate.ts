/**
 * CitiEye Admin — Domain Citizen Normalization & Filter Predicates
 * Provides high-performance client-side filtering and name synthesis.
 */

import type { DomainCitizenRecord, DomainFilterParams } from "@/lib/types/domainCitizens";

/**
 * Synthesizes the citizen's full name from firstName, middleName, and lastName.
 */
export function getCitizenFullName(c: {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
}): string {
  const parts = [c.firstName, c.middleName, c.lastName]
    .filter((part): part is string => Boolean(part && typeof part === "string"))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length > 0) {
    return parts.join(" ");
  }
  return (c.fullName || "").trim();
}

/**
 * Ensures a record has a computed fullName and trimmed string properties.
 */
export function normalizeDomainCitizen(record: DomainCitizenRecord): DomainCitizenRecord {
  const fullName = getCitizenFullName(record);
  return {
    ...record,
    fullName: fullName || record.fullName || "Unnamed Citizen",
  };
}

/**
 * Normalizes educational level strings to match regardless of casing, underscores, or spaces.
 * e.g., "SECONDARY", "Secondary" -> "SECONDARY"
 * "Not in school", "NOT_IN_SCHOOL" -> "NOTINSCHOOL"
 */
export function normalizeEducationKey(level?: string | null): string {
  if (!level) return "";
  return level.trim().toUpperCase().replace(/[\s_-]+/g, "");
}

/**
 * High-performance client-side filter predicate for CitiEye domain citizen records.
 */
export function matchCitizenFilter(
  citizen: DomainCitizenRecord,
  filters: DomainFilterParams
): boolean {
  // 1. Text Query (Global Search across multiple fields)
  if (filters.query && filters.query.trim() !== "") {
    const q = filters.query.trim().toLowerCase();
    const fullName = citizen.fullName || getCitizenFullName(citizen);
    const matchesQuery =
      fullName.toLowerCase().includes(q) ||
      (citizen.citizenCode && citizen.citizenCode.toLowerCase().includes(q)) ||
      (citizen.phoneNumber && citizen.phoneNumber.includes(q)) ||
      (citizen.email && citizen.email.toLowerCase().includes(q)) ||
      (citizen.nin && citizen.nin.toLowerCase().includes(q)) ||
      (citizen.institutionName && citizen.institutionName.toLowerCase().includes(q)) ||
      (citizen.employerName && citizen.employerName.toLowerCase().includes(q)) ||
      (citizen.businessName && citizen.businessName.toLowerCase().includes(q)) ||
      (citizen.pensionProviderName && citizen.pensionProviderName.toLowerCase().includes(q));

    if (!matchesQuery) return false;
  }

  // 2. Demographic Filters
  if (filters.gender && filters.gender !== "all") {
    if ((citizen.gender || "").trim().toLowerCase() !== filters.gender.trim().toLowerCase()) {
      return false;
    }
  }

  if (filters.state && filters.state !== "all") {
    const stateVal = (citizen.stateOfResidence || citizen.stateOfOrigin || "").trim().toLowerCase();
    if (stateVal !== filters.state.trim().toLowerCase()) {
      return false;
    }
  }

  if (filters.lga && filters.lga !== "all") {
    const lgaVal = (citizen.residenceLga || citizen.lga || "").trim().toLowerCase();
    if (lgaVal !== filters.lga.trim().toLowerCase()) {
      return false;
    }
  }

  // 3. Education Domain Filters
  if (filters.educationalLevel && filters.educationalLevel !== "all") {
    const filterKey = normalizeEducationKey(filters.educationalLevel);
    const citizenKey = normalizeEducationKey(citizen.educationalLevel);
    if (filterKey !== citizenKey) {
      return false;
    }
  }

  // 4. Health Domain Filters
  if (filters.isPregnant !== undefined) {
    if (Boolean(citizen.isPregnant) !== Boolean(filters.isPregnant)) {
      return false;
    }
  }

  if (filters.hasHmo !== undefined) {
    if (Boolean(citizen.hasHmo) !== Boolean(filters.hasHmo)) {
      return false;
    }
  }

  if (filters.bloodGroup && filters.bloodGroup !== "all") {
    if ((citizen.bloodGroup || "").trim().toUpperCase() !== filters.bloodGroup.trim().toUpperCase()) {
      return false;
    }
  }

  if (filters.bloodGenotype && filters.bloodGenotype !== "all") {
    if ((citizen.bloodGenotype || "").trim().toUpperCase() !== filters.bloodGenotype.trim().toUpperCase()) {
      return false;
    }
  }

  if (filters.chronicCondition !== undefined) {
    if (Boolean(citizen.chronicCondition) !== Boolean(filters.chronicCondition)) {
      return false;
    }
  }

  // 5. HR & Jobs / Business Affairs Domain Filters
  if (filters.employmentTrack && filters.employmentTrack !== "all") {
    const targetTrack = filters.employmentTrack.trim().toLowerCase();
    const actualTrack = (citizen.employmentTrack || "").trim().toLowerCase();
    if (actualTrack !== targetTrack) {
      return false;
    }
  }

  if (filters.cacStatus && filters.cacStatus !== "all") {
    const isRegistered = Boolean(citizen.isCacRegistered);
    if (filters.cacStatus === "registered" && !isRegistered) return false;
    if (filters.cacStatus === "unregistered" && isRegistered) return false;
  }

  if (filters.unemployedDesiredNextStep && filters.unemployedDesiredNextStep !== "all") {
    const filterStep = filters.unemployedDesiredNextStep.trim().toUpperCase();
    const actualStep = (citizen.desiredNextStep || "").trim().toUpperCase();
    if (actualStep !== filterStep) {
      return false;
    }
  }

  // 6. Pension Domain Filters
  if (filters.pensionStatus && filters.pensionStatus !== "all") {
    const isUnderPension =
      (citizen.disbursementStatus && citizen.disbursementStatus.toUpperCase() !== "NOT_ENROLLED") ||
      Boolean(citizen.cpsPensionPin && citizen.cpsPensionPin.trim() !== "") ||
      Boolean(citizen.pensionProviderName && citizen.pensionProviderName.trim() !== "");

    if (filters.pensionStatus === "under_pension" && !isUnderPension) return false;
    if (filters.pensionStatus === "not_under_pension" && isUnderPension) return false;
  }

  if (filters.isRetired !== undefined) {
    if (Boolean(citizen.isRetired) !== Boolean(filters.isRetired)) {
      return false;
    }
  }

  if (filters.interestedInAdultCareHome !== undefined) {
    if (Boolean(citizen.interestedInAdultCareHome) !== Boolean(filters.interestedInAdultCareHome)) {
      return false;
    }
  }

  return true;
}

