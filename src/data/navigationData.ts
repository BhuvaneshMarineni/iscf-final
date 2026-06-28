/**
 * navigationData.ts
 * Single source of truth for all navigation links across the ISCF website.
 * Header, Footer, and any other navigation component should consume this file.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
];

export const footerQuickLinks: NavItem[] = [
  { href: '/about', label: 'About Us' },
  { href: '/events', label: 'Events' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
  { href: '/gallery', label: 'Gallery' },
];

export const footerSupportLinks: NavItem[] = [
  { href: '/contact', label: 'Donate' },
  { href: '/get-involved', label: 'Volunteer' },
  { href: '/get-involved', label: 'Partner with Us' },
  { href: '/contact', label: 'Prayer Requests' },
];

export const footerResourcesLinks: NavItem[] = [
  { href: '/about', label: 'Our Story' },
  { href: '/events', label: 'Upcoming Events' },
  { href: '/gallery', label: 'Photo Gallery' },
  { href: '/contact', label: 'Contact Us' },
];

export interface SocialLink {
  name: string;
  href: string;
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/iscfodu',
    ariaLabel: 'Follow ISCF on Facebook',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/iscfodu',
    ariaLabel: 'Follow ISCF on Instagram',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/17571234567',
    ariaLabel: 'Contact ISCF on WhatsApp',
  },
];
