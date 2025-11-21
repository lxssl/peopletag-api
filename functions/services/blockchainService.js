// Blockchain service - handles Arbitrum blockchain operations

/**
 * Get IPFS CID from Arbitrum blockchain for a wallet address
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<string|null>} IPFS CID or null if not found
 */
const getCIDFromBlockchain = async (walletAddress) => {
  try {
    // Use the protocol package's blockchain function
    const { getCIDFromBlockchain: getCIDFromBlockchainLib } = require('@peopletag/protocol');
    
    if (!getCIDFromBlockchainLib) {
      throw new Error('Blockchain function not available from @peopletag/protocol');
    }

    const cid = await getCIDFromBlockchainLib(walletAddress);
    return cid || null;
  } catch (error) {
    console.error('Error getting CID from blockchain:', error);
    // Return null instead of throwing - profile might not have a CID yet
    return null;
  }
};

module.exports = {
  getCIDFromBlockchain
};

