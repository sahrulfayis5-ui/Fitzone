# MongoDB Atlas Setup for Vercel Deployment

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose the free tier)

## Step 2: Configure Database Access
1. Go to "Database Access" in your Atlas dashboard
2. Click "Add New Database User"
3. Create a user with read/write permissions
4. Note down the username and password

## Step 3: Configure Network Access
1. Go to "Network Access" in your Atlas dashboard
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment

## Step 4: Get Connection String
1. Go to "Clusters" in your Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `fitzone-gym`)

Example connection string:
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/fitzone-gym?retryWrites=true&w=majority
```

## Step 5: Add Environment Variable to Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add a new environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Environment: Production (and Preview if you want)

## Step 6: Redeploy
1. Go to "Deployments" in Vercel
2. Click "Redeploy" on your latest deployment
3. Or push a new commit to trigger automatic deployment

## Testing
After deployment, visit:
- `https://your-app.vercel.app/members/test` - Test members functionality
- `https://your-app.vercel.app/admin/test` - Test admin functionality
- `https://your-app.vercel.app/admin` - Access admin panel

## Troubleshooting
If you still get connection errors:
1. Check that your MongoDB Atlas cluster is running
2. Verify the connection string is correct
3. Ensure the environment variable is set in Vercel
4. Check the Vercel function logs for detailed error messages
