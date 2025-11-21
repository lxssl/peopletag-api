// Validation utilities

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
const validateAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Basic Ethereum address validation (0x followed by 40 hex characters)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Validate IPFS CID format
 * @param {string} cid - CID to validate
 * @returns {boolean}
 */
const validateCID = (cid) => {
  if (!cid || typeof cid !== 'string') {
    return false;
  }

  // Basic CID validation (starts with Qm for v0 or bafy for v1)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|baf[a-z0-9]+)$/.test(cid);
};

module.exports = {
  validateAddress,
  validateCID
};

