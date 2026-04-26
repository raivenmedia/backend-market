# Deployment Guide

## Production Deployment Checklist

### Backend Deployment

#### 1. Prepare Backend for Production

**Update .env for production:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace
PORT=5000
NODE_ENV=production
JWT_SECRET=generate_long_secure_string
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLIC_KEY=pk_live_your_live_key
CORS_ORIGIN=https://yourdomain.com
```

**Update package.json start script:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

#### 2. Deploy to Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=your_key
heroku config:set CORS_ORIGIN=https://your-frontend.com

# Deploy
git push heroku main
```

#### 3. Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

#### 4. Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Add environment variables
6. Deploy

### Frontend Deployment

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized production files.

#### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Configure production deployment
# Set API URL to backend URL
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://your-backend.com"
  }
}
```

#### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 4. Deploy to GitHub Pages

```bash
# Update vite.config.js
export default defineConfig({
  base: '/marketplace/',
  // ...
})

# Build
npm run build

# Deploy to gh-pages branch
npm install --save-dev gh-pages

# Add to package.json
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### Database Setup

#### MongoDB Atlas Production

1. Go to https://cloud.mongodb.com
2. Create new cluster
3. Configure security:
   - Enable authentication
   - Whitelist IP addresses
   - Create database user
4. Get connection string
5. Update backend `.env`

### SSL/TLS Certificate

#### Using Let's Encrypt (Free)

```bash
# If using Heroku
heroku certs:auto:enable -a your-app-name

# For custom domain
certbot certonly --standalone -d yourdomain.com
```

### Domain Configuration

1. Point domain to deployment platform
2. Configure DNS records:
   - A record to backend server
   - CNAME for frontend

### Security Checklist

- [ ] HTTPS enabled
- [ ] JWT secret changed
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] Environment variables not committed
- [ ] Dependencies updated
- [ ] Input validation implemented
- [ ] Rate limiting added
- [ ] Logging enabled
- [ ] Backups configured

### Performance Optimization

#### Backend
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Add request logging
const morgan = require('morgan');
app.use(morgan('combined'));

// Add caching headers
app.set('cache control', 'public, max-age=300');
```

#### Frontend
```bash
# Build with optimizations
npm run build

# Output will be in dist/
# Files are minified and optimized
```

### Monitoring & Logging

#### Backend Monitoring
- Use service like Datadog or New Relic
- Monitor error rates
- Track API response times
- Alert on failures

#### Database Monitoring
- MongoDB Atlas includes monitoring
- Set up alerts for disk usage
- Monitor connection pool

### Backup Strategy

#### Database Backups
```bash
# MongoDB Atlas automatic backups
# Set to daily automated backups

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/marketplace" --out=/path/to/backup
```

#### Code Backups
- Use GitHub for version control
- Keep multiple branches
- Tag releases

### Maintenance

#### Regular Updates
```bash
# Update dependencies
npm audit
npm update
npm install -g npm

# Test before deploying
npm test
```

#### Database Maintenance
- Monitor disk usage
- Clean up old data
- Optimize indexes
- Archive old orders

## Troubleshooting Production Issues

### High Memory Usage
```javascript
// Monitor memory
setInterval(() => {
  console.log(process.memoryUsage());
}, 60000);
```

### Database Connection Timeouts
```javascript
// Increase connection timeout
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Rate Limiting
```bash
npm install express-rate-limit

// Add to server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

## Post-Deployment

1. Test all features on production
2. Set up monitoring alerts
3. Configure backups
4. Document deployment process
5. Create disaster recovery plan
6. Set up CI/CD pipeline

## Useful Resources

- [Heroku Deployment Guide](https://devcenter.heroku.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Production Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://reactjs.org/docs/optimizing-performance.html)
