# ONAI Notes Application

The core note-taking application with AI-powered features.

## 🚀 Features

- **Rich Text Editor** - Advanced Tiptap editor with markdown support
- **AI Integration** - Smart suggestions and content generation
- **Custom Themes** - Dark/light themes with customizable colors
- **Focus Mode** - Distraction-free writing environment
- **Universal Search** - Find anything instantly across all notes
- **Template System** - Pre-built templates for different note types
- **Real-time Stats** - Word count, character count, reading time
- **Responsive Design** - Works perfectly on all devices

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **Tiptap** - Extensible rich text editor
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Local Storage** - Client-side data persistence

## 🚀 Quick Start

```bash
cd apps/notes-app
npm install
npm run dev
```

## 📱 Live Demo

**URL:** https://zissztag.manus.space

## 🎨 Customization

### Themes
The app supports custom themes that can be configured in `src/components/ui/ThemeSelector.jsx`

### Templates
Add new note templates in `src/components/templates/`

### Editor Extensions
Extend the Tiptap editor in `src/components/editor/TiptapEditor.jsx`

## 📦 Build & Deploy

```bash
npm run build    # Creates dist/ folder
npm run preview  # Preview production build
```

## 🔧 Configuration

Create `.env` file:
```env
VITE_APP_NAME=ONAI Notes
VITE_API_URL=https://api.onai.com
```

