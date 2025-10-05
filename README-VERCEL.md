# FitZone Gym - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Set up MongoDB Atlas (Required for Production)

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string (it will look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fitzone-gym?retryWrites=true&w=majority
   ```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? fitzone-gym
# - Directory? ./
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: Leave empty
   - Install Command: `npm install`

### 3. Configure Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

### 4. Files Created for Vercel

- `vercel.json`: Vercel configuration
- `api/index.js`: Serverless function entry point
- `env.example`: Environment variables template

## Local Development

1. Copy `env.example` to `.env`
2. Fill in your MongoDB connection string
3. Run: `npm run dev`

## Important Notes

- Vercel uses serverless functions, so your app will be deployed as a serverless function
- MongoDB Atlas is required for production (local MongoDB won't work on Vercel)
- The app will automatically scale based on traffic
- Each deployment gets a unique URL

## Troubleshooting

- **MongoDB Connection Issues**: Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
- **Build Failures**: Check that all dependencies are in `package.json`
- **Environment Variables**: Make sure all required env vars are set in Vercel dashboard

