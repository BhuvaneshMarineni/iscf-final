/**
 * siteStats.ts
 * Single source of truth for all ISCF statistics.
 * Used by the Footer, Homepage, About page, and Gallery page.
 */

export interface SiteStat {
  value: string;
  label: string;
  icon: 'calendar' | 'users' | 'globe' | 'heart';
}

export const siteStats = {
  yearsServing: {
    value: '29',
    label: 'Years of Ministry',
    icon: 'calendar' as const,
  },
  eventsHosted: {
    value: '1000+',
    label: 'Events Captured',
    icon: 'calendar' as const,
  },
  studentsServed: {
    value: '20,000+',
    label: 'Students Served',
    icon: 'users' as const,
  },
  countriesRepresented: {
    value: '100+',
    label: 'Countries Represented',
    icon: 'globe' as const,
  },
} as const;

export const statsArray: SiteStat[] = [
  siteStats.yearsServing,
  siteStats.eventsHosted,
  siteStats.studentsServed,
  siteStats.countriesRepresented,
];
