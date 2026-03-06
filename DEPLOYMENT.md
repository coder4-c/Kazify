# Deploying Kazify to Production

This guide covers deploying both the frontend and backend to production.

## Part 1: Deploy Frontend (Already Done ✅)

Your frontend is deployed to Vercel. 

## Part 2: Deploy Backend

### Step 1: Get MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster (choose free tier)
4. Create a database user (note the password)
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your actual password

### Step 2: Deploy Backend to Render.com (Free)

1. Go to [Render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub account and select the Kazify repository
4. Configure:
   - **Name**: `k   - **Environmentazify-backend`
**: `Node`
   - **Build Command**: (leave empty)
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://your-username:your-password@cluster.xxx.mongodb.net/kazify`
   - `JWT_SECRET`: `kazify-secret-key-2026`
   - `PORT`: `4000`
6. Click "Create Web Service"
7. Wait for deployment to complete (2-3 minutes)
8. Note your backend URL (e.g., `https://kazify-backend.onrender.com`)

### Step 3: Update Frontend with Backend URL

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Kazify project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - Example: `VITE_API_URL` = `https://kazify-backend.onrender.com/api`
5. Go to Deployments
6. Click "..." on the latest deployment → "Redeploy"

## Quick Summary

| Service | URL | Status |
|---------|-----|--------|
| Frontend | your-vercel-app.vercel.app | ✅ Ready |
| Backend | kazify-backend.onrender.com | 🔄 Deploy now |
| Database | MongoDB Atlas | 🔄 Setup required |

## Troubleshooting

### CORS Errors
If you get CORS errors, update the CORS configuration in `Backend/server.js` to allow your Vercel frontend URL.

### Database Connection Issues
- Ensure MongoDB Atlas allows connections from anywhere (Network Access → Allow All)
- Check that your connection string is correct

### API Not Working
- Verify the `VITE_API_URL` is set correctly in Vercel
- Make sure backend is deployed and running
