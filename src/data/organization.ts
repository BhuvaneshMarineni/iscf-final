/**
 * organization.ts
 * Single source of truth for ISCF organizational details.
 * Used by Logo, Footer, Contact page, and any place that references contact info.
 */

export const organization = {
  name: 'ISCF',
  fullName: 'International Student Christian Fellowship',
  tagline: 'Serving international students at Old Dominion University since 1995.',
  description:
    'Building bridges of friendship, faith, and community across cultures.',

  contact: {
    email: 'info@iscfodu.org',
    phone: '(757) XXX-XXXX', // TODO: update with real phone number
    phoneHref: 'tel:+1-757-XXX-XXXX',
    address: {
      line1: 'Old Dominion University',
      line2: 'Norfolk, VA',
    },
  },

  branding: {
    logo: '/images/ISCF.png',
    foundingYear: 1995,
  },

  social: {
    facebook: 'https://facebook.com/iscfodu',
    instagram: 'https://instagram.com/iscfodu',
    whatsapp: 'https://wa.me/17571234567',
  },
} as const;

export type Organization = typeof organization;
