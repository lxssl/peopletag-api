// Profile controller - handles profile-related API requests

const profileService = require('../services/profileService');
const { validateAddress } = require('../utils/validation');

/**
 * Search profiles by public tags
 * GET /api/v1/profiles/search?tags=DeFi,Berlin&limit=10
 */
const searchProfiles = async (req, res, next) => {
  try {
    const { tags, limit = 10, city } = req.query;

    // Validate tags parameter
    if (!tags) {
      return res.status(400).json({
        status: 'error',
        message: 'tags parameter is required'
      });
    }

    // Parse tags (comma-separated)
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (tagArray.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one valid tag is required'
      });
    }

    // Validate and parse limit
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'limit must be a positive number'
      });
    }

    if (limitNum > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'limit cannot exceed 100'
      });
    }

    // Search profiles
    const results = await profileService.searchProfilesByTags(tagArray, limitNum, city);

    res.json({
      status: 'success',
      data: results.profiles,
      totalResults: results.total,
      limit: limitNum
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile by wallet address
 * GET /api/v1/profiles/:userAddress
 */
const getProfileByAddress = async (req, res, next) => {
  try {
    const { userAddress } = req.params;
    const { includePrivate } = req.query;

    // Validate address
    if (!validateAddress(userAddress)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid wallet address format'
      });
    }

    // Check if user is authenticated (for private data access)
    const isAuthenticated = req.user && req.user.address === userAddress.toLowerCase();
    const includePrivateData = includePrivate === 'true' && isAuthenticated;

    // Get profile
    const profile = await profileService.getProfileByAddress(
      userAddress,
      includePrivateData,
      req.user?.encryptionKey
    );

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchProfiles,
  getProfileByAddress
};

