# Firebase Deployment Guide

## Overview

The PeopleTag API has been adapted to work with **Firebase Cloud Functions**. Firebase Hosting serves static files, but Cloud Functions allow you to run serverless Node.js code.

## Architecture

- **Firebase Hosting**: Serves your React frontend (static files)
- **Firebase Cloud Functions**: Runs the API server (serverless functions)
- **Firestore**: Database (already configured)
- **API Routes**: All `/api/**` requests are proxied to Cloud Functions

## Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Configure Firebase Functions

The `functions/` directory contains:
- `index.js` - Main Cloud Function entry point
- `package.json` - Function dependencies
- All service, middleware, and utility files

### 5. Deploy

```bash
# Deploy everything (hosting + functions)
firebase deploy

# Or deploy only functions
firebase deploy --only functions

# Or deploy only hosting
firebase deploy --only hosting
```

## API Endpoints

After deployment, your API will be available at:

```
https://your-project-id.cloudfunctions.net/api/api/v1/profiles/search
https://your-project-id.cloudfunctions.net/api/api/v1/profiles/:userAddress
```

Or through Firebase Hosting (if configured with rewrites):

```
https://your-domain.com/api/v1/profiles/search
https://your-domain.com/api/v1/profiles/:userAddress
```

## Environment Variables

Firebase Functions use Firebase config for environment variables:

```bash
# Set environment variables
firebase functions:config:set peopletag.project_id="peopletag-demo-1"

# Or use .env file (requires firebase-functions v2+)
# See: https://firebase.google.com/docs/functions/config-env
```

## Local Development

### Run Functions Locally

```bash
# Install Firebase emulator
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# Or just functions
firebase emulators:start --only functions
```

The API will be available at `http://localhost:5001/your-project-id/us-central1/api`

### Run Frontend + Functions Together

```bash
# Terminal 1: Start React app
npm start

# Terminal 2: Start Firebase emulators
firebase emulators:start
```

## Differences from Standalone Server

1. **Firebase Admin**: Auto-initialized in Cloud Functions (no manual setup needed)
2. **Environment Variables**: Use Firebase config or `.env` files
3. **Cold Starts**: Functions may have cold start delays (first request)
4. **Timeout**: Functions have execution time limits (60s for HTTP functions)
5. **Scaling**: Automatically scales based on traffic

## Cost Considerations

Firebase Cloud Functions pricing:
- **Free Tier**: 2 million invocations/month
- **Paid**: $0.40 per million invocations after free tier
- **Compute Time**: Based on memory and execution time

See: https://firebase.google.com/pricing

## Troubleshooting

### Function Not Deploying

```bash
# Check Firebase CLI version
firebase --version

# Update if needed
npm install -g firebase-tools@latest
```

### Environment Variables Not Working

```bash
# List current config
firebase functions:config:get

# Set config
firebase functions:config:set key="value"
```

### CORS Issues

CORS is configured in `functions/index.js`. Make sure `corsOptions.origin` is set correctly for production.

## Alternative: Keep Standalone Server

If you prefer the standalone Express server:
- Keep using `server/` directory
- Deploy to Railway, Heroku, AWS, etc.
- Update frontend to point to your server URL

Both approaches work - choose based on your needs!

