# PeopleTag API - Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- Firebase project with Firestore enabled
- Access to Arbitrum network (for blockchain operations)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

3. Configure Firebase Admin SDK:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Copy the JSON content and set it as `FIREBASE_SERVICE_ACCOUNT` in your `.env` file
   - Or save the JSON file and reference it in your code

## Running the Server

```bash
npm run server
```

The API will be available at `http://localhost:3001`

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Search Profiles
```bash
curl "http://localhost:3001/api/v1/profiles/search?tags=DeFi,Berlin&limit=10"
```

### 3. Get Profile
```bash
curl "http://localhost:3001/api/v1/profiles/0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
```

## Using the SDK Example

See `server/examples/sdk-example.js` for a complete SDK implementation example.

## Troubleshooting

### Firebase Admin SDK Issues
- Make sure `FIREBASE_SERVICE_ACCOUNT` is set correctly
- Verify the service account has Firestore read permissions
- Check that your Firebase project ID matches

### IPFS Issues
- The IPFS service uses `@peopletag/protocol` package
- Make sure the protocol package is installed: `npm install @peopletag/protocol`
- If IPFS fetching fails, check that the CID exists and is accessible

### Blockchain Issues
- Ensure you have network access to Arbitrum
- The `@peopletag/protocol` package handles blockchain interactions
- Check that the contract address is correct in the protocol package

## Next Steps

- Read the full [API Documentation](README.md)
- Check out the [SDK Example](examples/sdk-example.js)
- Integrate the API into your dApp

