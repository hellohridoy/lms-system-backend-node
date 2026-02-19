# Render Backend Setup Guide

## 🚀 Deploy to Render

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Service

**Basic Settings:**
- Name: `library-management-backend` (or your choice)
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: `backend-node`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### Step 3: Environment Variables

Click "Advanced" and add these environment variables:

```
DB_HOST=<your-postgres-host>
DB_PORT=5432
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
JWT_SECRET=<generate-a-strong-random-string>
JWT_EXPIRATION_MS=86400000
PORT=8080
```

**To generate JWT_SECRET**, run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Database Setup

**Option A: Use Render PostgreSQL (Recommended)**
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Create database
3. Copy connection details to environment variables above

**Option B: Use External PostgreSQL**
1. Use your existing PostgreSQL instance
2. Ensure it allows connections from Render IPs
3. Add connection details to environment variables

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Check logs for any errors

### Step 6: Verify Deployment

Your backend URL will be: `https://your-service-name.onrender.com`

Test it:
```bash
# Should return empty array or list of books
curl https://your-service-name.onrender.com/api/books

# Should return list of genres
curl https://your-service-name.onrender.com/api/books/genres
```

### Step 7: Update Frontend

Copy your Render URL and update `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
    production: true,
    apiUrl: 'https://your-service-name.onrender.com/api'
};
```

## 🔧 Troubleshooting

### Deployment Failed

**Check Build Logs:**
- Look for npm install errors
- Look for TypeScript compilation errors
- Ensure all dependencies are in `package.json`

**Common Issues:**
- Missing environment variables
- Database connection failed
- Port already in use (shouldn't happen on Render)

### Service Starts But Crashes

**Check Runtime Logs:**
- Look for "Data Source initialization" errors
- Check database credentials
- Verify database is accessible

### CORS Errors Persist

1. Verify your Vercel URL is in `allowedOrigins` array
2. Redeploy backend after making changes
3. Clear browser cache
4. Check browser console for exact error message

## 📊 Monitoring

### View Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. Monitor real-time logs

### Check Metrics
1. Click "Metrics" tab
2. Monitor CPU, Memory, Response times

### Set Up Alerts
1. Click "Settings"
2. Configure email alerts for downtime

## 🔄 Updating Your Backend

```bash
# Make changes to code
git add .
git commit -m "Your changes"
git push origin main

# Render will automatically deploy
# Check logs to verify deployment
```

## 💡 Tips

1. **Free Tier Limitations:**
   - Service spins down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds
   - Consider upgrading for production use

2. **Database Backups:**
   - Render PostgreSQL includes automatic backups
   - Download backups regularly for safety

3. **Environment Variables:**
   - Never commit `.env` file to git
   - Use Render dashboard to manage secrets
   - Rotate JWT_SECRET periodically

4. **Performance:**
   - Enable HTTP/2
   - Use connection pooling for database
   - Monitor response times

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] CORS only allows your frontend domain
- [ ] Environment variables are not in code
- [ ] Database has SSL enabled
- [ ] Regular security updates applied
