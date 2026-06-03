# Vickey Farmhouse - Landing Page

A modern, responsive landing page built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**.

## Features

- ✅ **Modern Design**: Clean and professional landing page layout
- ✅ **Fully Responsive**: Mobile-first responsive design
- ✅ **TypeScript Support**: Type-safe development
- ✅ **Tailwind CSS**: Utility-first CSS framework
- ✅ **Optimized Performance**: Next.js optimizations built-in
- ✅ **SEO Ready**: Proper metadata and structured markup
- ✅ **ESLint Configured**: Code quality tools included

## Project Structure

```
VickeyFarmhouse/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── Header/              # Header component
│   ├── Hero/                # Hero section component
│   └── Footer/              # Footer component
├── public/                  # Static assets
├── styles/                  # Global stylesheet
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── postcss.config.js       # PostCSS configuration
```

## Getting Started

### Prerequisites

- **Node.js**: v16.8 or later
- **npm** or **yarn** package manager

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open in browser**:
Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Customization

### Colors
Edit `tailwind.config.js` to customize colors and theme:
```js
theme: {
  extend: {
    colors: {
      primary: '#1f2937',
      secondary: '#059669',
    },
  },
}
```

### Components
- **Header**: Located in `components/Header/Header.tsx`
- **Hero Section**: Located in `components/Hero/Hero.tsx`
- **Footer**: Located in `components/Footer/Footer.tsx`

Edit these files to customize content and styling.

### Global Styles
All global styles are in `styles/globals.css`. Custom utility classes are already defined.

## Components Overview

### Header Component
- Responsive navigation menu
- Mobile hamburger menu
- CTA button
- Sticky positioning

### Hero Component
- Eye-catching headline
- Feature cards
- Call-to-action buttons
- Gradient background

### Footer Component
- Multiple columns layout
- Quick links
- Contact information
- Copyright notice

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

### Deploy to Other Platforms

The project can be deployed to any platform supporting Node.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Heroku
- etc.

Build command: `npm run build`
Start command: `npm start`

## Environment Variables

Create a `.env.local` file in the root directory (if needed):

```env
# Example variables
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ESLint** - Code quality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images
- Code splitting
- CSS optimization
- Bundle analysis ready

## Best Practices

- ✅ Clean, readable code
- ✅ Component-based architecture
- ✅ Type-safe with TypeScript
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ SEO optimized

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue or contact support.

---

**Happy coding! 🚀**
