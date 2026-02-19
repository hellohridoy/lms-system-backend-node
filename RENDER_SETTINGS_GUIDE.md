# 📋 Render Settings Configuration Guide

## 🎯 Quick Fix Steps

### Step 1: Go to Render Dashboard
Open: https://dashboard.render.com/web/srv-d6b9rkoboq4c73fgrcgg

### Step 2: Update Build Settings

Click **"Settings"** in the left sidebar

Scroll to **"Build & Deploy"** section

Update these fields:

```
┌─────────────────────────────────────────────────────────┐
│ Root Directory                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ backend-node                                        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Build Command                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ npm install && npm run build                        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Start Command                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ npm start                                           │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Click **"Save Changes"** at the bottom

### Step 3: Verify Environment Variables

Click **"Environment"** in the left sidebar

Make sure ALL these variables are set:

```
✅ DB_HOST          = <your-postgres-host>
✅ DB_PORT          = 5432
✅ DB_USERNAME      = <your-username>
✅ DB_PASSWORD      = <your-password>
✅ DB_NAME          = <your-database-name>
✅ JWT_SECRET       = <strong-random-string>
✅ JWT_EXPIRATION_MS = 86400000
✅ PORT             = 8080
```

**Missing JWT_SECRET?** Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add it as JWT_SECRET

### Step 4: Manual Deploy (Optional)

If auto-deploy doesn't trigger:

1. Click **"Manual Deploy"** button (top right)
2. Select **"Clear build cache & deploy"**
3. Click **"Deploy"**

### Step 5: Monitor Deployment

Click **"Logs"** in the left sidebar

Watch for these success messages:
```
✅ Installing dependencies...
✅ Running build command...
✅ Build successful 🎉
✅ Deploying...
✅ Server is running on port 8080
✅ Data Source has been initialized!
```

## 🧪 Test Deployment

After deployment completes (2-3 minutes):

```bash
# Test 1: Health Check
curl https://lms-system-backend-node-1.onrender.com/health

# Expected:
# {"status":"ok","timestamp":"...","service":"Library Management System API"}

# Test 2: Books API
curl https://lms-system-backend-node-1.onrender.com/api/books

# Expected:
# [] or [{"id":1,"title":"..."}]
```

## 🐛 Troubleshooting

### Build Fails

**Check logs for**:
- npm install errors → Check package.json
- TypeScript compilation errors → Check tsconfig.json
- Missing dependencies → Verify package.json

**Solution**:
- Clear build cache and redeploy
- Verify all dependencies are in package.json
- Check Node version compatibility

### Deploy Fails

**Check logs for**:
- "Cannot find module" → Verify start command
- "Port already in use" → Should not happen on Render
- Database connection errors → Check environment variables

**Solution**:
- Verify start command is `npm start`
- Check all environment variables are set
- Test database connection

### Service Crashes

**Check logs for**:
- Database connection refused → Check DB_HOST
- JWT errors → Verify JWT_SECRET is set
- Port binding errors → Verify PORT=8080

**Solution**:
- Verify database is running and accessible
- Add missing environment variables
- Check database credentials

## ✅ Success Checklist

- [ ] Root Directory set to `backend-node`
- [ ] Build Command set to `npm install && npm run build`
- [ ] Start Command set to `npm start`
- [ ] All environment variables configured
- [ ] JWT_SECRET is set and strong
- [ ] Database credentials are correct
- [ ] Deployment completed successfully
- [ ] Logs show "Server is running"
- [ ] Health endpoint returns 200 OK
- [ ] No errors in logs

## 📊 Expected Log Output

```
==> Building...
==> Installing dependencies...
npm install
added 500 packages in 30s

==> Running build command...
npm run build
> tsc
Build successful

==> Uploading build...
==> Build successful 🎉

==> Deploying...
==> Starting service...
Server is running on port 8080
Data Source has been initialized!

==> Deploy successful! 🎉
```

## 🎉 When It Works

You'll see:
- ✅ Green "Live" status in dashboard
- ✅ No errors in logs
- ✅ Health endpoint responds
- ✅ Frontend can connect
- ✅ No CORS errors

## 📞 Next Steps

1. Update Render settings as shown above
2. Wait for auto-deploy or trigger manual deploy
3. Monitor logs for success messages
4. Test health endpoint
5. Test frontend connection
6. Celebrate! 🎉

---

**Need Help?** Check RENDER_FIX.md for detailed troubleshooting
