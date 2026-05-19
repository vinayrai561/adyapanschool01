# Adyapan — Complete SEO Setup Guide

## Files Created / Modified

```
src/
├── lib/seo.ts                          ← Central SEO utility (metadata, schemas, slugs)
├── components/
│   ├── JsonLd.tsx                      ← JSON-LD script injector
│   └── Analytics.tsx                  ← GA4 + Facebook Pixel (production only)
├── app/
│   ├── layout.tsx                      ← Updated: Bing verification + Analytics
│   ├── robots.ts                       ← Updated: blocks AI bots, more routes
│   ├── sitemap.ts                      ← Updated: added jobs, contact
│   ├── (student)/
│   │   ├── page.tsx                    ← Homepage: WebSite + Org + FAQ schema
│   │   ├── about/
│   │   │   ├── page.tsx                ← Metadata + breadcrumb + org schema
│   │   │   └── AboutPageClient.tsx     ← Full about page UI
│   │   ├── contact/
│   │   │   ├── page.tsx                ← Metadata + LocalBusiness schema
│   │   │   └── ContactPageClient.tsx   ← Full contact page UI with form
│   │   ├── programs/page.tsx           ← Metadata + FAQ schema
│   │   ├── courses/[slug]/
│   │   │   ├── page.tsx                ← generateMetadata + Course schema
│   │   │   └── CoursePageClient.tsx    ← Original course page (client)
│   │   ├── gallery/page.tsx            ← Metadata + breadcrumb
│   │   ├── jobs/page.tsx               ← Metadata + ItemList schema
│   │   ├── offline-services/page.tsx   ← Metadata + FAQ schema
│   │   ├── campus-ambassador/page.tsx  ← Metadata + breadcrumb
│   │   ├── privacy/page.tsx            ← Metadata + breadcrumb
│   │   └── terms/page.tsx              ← Metadata + breadcrumb
│   └── api/
│       └── indexnow/route.ts           ← IndexNow API (POST + GET)
public/
├── browserconfig.xml                   ← Windows tile config
├── INDEXNOW_KEY_PLACEHOLDER.txt        ← Instructions for IndexNow key file
└── site.webmanifest                    ← Already existed (PWA manifest)
vercel.json                             ← Vercel headers + redirects
.env.example                            ← Updated with all SEO env vars
```

---

## Step 1 — Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="abc123..."   # from Google Search Console
NEXT_PUBLIC_BING_SITE_VERIFICATION="abc123..."     # from Bing Webmaster Tools
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"    # from Google Analytics
NEXT_PUBLIC_FB_PIXEL_ID="123456789"               # from Facebook Events Manager
INDEXNOW_KEY="your-key-here"                       # from bing.com/indexnow
INDEXNOW_SUBMIT_SECRET="random-secret-string"      # protect the API route
```

---

## Step 2 — Google Search Console

1. Go to https://search.google.com/search-console
2. Add property → Domain → enter `adyapan.com`
3. Choose **HTML tag** verification method
4. Copy the content value (e.g. `abc123xyz`)
5. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz` in your env
6. Deploy → click Verify in Search Console
7. Submit sitemap: **Sitemaps** → enter `https://adyapan.com/sitemap.xml` → Submit

---

## Step 3 — Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Add your site → enter `https://adyapan.com`
3. Choose **Meta tag** verification
4. Copy the content value
5. Set `NEXT_PUBLIC_BING_SITE_VERIFICATION=your-value` in your env
6. Deploy → click Verify

---

## Step 4 — IndexNow (Bing Instant Indexing)

1. Go to https://www.bing.com/indexnow → Get Key
2. Copy your key (e.g. `abc123def456`)
3. In `/public/`, create a file named `abc123def456.txt`
4. File content = exactly your key string (no spaces, no newlines)
5. Delete `INDEXNOW_KEY_PLACEHOLDER.txt`
6. Set `INDEXNOW_KEY=abc123def456` in your env
7. Deploy
8. Test: `GET https://adyapan.com/api/indexnow?secret=your-submit-secret`

**Auto-submit on deploy** — add this to your CI/CD pipeline after deploy:
```bash
curl -X POST https://adyapan.com/api/indexnow \
  -H "Authorization: Bearer your-submit-secret" \
  -H "Content-Type: application/json" \
  -d '{"urls": []}'
```

---

## Step 5 — Google Analytics 4

