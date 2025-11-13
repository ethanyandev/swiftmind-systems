# SwiftMind Systems Corporate Website

A modern, bilingual corporate website for SwiftMind Systems Ltd., showcasing innovative SaaS and AI solutions.

## Features

- **Bilingual Support** - Seamless switching between English and Chinese
- **Responsive Design** - Optimized for all device sizes
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Product Showcase** - Dedicated sections for SkillGrove, VAMerchant, and Moodtini
- **Fast Performance** - Built with Vite for lightning-fast loading

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** JavaScript (JSX)
- **State Management:** React Context API

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yancheng0821/swiftmind-systems.git
cd swiftmind-systems/website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
website/
├── public/                 # Static assets
│   ├── logo.png           # Company logo
│   ├── skillgrove.png     # SkillGrove product image
│   ├── skillgrove-logo.png
│   ├── vamerchant.png     # VAMerchant product image
│   ├── vamerchant-logo.png
│   ├── moodtini.png       # Moodtini product image
│   └── moodtini-logo.png
├── src/
│   ├── components/        # React components
│   │   ├── About.jsx      # About Us section
│   │   ├── Footer.jsx     # Footer component
│   │   ├── Hero.jsx       # Hero section with video support
│   │   ├── LanguageSwitch.jsx  # Language toggle button
│   │   ├── Logo.jsx       # Company logo component
│   │   ├── Navbar.jsx     # Navigation bar
│   │   └── Products.jsx   # Products showcase
│   ├── contexts/          # React Context
│   │   └── LanguageContext.jsx  # Language state management
│   ├── translations.js    # Translation data (EN/ZH)
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md
```

## Features Overview

### Language Switching
The website supports bilingual content (English/Chinese) with a toggle button in the navigation bar. The default language is English.

### Product Showcase
Three products are featured:
- **SkillGrove** - Online education platform ([skillgrove.ca](https://skillgrove.ca))
- **VAMerchant** - Service provider management system ([vamerchant.app](https://vamerchant.app))
- **Moodtini** - AI-powered cocktail recommendation app (In Development)

### YouTube Video Integration
The Hero section supports YouTube video embedding. To add a video:
1. Open `src/components/Hero.jsx`
2. Set the `youtubeVideoId` variable to your YouTube video ID

```javascript
const youtubeVideoId = 'YOUR_VIDEO_ID' // e.g., 'dQw4w9WgXcQ'
```

## Adding Translations

To add or modify translations, edit `src/translations.js`:

```javascript
export const translations = {
  navbar: {
    home: { zh: '首页', en: 'Home' },
    // Add more translations...
  }
}
```

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The optimized files will be in the `dist/` directory

3. Deploy the `dist/` folder to your hosting service

## Deployment

### AWS Amplify (Recommended) ⭐

For production deployment with custom domain, we recommend AWS Amplify:
- ✅ Automatic builds from GitHub
- ✅ Global CDN
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ Continuous deployment

**📖 [Complete AWS Amplify Deployment Guide](./DEPLOYMENT.md)**

### Alternative Options

This project can also be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2025 SwiftMind Systems Ltd. All rights reserved.

## Contact

- **Email:** info@swiftmindsystems.com
- **Phone:** +1 (250) 686-9867
- **Location:** Canada

---

Built with ❤️ by SwiftMind Systems
