# ChairStudio AI — SaaS Landing Page

A high-conversion SaaS-style landing page for an AI-powered workspace design platform. Built with semantic HTML5, modular CSS, and vanilla JavaScript — no frameworks or build tools.

**Live demo:** [https://ahmedalmadhji.github.io/Template-Zero_/](https://ahmedalmadhji.github.io/Template-Zero_/)

## Product Positioning

Repositioned from a furniture showcase into **ChairStudio AI** — a smart workspace / interior design platform focused on:

- AI layout generation
- Productivity insights
- Team collaboration
- Lead generation via early access waitlist

## Conversion Features

- Dual CTA hero with trust indicators
- 5 SaaS feature cards
- Social proof (logos, metrics, testimonials)
- 3-tier pricing table (Pro plan highlighted)
- Early access lead form with loading UX
- Sticky CTA on scroll (desktop)
- Toast notifications
- Mock analytics (`console.log`)

## Project Structure

```
Template-Zero_/
├── index.html
├── css/
│   ├── main.css          # Entry point (@imports layers)
│   ├── base.css          # Reset, tokens, typography
│   ├── layout.css        # Nav, sections, grids, responsive
│   └── components.css    # Buttons, cards, pricing, forms, toasts
├── js/
│   └── main.js           # Scroll effects, form, analytics
└── images/
    ├── logo.svg
    └── icon-*.svg        # Feature icons
```

## Getting Started

```bash
python -m http.server 8080
# or
npx serve .
```

## Browser Support

Modern evergreen browsers. CSS Grid, `backdrop-filter`, and Intersection-free scroll tracking via scroll events.

## License

© 2024 ChairStudio AI. Built by [Ahmed Raed](https://github.com/AhmedAlMadhji).
