# 📋 Deployment Checklist

## Before You Deploy

### Backend Preparation
- [ ] All code changes committed
- [ ] `.env.example` file exists (don't commit actual `.env`)
- [ ] `package.json` has correct start script
- [ ] CORS configuration includes your Vercel domain
- [ ] Health check endpoint added

### Frontend Preparation
- [ ] `environment.prod.ts` has correct backend URL
- [ ] All code changes committed
- [ ] Build succeeds locally (`npm run build`)

## Render Backend Deployment

### Initial Setup (First Time Only)
- [ ] Create PostgreSQL database on Render
- [ ] Note down database credentials
- [ ] Create Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend-node`

### Configuration
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `DB_HOST`
  - [ ] `DB_PORT=5432`
  - [ ] `DB_USERNAME`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
  - [ ] `JWT_EXPIRATION_MS=86400000`
  - [ ] `PORT=8080`

### Deploy
- [ ] Click "Create Web Service" or "Manual Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check logs for errors
- [ ] Note your backend URL (e.g., `https://xyz.onrender.com`)

### Verify Backend
- [ ] Visit `https://your-backend.onrender.com/health` - should return JSON
- [ ] Visit `https://your-backend.onrender.com/api/books` - should return array
- [ ] No errors in Render logs

## Vercel Frontend Deployment

### Initial Setup (First Time Only)
- [ ] Import project from GitHub
- [ ] Set framework preset to "Angular"
- [ ] Set root directory to `frontend`

### Configuration
- [ ] Update `frontend/src/environments/environment.prod.ts` with Render URL
- [ ] Commit and push changes
- [ ] Build command: `npm install && npm run build`
- [ ] Output directory: `dist/library-ui/browser`

### Deploy
- [ ] Push to GitHub (Vercel auto-deploys)
- [ ] Wait for build to complete (1-3 minutes)
- [ ] Check deployment logs for errors

### Verify Frontend
- [ ] Visit your Vercel URL
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab - no CORS errors
- [ ] Check Network tab - API calls succeed

## Testing

### Smoke Tests
- [ ] Homepage loads
- [ ] Can navigate to login page
- [ ] Can navigate to register page
- [ ] No console errors

### Authentication Tests
- [ ] Can register new user
- [ ] Receives success message
- [ ] Can login with new credentials
- [ ] JWT token stored in localStorage
- [ ] Redirected to dashboard after login

### API Tests
- [ ] Dashboard loads data
- [ ] Can view book catalog
- [ ] Can search books
- [ ] Can filter by genre
- [ ] API calls return 200 status

### Authorization Tests
- [ ] Member can request books
- [ ] Member cannot access admin pages
- [ ] Logout works correctly

## Post-Deployment

### Monitoring
- [ ] Set up Render email alerts
- [ ] Bookmark Render logs page
- [ ] Bookmark Vercel deployment page
- [ ] Test from different devices/browsers

### Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment issues encountered
- [ ] Share credentials with team (securely)

### Security
- [ ] Verify HTTPS is enabled (automatic)
- [ ] Check CORS only allows your domain
- [ ] Confirm JWT_SECRET is strong
- [ ] Database password is strong
- [ ] No secrets in git repository

## Troubleshooting

### Backend Issues
- [ ] Check Render logs for errors
- [ ] Verify database connection
- [ ] Test health endpoint
- [ ] Verify environment variables
- [ ] Check build logs

### Frontend Issues
- [ ] Check Vercel deployment logs
- [ ] Verify API URL in environment.prod.ts
- [ ] Check browser console for errors
- [ ] Clear browser cache
- [ ] Test in incognito mode

### CORS Issues
- [ ] Verify Vercel URL in backend CORS config
- [ ] Redeploy backend after CORS changes
- [ ] Check exact error message in console
- [ ] Test with curl/Postman

## Rollback Plan

### If Backend Fails
1. Check previous deployment in Render
2. Click "Rollback" to previous version
3. Investigate logs
4. Fix issue locally
5. Redeploy

### If Frontend Fails
1. Check previous deployment in Vercel
2. Click "Redeploy" on working version
3. Investigate build logs
4. Fix issue locally
5. Redeploy

## Success Criteria

✅ All checks passed when:
- Backend health endpoint returns 200
- Frontend loads without errors
- Users can register and login
- API calls succeed
- No CORS errors
- Dashboard displays data
- All features work as expected

## Next Steps After Successful Deployment

- [ ] Test all major features
- [ ] Create test user accounts
- [ ] Seed database with sample data
- [ ] Share URLs with stakeholders
- [ ] Monitor for 24 hours
- [ ] Set up automated backups
- [ ] Plan for scaling if needed

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Backend URL**: _________________

**Frontend URL**: _________________

**Notes**: _________________
