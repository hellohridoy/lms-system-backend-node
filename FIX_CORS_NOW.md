# 🔥 Fix CORS Error - Action Required

## ⚠️ CRITICAL: Update Your Backend URL

I've fixed the CORS configuration, but you need to update one file with your actual Render backend URL.

### Find Your Render Backend URL

1. Go to: https://dashboard.render.com/web/srv-d6b9rkoboq4c73fgrcgg
2. Look for the URL at the top (something like: `https://library-management-xyz.onrender.com`)
3. Copy that URL

### Update Frontend Configuration

Open: `frontend/src/environments/environment.prod.ts`

Replace this line:
```typescript
apiUrl: 'https://library-management-system-backend.onrender.com/api'
```

With your actual Render URL:
```typescript
apiUrl: 'https://YOUR-ACTUAL-URL.onrender.com/api'
```

## 🚀 Deploy Changes

### 1. Commit and Push
```bash
git add .
git commit -m "Fix CORS and update production API URL"
git push origin main
```

### 2. Wait for Auto-Deploy
- **Render**: Will auto-deploy backend (2-3 minutes)
- **Vercel**: Will auto-deploy frontend (1-2 minutes)

### 3. Verify Deployments

**Check Backend:**
```bash
# Replace with your actual URL
curl https://your-backend.onrender.com/api/books
```
Should return JSON (empty array or list of books)

**Check Frontend:**
1. Open: https://librarymanagementsystem-eight.vercel.app
2. Open browser console (F12)
3. Try to login/register
4. Should see NO CORS errors

## ✅ What I Fixed

1. ✅ Updated backend CORS to allow your Vercel domain
2. ✅ Configured proper CORS headers
3. ✅ Fixed production start script
4. ✅ Created environment variable template

## 🎯 Expected Result

After deploying:
- ✅ No CORS errors in browser console
- ✅ Login/signup works
- ✅ API calls return data
- ✅ Network tab shows 200 OK responses

## 🐛 If Still Not Working

### Check 1: Backend Environment Variables on Render
Make sure these are set:
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET` ← **MUST BE SET!**
- `PORT=8080`

### Check 2: Backend Logs
1. Go to Render dashboard
2. Click "Logs"
3. Look for errors

### Check 3: Database Connection
- Ensure database is running
- Verify credentials are correct
- Check if database allows external connections

## 📞 Quick Test

After deploying, test with curl:

```bash
# Test backend health
curl https://your-backend.onrender.com/api/books/genres

# Test signup (should work)
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User"
  }'
```

## 🎉 Success Indicators

You'll know it's working when:
1. Backend URL returns JSON (not error page)
2. Frontend loads without console errors
3. You can register a new user
4. You can login successfully
5. Dashboard loads with data

---

**Need Help?** Check the detailed guides:
- `DEPLOYMENT.md` - Full deployment guide
- `QUICK_FIX.md` - Troubleshooting steps
- `backend-node/RENDER_SETUP.md` - Render-specific setup
