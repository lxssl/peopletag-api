// Profile routes
const express = require('express');
const router = express.Router();
const { searchProfiles, getProfileByAddress } = require('../controllers/profileController');
const { verifyWalletSignature } = require('../middleware/auth');

/**
 * @route   GET /api/v1/profiles/search
 * @desc    Search profiles by public tags
 * @access  Public
 * @query   tags - Comma-separated list of tags to search for
 * @query   limit - Maximum number of results (default: 10, max: 100)
 * @query   city - Optional city filter
 */
router.get('/search', searchProfiles);

/**
 * @route   GET /api/v1/profiles/:userAddress
 * @desc    Get profile by wallet address
 * @access  Public (returns only public data unless authenticated)
 * @param   userAddress - Ethereum wallet address
 * @query   includePrivate - If true and authenticated, include private data (requires signature)
 * @middleware verifyWalletSignature - Optional authentication middleware
 */
router.get('/:userAddress', verifyWalletSignature, getProfileByAddress);

module.exports = router;

