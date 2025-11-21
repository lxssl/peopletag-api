// Firebase Cloud Functions for PeopleTag API
// This adapts the Express server to work with Firebase Functions

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const profileRoutes = require('./routes/profiles');

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins (or configure specific origins)
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (adjusted for Cloud Functions)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/profiles', profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Export as Firebase Cloud Function
// This creates: https://your-region-your-project.cloudfunctions.net/api
exports.api = functions.https.onRequest(app);

// Alternative: Export individual endpoints for better performance
// Uncomment if you want separate functions for each endpoint
/*
exports.searchProfiles = functions.https.onRequest(async (req, res) => {
  // Handle search endpoint
});

exports.getProfile = functions.https.onRequest(async (req, res) => {
  // Handle get profile endpoint
});
*/

