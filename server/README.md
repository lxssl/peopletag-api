# PeopleTag API Server

RESTful API server for the PeopleTag protocol, allowing dApps to interact with the encrypted interest graph.

## Features

- **Profile Search**: Search for users by public tags and location
- **Profile Retrieval**: Get profile data by wallet address
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **Wallet Authentication**: Verify wallet signatures for authenticated requests
- **CORS Support**: Configurable CORS for cross-origin requests

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Firebase Configuration (for Firebase Admin SDK)
FIREBASE_PROJECT_ID=peopletag-demo-1
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Optional: Pinata IPFS Configuration (if needed for server-side IPFS operations)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

### Firebase Service Account Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the JSON content and set it as `FIREBASE_SERVICE_ACCOUNT` environment variable (as a JSON string)

Alternatively, save the JSON file and reference it in your code.

## Running the Server

```bash
# Development
npm run server

# Or
npm run api
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` env variable).

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

### Search Profiles

```
GET /api/v1/profiles/search?tags=DeFi,Berlin&limit=10&city=Berlin
```

Search for profiles by public tags.

**Query Parameters:**
- `tags` (required): Comma-separated list of tags to search for
- `limit` (optional): Maximum number of results (default: 10, max: 100)
- `city` (optional): Filter by city name

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "userAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "publicTags": ["DeFi", "Berlin", "Yield Farming"],
      "displayName": "BerlinDeFiUser",
      "location": "Berlin",
      "lastUpdated": "2025-11-20T10:00:00Z"
    }
  ],
  "totalResults": 1,
  "limit": 10
}
```

### Get Profile by Address

```
GET /api/v1/profiles/:userAddress?includePrivate=false
```

Get profile data for a specific wallet address.

**Path Parameters:**
- `userAddress`: Ethereum wallet address (0x...)

**Query Parameters:**
- `includePrivate` (optional): If `true` and authenticated, include private data (requires wallet signature)

**Headers (for private data access):**
- `x-wallet-address`: Wallet address
- `x-signature`: Signature of the message
- `x-message`: Original message that was signed

**Response (Public Data):**
```json
{
  "status": "success",
  "data": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "publicProfile": {
      "displayName": "BerlinDeFiUser",
      "publicTags": ["DeFi", "Berlin", "Yield Farming"],
      "location": "Berlin",
      "lastUpdated": "2025-11-20T10:00:00Z"
    },
    "profileCID": "QmXo..."
  }
}
```

**Response (With Private Data - Authenticated):**
```json
{
  "status": "success",
  "data": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "publicProfile": {
      "displayName": "BerlinDeFiUser",
      "publicTags": ["DeFi", "Berlin", "Yield Farming"],
      "location": "Berlin",
      "lastUpdated": "2025-11-20T10:00:00Z"
    },
    "profileCID": "QmXo...",
    "privateProfile": {
      "bio": "DeFi enthusiast...",
      "birthDate": "1990-01-01",
      "privateTags": ["Private Interest"],
      "privateSocials": ["https://twitter.com/..."]
    }
  }
}
```

## Authentication

For endpoints that require access to private data, you need to authenticate using wallet signatures.

### Example: Authenticated Request

```javascript
// 1. Generate message to sign
const message = `Welcome to PeopleTag!

Please sign this message to prove ownership of your wallet.

Wallet: ${walletAddress}
Timestamp: ${Date.now()}

This request will not trigger a blockchain transaction or cost any gas fees.`;

// 2. Sign message with wallet (using ethers.js or web3)
const signature = await signer.signMessage(message);

// 3. Make authenticated request
const response = await fetch(`http://localhost:3001/api/v1/profiles/${walletAddress}?includePrivate=true`, {
  headers: {
    'x-wallet-address': walletAddress,
    'x-signature': signature,
    'x-message': message
  }
});
```

## Rate Limiting

The API has rate limiting enabled:
- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit info is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common Status Codes:**
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid signature)
- `404`: Not Found (profile not found)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error
- `503`: Service Unavailable (external service error)

## Development

### Project Structure

```
server/
├── index.js                 # Main server entry point
├── routes/
│   └── profiles.js         # Profile routes
├── controllers/
│   └── profileController.js # Profile request handlers
├── services/
│   ├── profileService.js   # Profile business logic
│   ├── firebaseService.js  # Firestore operations
│   ├── ipfsService.js      # IPFS operations
│   └── blockchainService.js # Arbitrum blockchain operations
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
└── utils/
    ├── validation.js       # Validation utilities
    └── encryption.js       # Encryption/decryption utilities
```

## Deployment

### Environment Variables for Production

Make sure to set:
- `NODE_ENV=production`
- `ALLOWED_ORIGINS` with your production domain(s)
- `FIREBASE_SERVICE_ACCOUNT` with your service account JSON

### Recommended Hosting

- **Vercel**: Serverless functions
- **Railway**: Easy Node.js deployment
- **Heroku**: Traditional hosting
- **AWS/GCP/Azure**: For more control

## Security Considerations

1. **Rate Limiting**: Already implemented, but consider adjusting limits based on your needs
2. **CORS**: Restrict `ALLOWED_ORIGINS` in production
3. **Firebase Admin**: Keep service account credentials secure
4. **Private Data**: Decryption happens server-side only when user provides encryption key via signature
5. **Input Validation**: All inputs are validated before processing

## Future Enhancements

- [ ] GraphQL API endpoint
- [ ] WebSocket support for real-time updates
- [ ] Caching layer (Redis) for frequently accessed profiles
- [ ] API key authentication for dApps
- [ ] Webhook support for profile updates
- [ ] Advanced search filters (age range, multiple cities, etc.)
- [ ] Pagination for search results

## License

Same as main PeopleTag project.

