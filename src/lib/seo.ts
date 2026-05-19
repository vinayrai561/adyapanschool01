/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SEO Utilities — Adyapan
 * Central helper for generating per-page Metadata objects, JSON-LD schemas,
 * breadcrumbs, and Open Graph / Twitter card data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from 'next';

// ── Base config ───────────────────────────────────────────────────────────────
export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';

export const SITE_NAME = 'Adyapan';
export const SITE_TAGLINE = 'Learn, Earn & Get Placed';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
export const TWITTER_HANDLE = '@adyapan';
export const ORGANIZATION_NAME = 'Adyapan Edutech Pvt. Ltd.';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  /** Relative path, e.g. "/programs" or "/courses/data-science" */
  path?: string;
  /** Absolute URL to OG image (defaults to DEFAULT_OG_IMAGE) */
  ogImage?: string;
  /** Set to false to noindex (e.g. auth pages) */
  index?: boolean;
  /** Article publish date for blog/course pages */
  publishedTime?: string;
  /** Article modified date */
  modifiedTime?: string;
  /** "website" | "article" */
  ogType?: 'website' | 'article';
}

// ── Core metadata builder ─────────────────────────────────────────────────────
export function buildMetadata({
  title,
  description,
  keywords = [],
  path = '',
  ogImage = DEFAULT_OG_IMAGE,
  index = true,
  publishedTime,
  modifiedTime,
  ogType = 'website' as const,
}: PageSEOProps): Metadata {
  const canonical = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: [
      ...keywords,
      'adyapan', 'online courses india', 'internship program', 'placement support',
    ],
    authors: [{ name: ORGANIZATION_NAME, url: BASE_URL }],
    creator: ORGANIZATION_NAME,
    publisher: ORGANIZATION_NAME,

    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : { index: false, follow: false },

    alternates: { canonical },

    openGraph: {
      type: ogType,
      locale: 'en_IN',
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

// ── JSON-LD helpers ───────────────────────────────────────────────────────────

/** Organization schema (used in root layout) */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: ORGANIZATION_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/adyapan-logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "India's leading EdTech platform offering 65+ industry-relevant courses with live classes, real internship experience, and placement support.",
    foundingDate: '2022',
    areaServed: 'IN',
    sameAs: [
      'https://www.linkedin.com/company/adyapan',
      'https://www.instagram.com/adyapan',
      'https://twitter.com/adyapan',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8292244709',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

/** WebSite schema with SearchAction (enables Google Sitelinks Search Box) */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
    publisher: { '@id': `${BASE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/programs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList schema */
export interface BreadcrumbItem {
  name: string;
  url: string;
}
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Course schema for individual course pages */
export interface CourseSchemaProps {
  name: string;
  description: string;
  url: string;
  image: string;
  provider?: string;
  duration?: string;
  price?: string;
  category?: string;
}
export function courseSchema({
  name,
  description,
  url,
  image,
  provider = ORGANIZATION_NAME,
  duration = 'P2M',
  price = '3000',
  category = 'Technology',
}: CourseSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    image,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: BASE_URL,
    },
    timeRequired: duration,
    courseMode: ['online', 'onsite'],
    educationalLevel: 'Beginner to Advanced',
    inLanguage: 'en-IN',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Organization',
        name: provider,
      },
    },
  };
}

/** FAQ schema */
export interface FAQItem {
  question: string;
  answer: string;
}
export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Article schema for blog posts */
export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  readingTime?: number;
}
export function articleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authorName = ORGANIZATION_NAME,
  readingTime,
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/adyapan-logo.png`,
      },
    },
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/** Serialize any schema object to a safe JSON-LD string */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema);
}

// ── Reading time calculator (for blog posts) ──────────────────────────────────
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ── Slug generator ────────────────────────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
