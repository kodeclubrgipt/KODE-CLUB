# Vercel Deployment Guide

## Common 404 Error Fixes

If you're getting a `404: NOT_FOUND` error on Vercel, follow these steps:

### 1. ✅ Check Vercel Project Settings

In your Vercel dashboard:
- **Root Directory**: Should be `Kode-Klub` (if your repo has both frontend and backend)
- **Framework Preset**: Should be `Next.js`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default, auto-detected)

### 2. ✅ Set Environment Variables

Go to **Settings → Environment Variables** in Vercel and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

**Important Notes:**
- Replace `https://your-backend-url.com` with your actual backend URL
- If backend is on Vercel too, use: `https://your-backend.vercel.app/api`
- If backend is on another platform, use that URL
- The `/api` suffix is important!

### 3. ✅ Check Build Logs

1. Go to **Deployments** tab in Vercel
2. Click on the failed deployment
3. Check **Build Logs** for errors
4. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variable issues

### 4. ✅ Verify Project Structure

Make sure your project structure looks like this:

```
Kode-Klub/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   └── ...
├── package.json
├── next.config.mjs
├── tsconfig.json
└── vercel.json
```

### 5. ✅ Re-deploy After Changes

After setting environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger auto-deploy

### 6. ✅ Common Issues & Solutions

#### Issue: "404 NOT_FOUND" on all routes
**Solution**: 
- Check if `NEXT_PUBLIC_API_URL` is set correctly
- Verify root directory is set to `Kode-Klub` in Vercel settings
- Make sure `next.config.mjs` exists and is valid

#### Issue: Build fails
**Solution**:
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

#### Issue: API calls fail
**Solution**:
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings on backend
- Ensure backend is deployed and accessible

### 7. ✅ Quick Checklist

- [ ] Root directory set to `Kode-Klub` in Vercel
- [ ] `NEXT_PUBLIC_API_URL` environment variable is set
- [ ] Build completes successfully (check logs)
- [ ] Backend is deployed and accessible
- [ ] CORS is configured on backend to allow Vercel domain

### 8. ✅ Testing Locally Before Deploy

Test your build locally:

```bash
cd Kode-Klub
npm run build
npm run start
```

If this works locally, it should work on Vercel too.

## Still Having Issues?

1. Check Vercel build logs for specific error messages
2. Verify all environment variables are set
3. Ensure backend is running and accessible
4. Check browser console for client-side errors
