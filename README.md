# PeopleTag API

RESTful API server for the PeopleTag protocol, enabling dApps to interact with the encrypted interest graph.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 **Profile Search**: Search for users by public tags and location
- 👤 **Profile Retrieval**: Get profile data by wallet address
- 🔐 **Wallet Authentication**: Verify wallet signatures for private data access
- ⚡ **Rate Limiting**: Prevents abuse with configurable rate limits
- 🌐 **CORS Support**: Configurable cross-origin requests
- 🚀 **Multiple Deployment Options**: Standalone Express server or Firebase Cloud Functions

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
```

### Running Locally

**Standalone Server:**
```bash
npm run server
```

**Firebase Functions (local emulator):**
```bash
cd functions && npm install && cd ..
firebase emulators:start --only functions
```

## API Endpoints

### Search Profiles

```http
GET /api/v1/profiles/search?tags=DeFi,Berlin&limit=10
```

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

### Get Profile

```http
GET /api/v1/profiles/:userAddress
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "publicProfile": {
      "displayName": "BerlinDeFiUser",
      "publicTags": ["DeFi", "Berlin"],
      "location": "Berlin",
      "lastUpdated": "2025-11-20T10:00:00Z"
    },
    "profileCID": "QmXo..."
  }
}
```

## Deployment

### Firebase Cloud Functions

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy functions
firebase deploy --only functions
```

The API will be available at `https://your-project-id.cloudfunctions.net/api/api/v1/profiles/...`

### Other Platforms

The standalone Express server (`server/` directory) can be deployed to:
- Railway
- Heroku
- AWS Lambda
- Google Cloud Run
- Any Node.js hosting platform

## Documentation

- [API Documentation](server/README.md) - Complete API reference
- [Quick Start Guide](server/QUICKSTART.md) - Setup instructions
- [SDK Example](server/examples/sdk-example.js) - Client library example

## Architecture

```
peopletag-api/
├── server/              # Standalone Express server
│   ├── routes/         # API routes
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── middleware/     # Auth, error handling
│   └── utils/          # Utilities
├── functions/          # Firebase Cloud Functions version
└── package.json
```

## Dependencies

- **Express**: Web framework
- **Firebase Admin**: Firestore access
- **@peopletag/protocol**: IPFS and blockchain operations
- **ethers**: Wallet signature verification
- **@noble/ciphers**: Encryption/decryption

## Security

- ✅ Rate limiting (100 requests/15min per IP)
- ✅ Input validation
- ✅ Wallet signature verification
- ✅ Private data encryption
- ✅ CORS configuration

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [@peopletag/protocol](https://github.com/lxssl/peopletag-protocol) - Core protocol library

## Support

For issues and questions, please open an issue on GitHub.
