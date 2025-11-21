/**
 * PeopleTag API SDK Example
 * 
 * This is a simple example of how to use the PeopleTag API from a client application.
 * You can use this as a reference to build your own SDK or integrate directly.
 */

class PeopleTagAPI {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  /**
   * Search for profiles by tags
   * @param {string[]} tags - Array of tags to search for
   * @param {object} options - Search options
   * @param {number} options.limit - Maximum number of results (default: 10)
   * @param {string} options.city - Optional city filter
   * @returns {Promise<object>} Search results
   */
  async searchProfiles(tags, options = {}) {
    const { limit = 10, city } = options;
    const tagsParam = Array.isArray(tags) ? tags.join(',') : tags;
    
    const params = new URLSearchParams({
      tags: tagsParam,
      limit: limit.toString()
    });
    
    if (city) {
      params.append('city', city);
    }

    const response = await fetch(`${this.baseURL}/api/v1/profiles/search?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Search failed');
    }

    return response.json();
  }

  /**
   * Get profile by wallet address
   * @param {string} address - Wallet address
   * @param {object} options - Request options
   * @param {boolean} options.includePrivate - Include private data (requires authentication)
   * @param {object} options.auth - Authentication credentials
   * @param {string} options.auth.address - Wallet address
   * @param {string} options.auth.signature - Signature
   * @param {string} options.auth.message - Original message
   * @returns {Promise<object>} Profile data
   */
  async getProfile(address, options = {}) {
    const { includePrivate = false, auth } = options;
    
    const params = new URLSearchParams();
    if (includePrivate) {
      params.append('includePrivate', 'true');
    }

    const headers = {};
    if (auth && includePrivate) {
      headers['x-wallet-address'] = auth.address;
      headers['x-signature'] = auth.signature;
      headers['x-message'] = auth.message;
    }

    const response = await fetch(
      `${this.baseURL}/api/v1/profiles/${address}?${params}`,
      { headers }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  }

  /**
   * Health check
   * @returns {Promise<object>} Server status
   */
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }
}

// Example usage
async function example() {
  const api = new PeopleTagAPI('http://localhost:3001');

  try {
    // Example 1: Search for profiles
    console.log('Searching for DeFi profiles in Berlin...');
    const searchResults = await api.searchProfiles(['DeFi', 'Berlin'], {
      limit: 10,
      city: 'Berlin'
    });
    console.log('Search results:', searchResults);

    // Example 2: Get public profile
    console.log('\nGetting public profile...');
    const publicProfile = await api.getProfile('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    console.log('Public profile:', publicProfile);

    // Example 3: Get profile with private data (requires authentication)
    // In a real app, you'd get the signature from the user's wallet
    /*
    const { ethers } = require('ethers');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    const message = `Welcome to PeopleTag!
    
Please sign this message to prove ownership of your wallet.

Wallet: ${address}
Timestamp: ${Date.now()}

This request will not trigger a blockchain transaction or cost any gas fees.`;

    const signature = await signer.signMessage(message);

    const privateProfile = await api.getProfile(address, {
      includePrivate: true,
      auth: {
        address,
        signature,
        message
      }
    });
    console.log('Private profile:', privateProfile);
    */

  } catch (error) {
    console.error('Error:', error);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PeopleTagAPI;
}

// For browser usage
if (typeof window !== 'undefined') {
  window.PeopleTagAPI = PeopleTagAPI;
}

