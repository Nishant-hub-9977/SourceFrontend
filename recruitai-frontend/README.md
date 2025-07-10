# 🚀 RecruitAI Frontend

A modern, AI-powered recruitment platform frontend built with React, Tailwind CSS, and shadcn/ui components. This application provides a beautiful, responsive interface for managing recruitment processes with AI-powered features.

## ✨ Features

- **🎨 Modern UI/UX**: Professional design with teal/blue color scheme
- **🔐 Authentication**: Complete login/register system with JWT tokens
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🤖 AI Integration**: Ready for backend AI features integration
- **⚡ Fast Performance**: Built with Vite for optimal loading speeds
- **🛡️ Type Safety**: Modern React with hooks and context API
- **🎯 SEO Optimized**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **Lucide Icons** - Beautiful icon library
- **Context API** - State management for authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recruitai-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
recruitai-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── lib/              # Utility functions
│   │   └── api.js        # API integration
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── App.jsx           # Main app component
│   ├── App.css           # Global styles
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### Backend Integration

The frontend is configured to connect to the RecruitAI backend at:
```
https://cleanfilesbackend.onrender.com
```

To change the backend URL, update the `API_BASE_URL` in `src/lib/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_BASE_URL=https://cleanfilesbackend.onrender.com
VITE_APP_NAME=RecruitAI
```

## 🎨 Design System

### Color Palette

- **Primary**: Teal (#20B2AA, #4FD1C7)
- **Secondary**: Blue (#1E40AF, #3B82F6)
- **Background**: Light blue/cyan gradient
- **Text**: Dark gray/black
- **Success**: Green (#10B981)

### Typography

- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable sans-serif
- **Consistent sizing**: Large hero text, medium headers, standard body

## 🔐 Authentication

The app includes a complete authentication system:

- **Login**: Email/password authentication
- **Register**: User registration with company details
- **Protected Routes**: Dashboard and other authenticated pages
- **JWT Tokens**: Secure token-based authentication
- **Auto-refresh**: Automatic token refresh handling

### Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: admin@recruitai.com / password123
- **Recruiter**: recruiter@recruitai.com / password123
- **Candidate**: candidate@recruitai.com / password123

## 📱 Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- How it works section
- Customer testimonials
- Pricing information

### Login Page (`/login`)
- Clean, professional login form
- Password visibility toggle
- Demo credentials display
- Links to registration and home

### Register Page (`/register`)
- Comprehensive registration form
- Password confirmation
- Company information
- Form validation

### Dashboard Page (`/dashboard`)
- Protected route requiring authentication
- Stats overview
- Quick actions
- Recent activity
- AI insights

## 🚀 Deployment

### Build for Production

```bash
pnpm run build
# or
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Netlify

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist/` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   pnpm run build
   pnpm run deploy
   ```

## 🔧 Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Code Style

- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (recommended)
- **Tailwind CSS**: Utility-first styling approach

### Adding New Components

1. Create component in `src/components/`
2. Use shadcn/ui components when possible
3. Follow existing naming conventions
4. Add proper TypeScript types if converting to TS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@recruitai.com
- **Documentation**: [docs.recruitai.com](https://docs.recruitai.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/recruitai-frontend/issues)

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Lucide** for icon library
- **Vite** for fast development experience

---

**Built with ❤️ by the RecruitAI Team**

