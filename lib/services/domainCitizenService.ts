/**
 * CitiEye Admin — Domain Citizen Service
 * Handles server-side fetching with domain filters and client-side CSV export.
 */

import { apiClient } from "@/lib/api";
import type { DomainCitizenRecord, DomainFilterParams, PagedResult } from "@/lib/types/domainCitizens";

/**
 * Fetch paginated citizens for a given domain and set of filters.
 */
export async function fetchDomainCitizens(
  params: DomainFilterParams
): Promise<PagedResult<DomainCitizenRecord>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const url = `/api/admin/citizens?${queryParams.toString()}`;
  const response = await apiClient.get<PagedResult<DomainCitizenRecord>>(url);
  return response.data;
}

/**
 * Format and download CSV export of citizen records.
 */
export function exportDomainCitizensCsv(
  domain: string,
  records: DomainCitizenRecord[]
): void {
  if (!records || records.length === 0) {
    alert("No records available to export.");
    return;
  }

  let headers: string[] = [];
  let rowMapper: (r: DomainCitizenRecord) => (string | number | boolean)[];

  switch (domain.toLowerCase()) {
    case "education":
      headers = [
        "Citizen Code",
        "Full Name",
        "Age",
        "Gender",
        "State",
        "LGA",
        "Educational Level",
        "Current Institution",
        "Class / Level",
        "Qualification",
        "Registered At",
      ];
      rowMapper = (r) => [
        r.citizenCode,
        r.fullName,
        r.age,
        r.gender,
        r.stateOfResidence || r.stateOfOrigin,
        r.residenceLga || r.lga,
        r.educationalLevel || "N/A",
        r.institutionName || "N/A",
        r.currentClassGrade || "N/A",
        r.highestAcademicQualification || "N/A",
        r.registeredAt ? r.registeredAt.substring(0, 10) : "",
      ];
      break;

    case "health":
      headers = [
        "Citizen Code",
        "Full Name",
        "Age",
        "Gender",
        "State",
        "LGA",
        "Pregnancy/ANC Status",
        "HMO Coverage",
        "HMO Provider",
        "Blood Group",
        "Genotype",
        "Chronic Illness",
        "Emergency Risk",
      ];
      rowMapper = (r) => [
        r.citizenCode,
        r.fullName,
        r.age,
        r.gender,
        r.stateOfResidence || r.stateOfOrigin,
        r.residenceLga || r.lga,
        r.isPregnant ? "Pregnant / ANC" : "Not Pregnant",
        r.hasHmo ? "Covered" : "Not Covered",
        r.hmoProviderName || "N/A",
        r.bloodGroup || "N/A",
        r.bloodGenotype || "N/A",
        r.chronicCondition ? "Yes" : "No",
        r.emergencyRiskFlag ? "High Risk" : "Normal",
      ];
      break;

    case "hr":
    case "hr_jobs":
    case "business":
      headers = [
        "Citizen Code",
        "Full Name",
        "Age",
        "Gender",
        "State",
        "LGA",
        "Employment Track",
        "Employer / Business Name",
        "Role / Business Nature",
        "CAC Registered",
        "CAC Reg Number",
        "Vocational Skill",
        "Training Center",
        "Unemployed Desired Next Step",
        "Income Range",
      ];
      rowMapper = (r) => [
        r.citizenCode,
        r.fullName,
        r.age,
        r.gender,
        r.stateOfResidence || r.stateOfOrigin,
        r.residenceLga || r.lga,
        r.employmentTrack?.toUpperCase() || "UNSPECIFIED",
        r.employerName || r.businessName || "N/A",
        r.natureOfEmployment || r.businessNature || "N/A",
        r.isCacRegistered ? "Registered" : "Unregistered",
        r.cacRegistrationNumber || "N/A",
        r.tradeSkillKind || "N/A",
        r.trainingCenterName || "N/A",
        r.desiredNextStep || "N/A",
        r.monthlyIncomeRange || "N/A",
      ];
      break;

    case "pension":
      headers = [
        "Citizen Code",
        "Full Name",
        "Age",
        "Gender",
        "State",
        "LGA",
        "Retirement Status",
        "Years of Service",
        "Pension Provider (PFA)",
        "CPS Pension PIN",
        "Balance Range",
        "Disbursement Status",
        "Interested in Adult Care Home",
      ];
      rowMapper = (r) => [
        r.citizenCode,
        r.fullName,
        r.age,
        r.gender,
        r.stateOfResidence || r.stateOfOrigin,
        r.residenceLga || r.lga,
        r.isRetired ? "Retired" : "Active / Pre-Retirement",
        r.yearsOfService ?? 0,
        r.pensionProviderName || "N/A",
        r.cpsPensionPin || "N/A",
        r.pfaPensionBalanceRange || "N/A",
        r.disbursementStatus || "NOT_ENROLLED",
        r.interestedInAdultCareHome ? "Yes" : "No",
      ];
      break;

    default:
      headers = [
        "Citizen Code",
        "Full Name",
        "Age",
        "Gender",
        "State",
        "LGA",
        "NIN",
        "Cohort",
        "Registered At",
      ];
      rowMapper = (r) => [
        r.citizenCode,
        r.fullName,
        r.age,
        r.gender,
        r.stateOfResidence || r.stateOfOrigin,
        r.residenceLga || r.lga,
        r.nin || "N/A",
        r.cohortName || "N/A",
        r.registeredAt ? r.registeredAt.substring(0, 10) : "",
      ];
  }

  const csvRows = [
    headers.join(","),
    ...records.map((r) =>
      rowMapper(r)
        .map((cell) => {
          const str = String(cell ?? "").replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `citieye_${domain.toLowerCase()}_citizens_${new Date().toISOString().substring(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

