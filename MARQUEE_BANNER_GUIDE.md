# MarqueeBanner Component Guide

## Overview

The `MarqueeBanner` component is a modern, premium animated marquee banner that displays **"INDIA'S LARGEST STUDENT COMMUNITY"** (or custom text) in a continuous smooth loop across the screen.

## Features

✅ **Smooth infinite loop** — No jerky animation, seamless repeat  
✅ **Three visual variants** — Dark, Orange, Glass  
✅ **Fully responsive** — Adapts text size from mobile to desktop  
✅ **Pause on hover** — Desktop users can pause to read  
✅ **Respects reduced motion** — Accessibility-friendly  
✅ **Premium design** — Gradient text, glow effects, separator icons  
✅ **Lightweight** — Pure CSS + Framer Motion, no heavy dependencies  

---

## Usage

### Basic Usage

```tsx
import MarqueeBanner from '@/components/MarqueeBanner';

export default function MyPage() {
  return (
    <div>
      <MarqueeBanner />
    </div>
  );
}
```

### With Props

```tsx
<MarqueeBanner 
  text="CUSTOM MESSAGE HERE"
  variant="orange"
  speed={25}
/>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"INDIA'S LARGEST STUDENT COMMUNITY"` | The text to display in the marquee |
| `speed` | `number` | `30` | Animation duration in seconds (lower = faster) |
| `variant` | `'dark' \| 'orange' \| 'glass'` | `'dark'` | Visual style variant |

---

## Variants

### 1. **Dark** (default)
- Dark gradient background (`#0d0d1a` → `#1a1a2e`)
- White-to-orange gradient text
- Subtle orange glow
- **Best for:** General sections, between content blocks

```tsx
<MarqueeBanner variant="dark" />
```

### 2. **Orange**
- Vibrant orange gradient background (`#ff8c00` → `#ff6b00`)
- White-to-gold gradient text
- Strong visual impact
- **Best for:** Hero sections, major announcements, high-energy areas

```tsx
<MarqueeBanner variant="orange" />
```

### 3. **Glass**
- Glassmorphism effect with backdrop blur
- Semi-transparent dark background
- Orange accent borders
- **Best for:** Overlaying content, modern aesthetic, footer areas

```tsx
<MarqueeBanner variant="glass" />
```

---

## Current Placements

The marquee has been strategically placed in the following locations:

### Homepage (`src/app/page.tsx`)
1. **After HeroSection** — Dark variant, speed 28s
2. **After AddOnsSection** — Orange variant, speed 32s
3. **Before CertificateShowcaseSection** — Glass variant, speed 26s

### About Page (`src/app/about/page.tsx`)
- **After Hero Section** — Dark variant, speed 30s

### Campus Ambassador Page (`src/app/campus-ambassador/page.tsx`)
- **After Hero Section** — Orange variant, speed 30s

### Footer (`src/components/Footer.tsx`)
- **Before Footer Content** — Glass variant, speed 28s

---

## Customization Examples

### Faster Animation
```tsx
<MarqueeBanner speed={20} />
```

### Slower Animation
```tsx
<MarqueeBanner speed={40} />
```

### Custom Message
```tsx
<MarqueeBanner text="JOIN 20,000+ STUDENTS TODAY" />
```

### Multiple Variants on Same Page
```tsx
<MarqueeBanner variant="dark" speed={28} />
{/* ... content ... */}
<MarqueeBanner variant="orange" speed={32} />
{/* ... content ... */}
<MarqueeBanner variant="glass" speed={26} />
```

---

## Accessibility

- ✅ **Semantic HTML** — Uses `role="marquee"` and `aria-label`
- ✅ **Reduced Motion** — Respects `prefers-reduced-motion` preference
- ✅ **Keyboard Navigation** — No interactive elements, purely decorative
- ✅ **Screen Readers** — Text is announced via `aria-label`

---

## Performance

- **Lightweight** — ~150 lines of code
- **GPU-accelerated** — Uses CSS transforms for smooth 60fps animation
- **No layout shift** — Fixed height, no CLS issues
- **Optimized** — `will-change: transform` for better rendering

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Design Guidelines

### ✅ **DO USE** in:
- Hero sections
- Between major content sections
- Before/after testimonials
- Top of footer
- Landing pages
- Campaign pages

### ❌ **DON'T USE** in:
- Forms (distracting)
- Dashboards (too busy)
- Payment pages (reduces trust)
- Certificate pages (unprofessional)
- Login/signup pages (focus killer)

---

## Troubleshooting

### Animation not smooth?
- Ensure `framer-motion` is installed: `npm install framer-motion`
- Check browser GPU acceleration is enabled

### Text too small/large?
- The component uses responsive text sizing via Tailwind classes
- Modify the `text-sm sm:text-base md:text-lg lg:text-xl` classes in the component

### Want different colors?
- Edit the `getBgStyle()` and `textStyle` in `src/components/MarqueeBanner.tsx`
- Or create a new variant by extending the `variant` prop type

---

## Technical Details

### Animation Technique
- Uses Framer Motion's `animate` prop with `x: ['0%', '-50%']`
- Duplicates text 8 times to ensure seamless loop at any viewport width
- Left/right fade masks hide the loop seam

### CSS Keyframes Fallback
- A CSS-only fallback is available in `globals.css` (`.marquee-track`)
- Automatically pauses on hover via CSS `:hover` pseudo-class

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Add vertical marquee option
- [ ] Support for custom separator icons
- [ ] Multiple text items with different colors
- [ ] Auto-adjust speed based on text length
- [ ] RTL (right-to-left) language support

---

## Credits

- **Design**: Adyapan orange/black/white theme
- **Animation**: Framer Motion + CSS transforms
- **Icons**: Unicode decorative characters (✦)

---

## Questions?

For issues or feature requests, contact the development team or open an issue in the project repository.

**Happy marquee-ing! 🎉**