1. Go to https://analytics.google.com → Create Property
2. Copy your Measurement ID (e.g. `G-XXXXXXXXXX`)
3. Set `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`
4. Analytics loads automatically in production via `Analytics.tsx`
5. Verify: open your site → GA4 Realtime report should show 1 active user

**Track custom events** anywhere in your app:
```tsx
import { trackEvent } from '@/components/Analytics';
trackEvent({ action: 'enroll_click', category: 'Course', label: 'data-science' });
```

---

## Step 6 — Facebook Pixel

1. Go to https://business.facebook.com → Events Manager → Create Pixel
2. Copy your Pixel ID
3. Set `NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id`
4. Pixel loads automatically in production

---

## Step 7 — Open Graph Testing

Test how your pages look when shared on social media:

| Tool | URL |
|------|-----|
| Facebook Debugger | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | https://cards-dev.twitter.com/validator |
| LinkedIn Inspector | https://www.linkedin.com/post-inspector/ |
| Open Graph Check | https://www.opengraph.xyz/ |

Enter `https://adyapan.com` or any page URL. If cached, click "Scrape Again".

**Required image**: Create `/public/og-image.png` at **1200×630px**.

---

## Step 8 — Verify Sitemap

```
https://adyapan.com/sitemap.xml
```
Should return XML with all static pages + all 65+ course pages.

Validate at: https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Step 9 — Verify robots.txt

```
https://adyapan.com/robots.txt
```
Should show:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
...
Sitemap: https://adyapan.com/sitemap.xml
```

Test with Google's robots.txt tester in Search Console.

---

## Step 10 — Lighthouse Audit

Run in Chrome DevTools → Lighthouse → check all categories:
- **Performance**: target 90+
- **SEO**: target 100
- **Accessibility**: target 95+
- **Best Practices**: target 100

Or use: https://pagespeed.web.dev/ → enter `https://adyapan.com`

---

## Step 11 — Structured Data Testing

Test JSON-LD schemas at:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

Pages with rich results eligible:
| Page | Schema | Rich Result |
|------|--------|-------------|
| Homepage | FAQPage | FAQ accordion in SERP |
| Homepage | WebSite | Sitelinks search box |
| /programs | FAQPage | FAQ accordion |
| /courses/[slug] | Course | Course rich result |
| /contact | LocalBusiness | Business info panel |

---

## Step 12 — Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set env vars in Vercel dashboard:
# Project → Settings → Environment Variables
# Add all vars from .env.example
```

**Domain setup in Vercel:**
1. Project → Settings → Domains
2. Add `adyapan.com` and `www.adyapan.com`
3. www automatically redirects to non-www (configured in next.config.js)

---

## Adding SEO to New Pages

For any new page, use this pattern:

```tsx
// src/app/(student)/new-page/page.tsx
import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import NewPageClient from './NewPageClient'; // your 'use client' component

export const metadata: Metadata = buildMetadata({
  title: 'Page Title',
  description: 'Page description (150-160 chars)',
  keywords: ['keyword1', 'keyword2'],
  path: '/new-page',
});

export default function NewPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'New Page', url: `${BASE_URL}/new-page` },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <NewPageClient />
    </>
  );
}
```

---

## Blog SEO (When You Add a Blog)

Create `src/app/(student)/blog/[slug]/page.tsx`:

```tsx
import { buildMetadata, articleSchema, breadcrumbSchema, calculateReadingTime } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default function BlogPost({ params }) {
  const post = await getPost(params.slug);
  const readingTime = calculateReadingTime(post.content);
  const schema = articleSchema({
    title: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    image: post.coverImage,
    publishedTime: post.publishedAt,
    readingTime,
  });
  return (
    <>
      <JsonLd schema={schema} />
      <BlogPostClient post={post} readingTime={readingTime} />
    </>
  );
}
```

---

## Quick Reference — seo.ts Exports

| Export | Use |
|--------|-----|
| `buildMetadata(props)` | Generate full Metadata object for any page |
| `organizationSchema()` | EducationalOrganization JSON-LD |
| `websiteSchema()` | WebSite + SearchAction JSON-LD |
| `breadcrumbSchema(items)` | BreadcrumbList JSON-LD |
| `courseSchema(props)` | Course JSON-LD |
| `faqSchema(items)` | FAQPage JSON-LD |
| `articleSchema(props)` | Article JSON-LD (for blog) |
| `calculateReadingTime(text)` | Returns minutes as number |
| `generateSlug(text)` | URL-safe slug from any string |
| `BASE_URL` | `https://adyapan.com` (from env) |
