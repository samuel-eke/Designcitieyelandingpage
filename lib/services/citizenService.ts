/**
 * CitiEye — Citizen API Service
 *
 * Typed async wrappers around `apiClient` for all citizen-facing endpoints.
 * Stubs are provided for endpoints not yet implemented on the server — each
 * stub is clearly marked so it can be replaced when the endpoint goes live.
 *
 * All functions throw on non-2xx responses; callers should handle errors.
 */

import { apiClient } from "@/lib/api";
import type {
  PostDto,
  CitizenProfile,
  CohortPlacement,
  CitizenKpi,
  CitizenMilestone,
} from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// Admin CMS Feed — GET /api/citizen/dashboard
// ---------------------------------------------------------------------------

/**
 * Fetches the personalised list of admin posts targeting this citizen.
 *
 * The server resolves the citizen from the JWT principal and matches posts
 * against their cohortId, stateResidence, stateOrigin, and desiredSupport.
 * Posts with all target fields null are broadcast to every citizen.
 *
 * @returns Array of PostDto (may be empty if no posts match the citizen's profile)
 */
export async function getDashboardFeed(): Promise<PostDto[]> {
  const response = await apiClient.get<PostDto[]>("/api/citizen/dashboard");
  return response.data;
}

// ---------------------------------------------------------------------------
// Citizen Profile — TODO: endpoint not yet implemented
// Expected: GET /api/citizen/profile
// ---------------------------------------------------------------------------

/**
 * Fetches the full demographic profile for the authenticated citizen.
 *
 * @stub — Endpoint does not yet exist on the CitiEye server.
 *         Replace the body with: `return (await apiClient.get<CitizenProfile>('/api/citizen/profile')).data`
 *         once the endpoint is implemented.
 */
export async function getCitizenProfile(): Promise<CitizenProfile> {
  // TODO: implement when GET /api/citizen/profile is ready
  throw new Error(
    "getCitizenProfile: endpoint not yet implemented on the CitiEye server."
  );
}

// ---------------------------------------------------------------------------
// Cohort Placement — TODO: endpoint not yet implemented
// Expected: GET /api/citizen/cohort
// ---------------------------------------------------------------------------

/**
 * Fetches the citizen's current cohort placement including cohort metadata.
 *
 * @stub — Endpoint does not yet exist on the CitiEye server.
 *         Replace the body with: `return (await apiClient.get<CohortPlacement>('/api/citizen/cohort')).data`
 *         once the endpoint is implemented.
 */
export async function getCohortPlacement(): Promise<CohortPlacement> {
  // TODO: implement when GET /api/citizen/cohort is ready
  throw new Error(
    "getCohortPlacement: endpoint not yet implemented on the CitiEye server."
  );
}

// ---------------------------------------------------------------------------
// KPIs — TODO: endpoint not yet implemented
// Expected: GET /api/citizen/kpis
// ---------------------------------------------------------------------------

/**
 * Fetches all KPIs assigned to the authenticated citizen for their current cohort.
 * Each KPI includes the template definition, current value (JSONB), status, and history log.
 *
 * @stub — Endpoint does not yet exist on the CitiEye server.
 *         Replace the body with: `return (await apiClient.get<CitizenKpi[]>('/api/citizen/kpis')).data`
 *         once the endpoint is implemented.
 */
export async function getCitizenKpis(): Promise<CitizenKpi[]> {
  // TODO: implement when GET /api/citizen/kpis is ready
  throw new Error(
    "getCitizenKpis: endpoint not yet implemented on the CitiEye server."
  );
}

// ---------------------------------------------------------------------------
// Milestones — TODO: endpoint not yet implemented
// Expected: GET /api/citizen/milestones
// ---------------------------------------------------------------------------

/**
 * Fetches all milestones assigned to the authenticated citizen for their cohort.
 * Includes the milestone template, completion status, verification data, and timestamps.
 *
 * @stub — Endpoint does not yet exist on the CitiEye server.
 *         Replace the body with: `return (await apiClient.get<CitizenMilestone[]>('/api/citizen/milestones')).data`
 *         once the endpoint is implemented.
 */
export async function getCitizenMilestones(): Promise<CitizenMilestone[]> {
  // TODO: implement when GET /api/citizen/milestones is ready
  throw new Error(
    "getCitizenMilestones: endpoint not yet implemented on the CitiEye server."
  );
}
