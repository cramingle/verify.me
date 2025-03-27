# Deploying Verify.me to Vercel

This document outlines the steps to deploy the Verify.me application to Vercel.

## Prerequisites

- A Vercel account
- Git repository with your project code
- Node.js 18 or higher installed locally

## Deployment Steps

### 1. Prepare Your Project

Make sure your project is ready for deployment:

- All necessary files are committed to your Git repository
- The mock data is properly set up in the backend/server.js file
- Environment variables are properly configured

### 2. Install Vercel CLI (Optional)

You can use the Vercel CLI to deploy your project. Install it globally:

```bash
npm install -g vercel
```

### 3. Configure Environment Variables

Add the following environment variables to your Vercel project:

- `JWT_SECRET`: A secure random string for JWT token signing
- Any other environment variables required by your application

You can add these through the Vercel dashboard or using the Vercel CLI:

```bash
vercel env add JWT_SECRET
```

### 4. Deploy to Vercel

You can deploy using one of the following methods:

#### Option 1: Using Vercel Dashboard

1. Log in to your Vercel account
2. Click "New Project" and import your Git repository
3. Configure the project settings:
   - Set the Framework Preset to "Other"
   - Set the Build Command to `npm run build`
   - Set the Output Directory to `frontend/dist`
4. Deploy your project

#### Option 2: Using Vercel CLI

1. Navigate to your project directory
2. Run the following command:

```bash
vercel
```

3. Follow the prompts to configure your project

### 5. Verify Deployment

After deployment, verify that your application is working correctly:

1. Open your deployed application URL
2. Test the verification functionality by entering one of the mock channels
3. Test other functionality such as login and registration

## Troubleshooting

If you encounter any issues with your deployment, check the following:

1. Vercel deployment logs for any build or runtime errors
2. API endpoint connections and error messages
3. Environment variables configuration

## Updates and Maintenance

To update your deployed application:

1. Make changes to your codebase
2. Commit and push to your Git repository
3. Vercel will automatically deploy the updates (if automatic deployments are enabled)

Alternatively, you can manually deploy updates using:

```bash
vercel --prod
``` 