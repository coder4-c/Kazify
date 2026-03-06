# Deploying Kazify to Vercel or Netlify

This guide will help you deploy the Kazify application to Vercel or Netlify.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for database)
3. Git installed and repository pushed to GitHub

## Deployment Options

### Option 1: Deploy to Netlify (Recommended for simplicity)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Configure:
   - Build command: `cd Frontend && npm run build`
   - Publish directory: `Frontend/dist`
6. Click "Deploy"

### Option 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Option 3: Frontend Only (with external backend)

The frontend can be deployed to Vercel immediately. You'll need to deploy the backend separately.

#### Step 1: Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

#### Step 2: Deploy Backend

The backend needs to be deployed separately. You can use:
- [Render](https://render.com) (Recommended - Free tier available)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)

**Deploying to Render:**

1. Create a Render account
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: kazify-backend
   - Build Command: (leave empty)
   - Start Command: `node server.js`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
6. Click "Create Web Service"

#### Step 3: Update Frontend API URL

After deploying the backend, update your frontend:
1. Go to Vercel Dashboard → Your project → Settings → Environment Variables
2. Add: `VITE_API_URL` = your-backend-url/api
3. Redeploy the frontend

### Option 2: Full Stack with Vercel Serverless Functions

For a more integrated solution, you can convert the backend to use Vercel serverless functions.

## Environment Variables

For production, set these environment variables:

**Frontend (.env):**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Backend (on your hosting platform):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=4000
```

## Troubleshooting

### CORS Errors
If you encounter CORS errors, make sure your backend allows requests from your Vercel frontend URL.

### Database Connection
Ensure your MongoDB Atlas allows connections from anywhere (or your specific IP).

### API Not Working
Check that the `VITE_API_URL` environment variable is set correctly in Vercel.
