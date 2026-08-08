# Vicky Farmhouse

A responsive single-page website for Vicky Farmhouse in Gadap Town, Karachi. It presents the venue, facilities, booking packages, gallery, rules, location, and direct WhatsApp booking options.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Framer Motion for animations
- Lucide React for icons

## Main sections

The homepage is assembled in `app/page.tsx` from components in `components/`:

- Header and hero
- About and promotional video
- Facilities and pricing packages
- Image gallery
- Terms and conditions
- Location, contact details, and footer

Static images and the promotional video are stored in `public/`. Global styles live in `styles/globals.css`.

## Local setup

### Requirements

- Node.js 20.9 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

This project currently requires no environment variables.

## Commands

| Command Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production build |

## Project structure

```text
app/                 Next.js layout and homepage
animations/          Reusable Framer Motion animation variants
components/          Page sections and interactive UI
data/                Typed facilities, pricing, gallery, and terms content
lib/                 Shared site links and contact information
public/              Images, logo, and promotional video
styles/              Global CSS
next.config.js       Next.js configuration
postcss.config.js    Tailwind/PostCSS configuration
eslint.config.mjs    ESLint configuration
tailwind.config.js   Tailwind theme configuration
tsconfig.json        TypeScript configuration
```

## Updating content

- Change section text and links inside the relevant file in `components/`.
- Update packages and prices in `data/pricing.ts`.
- Update facilities, gallery items, and policies in the matching file under `data/`.
- Update navigation and contact details in `lib/site.ts`.
- Add or replace media in `public/`, then update its `/filename.ext` reference in the component.
- Update page title, description, and icons in `app/layout.tsx`.

## Production

```bash
npm run build
npm start
```

The site can also be deployed to any hosting platform that supports Next.js, such as Vercel.
