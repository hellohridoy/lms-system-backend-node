# Deployment Guide

## ✅ Pre-Deployment Checklist

### Backend (Render)

1. **Environment Variables** - Set these in Render dashboard:
   ```
   DB_HOST=<your-postgres-host>
   DB_PORT=5432
   DB_USERNAME=<your-db-username>
   DB_PASSWORD=<your-db-password>
   DB_NAME=<your-db-name>
   JWT_SECRET=<generate-a-strong-secret>
   PORT=8080
   ```

2. **Build Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/index.js`
   - Root Directory: `backend-node`

3. **Database**: Create a PostgreSQL database on Render or use external provider

### Frontend (Vercel)

1. **Update API URL** in `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
       production: true,
       apiUrl: 'https://your-backend-url.onrender.com/api'
   };
   ```

2. **Build Settings**:
   - Framework Preset: Angular
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist/library-ui/browser`

## 🔧 Fixing CORS Issues

### Issue: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: Update backend CORS configuration in `backend-node/src/index.ts`

Add your Vercel domain to the `allowedOrigins` array:

```typescript
const allowedOrigins = [
    'http://localhost:4200',
    'https://your-app.vercel.app',  // Add your Vercel URL here
];
```

### After Making Changes:

1. **Backend**: 
   - Commit and push changes
   - Render will auto-deploy
   - Wait for deployment to complete (~2-3 minutes)

2. **Frontend**:
   - Commit and push changes
   - Vercel will auto-deploy
   - Wait for deployment to complete (~1-2 minutes)

## 🧪 Testing Deployment

1. Open your frontend URL
2. Try to register a new user
3. Try to login
4. Check browser console for errors
5. Check Network tab to verify API calls are successful

## 🐛 Common Issues

### 1. CORS Error
- **Symptom**: "blocked by CORS policy" in console
- **Fix**: Add your frontend domain to backend CORS config

### 2. 404 on API Calls
- **Symptom**: All API calls return 404
- **Fix**: Check `environment.prod.ts` has correct backend URL

### 3. Database Connection Failed
- **Symptom**: Backend logs show "Error during Data Source initialization"
- **Fix**: Verify database credentials in Render environment variables

### 4. JWT Token Invalid
- **Symptom**: "Unauthorized" errors after login
- **Fix**: Ensure JWT_SECRET is set in backend environment variables

## 📊 Monitoring

### Backend Logs (Render)
- Go to your service dashboard
- Click "Logs" tab
- Monitor for errors

### Frontend Logs (Vercel)
- Go to your deployment
- Click "Functions" tab
- Check for build/runtime errors

## 🔄 Redeploying

### Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] CORS only allows trusted domains
- [ ] Environment variables are not committed to git
- [ ] HTTPS is enabled (automatic on Vercel/Render)

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs on Render
3. Verify all environment variables are set
4. Ensure database is accessible from Render
