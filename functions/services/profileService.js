// Profile service - handles business logic for profiles

const firebaseService = require('./firebaseService');
const ipfsService = require('./ipfsService');
const blockchainService = require('./blockchainService');
const { decryptProfile } = require('../utils/encryption');

/**
 * Search profiles by public tags
 * @param {string[]} tags - Array of tags to search for
 * @param {number} limit - Maximum number of results
 * @param {string} city - Optional city filter
 * @returns {Promise<{profiles: Array, total: number}>}
 */
const searchProfilesByTags = async (tags, limit, city = null) => {
  try {
    // Get all profiles from Firestore (contains public metadata)
    const allProfiles = await firebaseService.getAllProfiles();

    // Filter profiles that match the tags
    const matchingProfiles = allProfiles.filter(profile => {
      // Check if profile has any of the requested tags
      const profileTags = profile.tagsList || [];
      const hasMatchingTag = tags.some(tag => 
        profileTags.some(pt => pt.toLowerCase() === tag.toLowerCase())
      );

      // Check city filter if provided
      const cityMatches = !city || 
        (profile.city && profile.city.toLowerCase() === city.toLowerCase());

      return hasMatchingTag && cityMatches;
    });

    // Sort by relevance (number of matching tags) and then by last updated
    matchingProfiles.sort((a, b) => {
      const aTags = a.tagsList || [];
      const bTags = b.tagsList || [];
      
      const aMatches = tags.filter(tag => 
        aTags.some(pt => pt.toLowerCase() === tag.toLowerCase())
      ).length;
      const bMatches = tags.filter(tag => 
        bTags.some(pt => pt.toLowerCase() === tag.toLowerCase())
      ).length;

      if (bMatches !== aMatches) {
        return bMatches - aMatches; // More matches first
      }

      // If same number of matches, sort by last updated
      const aUpdated = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
      const bUpdated = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
      return bUpdated - aUpdated;
    });

    // Limit results
    const limitedProfiles = matchingProfiles.slice(0, limit);

    // Format response (only public data)
    const formattedProfiles = limitedProfiles.map(profile => ({
      userAddress: profile.walletAddress,
      publicTags: profile.tagsList || [],
      displayName: profile.name || profile.username || null,
      location: profile.city || null,
      lastUpdated: profile.updatedAt?.toDate?.()?.toISOString() || 
                   (profile.updatedAt instanceof Date ? profile.updatedAt.toISOString() : null) ||
                   null
    }));

    return {
      profiles: formattedProfiles,
      total: matchingProfiles.length
    };
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
};

/**
 * Get profile by wallet address
 * @param {string} userAddress - Wallet address
 * @param {boolean} includePrivate - Whether to include private data
 * @param {Uint8Array} encryptionKey - Encryption key for decrypting private data
 * @returns {Promise<object|null>}
 */
const getProfileByAddress = async (userAddress, includePrivate = false, encryptionKey = null) => {
  try {
    const normalizedAddress = userAddress.toLowerCase();

    // Get profile metadata from Firestore
    const metadata = await firebaseService.getProfileByWallet(normalizedAddress);
    
    if (!metadata) {
      return null;
    }

    // Get IPFS CID from blockchain
    const ipfsHash = await blockchainService.getCIDFromBlockchain(normalizedAddress);

    // Build public profile response
    const publicProfile = {
      userAddress: metadata.walletAddress,
      publicProfile: {
        displayName: metadata.name || metadata.username || null,
        publicTags: metadata.tagsList || [],
        location: metadata.city || null,
        lastUpdated: metadata.updatedAt?.toDate?.()?.toISOString() || 
                     (metadata.updatedAt instanceof Date ? metadata.updatedAt.toISOString() : null) ||
                     null
      },
      profileCID: ipfsHash || null
    };

    // If private data is requested and encryption key is provided, fetch and decrypt
    if (includePrivate && encryptionKey && ipfsHash) {
      try {
        const encryptedData = await ipfsService.fetchFromIPFS(ipfsHash);
        const decryptedProfile = await decryptProfile(encryptedData, encryptionKey);

        // Merge public and private data
        return {
          ...publicProfile,
          privateProfile: {
            bio: decryptedProfile.bio || null,
            birthDate: decryptedProfile.birthDate || null,
            privateTags: (decryptedProfile.tagsList || []).filter(tag => 
              !(metadata.tagsList || []).includes(tag)
            ),
            privateSocials: (decryptedProfile.socialLinks || []).filter(social => 
              !(metadata.socialLinks || []).includes(social)
            )
          }
        };
      } catch (decryptError) {
        console.error('Error decrypting profile:', decryptError);
        // Return public profile even if decryption fails
        return publicProfile;
      }
    }

    return publicProfile;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

module.exports = {
  searchProfilesByTags,
  getProfileByAddress
};

