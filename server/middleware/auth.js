// Authentication middleware - verifies wallet signatures and generates encryption keys

const { ethers } = require('ethers');
const { hkdf } = require('@noble/hashes/hkdf');
const { sha256 } = require('@noble/hashes/sha2');

/**
 * Verify wallet signature
 * @param {string} address - Wallet address
 * @param {string} message - Original message
 * @param {string} signature - Signature
 * @returns {Promise<boolean>}
 */
const verifySignature = async (address, message, signature) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Generate encryption key from signature (matches frontend logic)
 * @param {string} signature - Signature hex string
 * @returns {Uint8Array} Encryption key (32 bytes)
 */
const generateEncryptionKeyFromSignature = (signature) => {
  if (!signature) {
    throw new Error('Signature is required');
  }

  try {
    // Convert signature (hex string) to bytes (Uint8Array)
    const signatureBytes = ethers.getBytes(signature);
    
    // Convert salt and info to Uint8Array for HKDF
    const saltBytes = new TextEncoder().encode('PeopleTag-encryption-v1');
    const infoBytes = new TextEncoder().encode('PeopletagEncryptionKey');

    // Derive 256-bit encryption key using HKDF
    const encryptionKey = hkdf(
      sha256,
      signatureBytes,                    // Input key material (signature) - Uint8Array
      saltBytes,                         // Salt - Uint8Array
      infoBytes,                         // Info - Uint8Array
      32                                 // 32 bytes = 256 bits for AES-256
    );

    return encryptionKey;
  } catch (error) {
    console.error('Error generating encryption key from signature:', error);
    throw new Error('Failed to generate encryption key from signature: ' + error.message);
  }
};

/**
 * Middleware to verify wallet signature for authenticated endpoints
 * Expects signature in header: x-wallet-address, x-signature, x-message
 * Generates encryption key from signature for private data access
 */
const verifyWalletSignature = async (req, res, next) => {
  try {
    const address = req.headers['x-wallet-address'];
    const signature = req.headers['x-signature'];
    const message = req.headers['x-message'];

    // If no auth headers, continue without authentication (public access)
    if (!address || !signature || !message) {
      return next();
    }

    // Verify signature
    const isValid = await verifySignature(address, message, signature);

    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid signature'
      });
    }

    // Generate encryption key from signature (for decrypting private data)
    let encryptionKey = null;
    try {
      encryptionKey = generateEncryptionKeyFromSignature(signature);
    } catch (keyError) {
      console.error('Error generating encryption key:', keyError);
      // Continue without encryption key - user can still access public data
    }

    // Attach user info to request
    req.user = {
      address: address.toLowerCase(),
      signature,
      message,
      encryptionKey
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error'
    });
  }
};

module.exports = {
  verifyWalletSignature,
  verifySignature,
  generateEncryptionKeyFromSignature
};

