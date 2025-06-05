# ONAI Marketing Website

A modern, dark-themed marketing website for ONAI - AI-Powered Note Taking & Knowledge Management platform.

![ONAI Marketing Website](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## 🌟 Features

- **Modern Dark Theme** - Professional minimalistic design
- **Responsive Design** - Works perfectly on all devices
- **AI-Powered Branding** - Professional logo and visual identity
- **Performance Optimized** - Fast loading and smooth animations
- **SEO Ready** - Optimized for search engines
- **Conversion Focused** - Designed to convert visitors to customers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/onai-marketing-website.git

# Navigate to project directory
cd onai-marketing-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at `http://localhost:5173`

## 📁 Project Structure

```
onai-marketing-website/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── Header.jsx    # Navigation header
│   │   ├── Hero.jsx      # Hero section
│   │   ├── Features.jsx  # Features showcase
│   │   ├── Pricing.jsx   # Pricing plans
│   │   ├── Testimonials.jsx # Customer testimonials
│   │   ├── Footer.jsx    # Site footer
│   │   ├── SignupPage.jsx # User registration
│   │   ├── LoginPage.jsx # User login
│   │   └── ContactPage.jsx # Contact form
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md            # This file
```

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradients
- **Background**: Dark gray (gray-900)
- **Text**: White and gray-300
- **Accents**: Cyan, green, orange

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts
- **Hierarchy**: Clear size and weight differences

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Semi-transparent with subtle borders
- **Navigation**: Sticky header with backdrop blur

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Deploy to production
```

## 📦 Dependencies

### Core
- **React 19** - Modern React with latest features
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Components
- **Shadcn/UI** - High-quality UI components
- **Radix UI** - Accessible component primitives

## 🌐 Deployment

### Automatic Deployment
The site is configured for automatic deployment on push to main branch.

### Manual Deployment
```bash
npm run build
npm run deploy
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
VITE_API_URL=https://api.onai.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## 🔧 Configuration

### Tailwind CSS
Customized for ONAI branding with:
- Custom color palette
- Extended spacing scale
- Custom animations
- Dark theme optimizations

### Vite
Optimized build configuration with:
- Fast HMR (Hot Module Replacement)
- Optimized bundle splitting
- Asset optimization

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔗 Links

- **Live Website**: [https://onai.com](https://onai.com)
- **Documentation**: [https://docs.onai.com](https://docs.onai.com)
- **Support**: [support@onai.com](mailto:support@onai.com)

## 📞 Support

For support, email support@onai.com or join our Discord community.

---

Made with ❤️ by the ONAI Team

