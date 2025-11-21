// IPFS service - handles IPFS operations

// For server-side, we'll use the protocol package's IPFS functions
// Note: You may need to install additional dependencies or use a different IPFS client
// depending on your setup

/**
 * Fetch data from IPFS using CID
 * @param {string} cid - IPFS CID
 * @returns {Promise<object>} Encrypted profile data
 */
const fetchFromIPFS = async (cid) => {
  try {
    // Use the protocol package's IPFS fetch function
    // This assumes @peopletag/protocol exports a server-compatible fetchFromIPFS
    const { fetchFromIPFS: fetchFromIPFSLib } = require('@peopletag/protocol');
    
    if (!fetchFromIPFSLib) {
      throw new Error('IPFS fetch function not available from @peopletag/protocol');
    }

    const data = await fetchFromIPFSLib(cid);
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error(`Failed to fetch data from IPFS: ${error.message}`);
  }
};

module.exports = {
  fetchFromIPFS
};

