// PeopleTag API Server
// Main entry point for the API server

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const profileRoutes = require('./routes/profiles');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PeopleTag API server running on port ${PORT}`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api/v1`);
});

module.exports = app;

