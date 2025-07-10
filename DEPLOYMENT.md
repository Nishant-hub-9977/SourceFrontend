# 🚀 RecruitAI Frontend Deployment Guide

This guide provides step-by-step instructions for deploying the RecruitAI frontend to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Backend API is running at `https://cleanfilesbackend.onrender.com`
- [ ] All environment variables are configured
- [ ] Application has been tested locally
- [ ] Production build has been created and tested

## 🌐 Deployment Options

### Option 1: Netlify (Recommended for Frontend)

**Advantages:**
- Free tier available
- Automatic deployments from Git
- Built-in CDN
- Easy custom domain setup

**Steps:**

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist/` folder to the deployment area
   - Your site will be live instantly

3. **Deploy via Git (Recommended)**
   - Connect your GitHub repository
   - Set build command: `pnpm run build`
   - Set publish directory: `dist`
   - Enable automatic deployments

### Option 2: Vercel

**Advantages:**
- Excellent performance
- Automatic deployments
- Built-in analytics
- Edge functions support

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure via Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings if needed

### Option 3: GitHub Pages

**Advantages:**
- Free hosting
- Integrated with GitHub
- Good for open source projects

**Steps:**

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

### Option 4: AWS S3 + CloudFront

**Advantages:**
- Highly scalable
- Global CDN
- Professional hosting
- Custom domain support

**Steps:**

1. **Create S3 bucket**
   - Enable static website hosting
   - Configure bucket policy for public access

2. **Upload build files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Configure custom error pages for SPA routing

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://cleanfilesbackend.onrender.com
VITE_APP_NAME=RecruitAI
VITE_APP_VERSION=1.0.0
```

### Build Configuration

Update `vite.config.js` for production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
```

## 🔒 Security Considerations

### HTTPS Configuration

Ensure your deployment platform serves content over HTTPS:

- **Netlify**: Automatic HTTPS
- **Vercel**: Automatic HTTPS
- **GitHub Pages**: Automatic HTTPS
- **AWS**: Configure SSL certificate in CloudFront

### Content Security Policy

Add CSP headers for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://cleanfilesbackend.onrender.com;
">
```

## 🚀 Performance Optimization

### Build Optimization

1. **Enable compression**
   ```bash
   # Gzip compression is usually handled by the hosting platform
   ```

2. **Optimize images**
   - Use WebP format when possible
   - Implement lazy loading
   - Compress images before deployment

3. **Code splitting**
   - Already configured in Vite
   - Lazy load routes if needed

### CDN Configuration

Configure caching headers:

```
# Netlify _headers file
/*
  Cache-Control: public, max-age=31536000
  
/*.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🐛 Troubleshooting

### Common Issues

1. **404 errors on refresh**
   - Configure SPA fallback to `index.html`
   - Add `_redirects` file for Netlify:
     ```
     /*    /index.html   200
     ```

2. **API connection issues**
   - Verify backend URL in `src/lib/api.js`
   - Check CORS configuration on backend
   - Ensure HTTPS is used for API calls

3. **Build failures**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

### Performance Issues

1. **Slow loading**
   - Enable compression on hosting platform
   - Optimize images and assets
   - Use CDN for static assets

2. **Large bundle size**
   - Analyze bundle with `pnpm run build --analyze`
   - Implement code splitting
   - Remove unused dependencies

## 📊 Monitoring

### Analytics Setup

Add Google Analytics or similar:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Monitoring

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Hotjar** for user behavior analysis

## 🔄 Updates and Maintenance

### Regular Updates

1. **Dependencies**
   ```bash
   pnpm update
   ```

2. **Security patches**
   ```bash
   pnpm audit
   pnpm audit fix
   ```

3. **Performance monitoring**
   - Use Lighthouse for performance audits
   - Monitor Core Web Vitals
   - Check bundle size regularly

### Backup Strategy

- Keep source code in version control
- Regular database backups (if applicable)
- Document deployment configurations

---

**Need help?** Contact the development team or check the main README.md for support information.

