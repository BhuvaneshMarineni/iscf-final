/**
 * siteContent.ts
 * Single source of truth for reusable static copy across the ISCF website.
 * This file owns short promotional text only. Full About/Mission/Vision content
 * belongs in the About page.
 */

export const siteContent = {
  // Hero section (Homepage)
  hero: {
    badge: 'Welcome Home',
    headline: 'International Students, You Belong Here.',
    paragraph:
      "Since 1995, we've been creating a warm community and home away from home for international students at Old Dominion University through friendship, faith, and genuine hospitality.",
    primaryCTA: 'Join Our Events',
    secondaryCTA: 'Our Story',
  },

  // Short preview on the homepage (links to /about)
  aboutPreview: {
    sectionTitle: 'About ISCF',
    headline: 'We Are So Glad You Are Here!',
    paragraph:
      'Since 1995, our heart has been to serve and walk alongside international students as you study and experience life in the United States. Through the friendship and hospitality of American families and individuals, you will find a warm community, a home away from home, and people eager to share life.',
    cta: 'Learn Our Story',
  },

  // Ministries / Feature cards (Homepage)
  ministries: {
    sectionTitle: 'Get Involved',
    headline: 'Ways to Connect',
    items: [
      {
        title: 'Diverse Community',
        description: 'Students from every corner of the world',
      },
      {
        title: 'Genuine Hospitality',
        description: 'Warm welcomes from American families',
      },
      {
        title: 'Explore Faith',
        description: 'Ask questions and discover Jesus',
      },
      {
        title: 'Lifelong Friendships',
        description: 'Build relationships that last forever',
      },
    ],
  },

  // Testimonials section
  testimonials: {
    sectionTitle: 'Student Stories',
    headline: 'What Students Say',
    cta: 'View all stories',
  },

  // Global CTAs
  cta: {
    finalHeadline: 'Be Part of Our Family',
    finalParagraph:
      "Whether you're new to ODU or have been here for years, there's a place for you at ISCF.",
    finalButton: 'Get Involved',
  },
} as const;

export type SiteContent = typeof siteContent;
