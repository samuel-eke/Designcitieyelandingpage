/**
 * CitiEye Admin — TanStack Query Keys for Domain Citizens
 * Scoped by domain and demographic macro-boundary (state), excluding ephemeral micro-filters.
 */

export const domainCitizensKeys = {
  all: ["domainCitizens"] as const,
  domain: (domain: string) => [...domainCitizensKeys.all, domain] as const,
  scoped: (domain: string, stateScope?: string) =>
    [...domainCitizensKeys.domain(domain), { stateScope: stateScope || "ALL" }] as const,
  server: (params: Record<string, any>) => [...domainCitizensKeys.all, "server", params] as const,
};

