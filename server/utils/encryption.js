// Encryption utilities - decrypt profile data
// Matches the encryption logic from the frontend cryptoOperations.js

const { gcm } = require('@noble/ciphers/aes');

/**
 * Convert hex string to bytes (Uint8Array)
 * @param {string} hex - Hex string
 * @returns {Uint8Array} Bytes
 */
const hexToBytes = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

/**
 * Decrypt profile data using AES-GCM
 * @param {Object} encryptedData - Encrypted data with ciphertext and nonce
 * @param {Uint8Array} key - 32-byte AES-GCM decryption key
 * @returns {Object} Decrypted profile data
 */
const decryptProfile = (encryptedData, key) => {
  if (!key || !(key instanceof Uint8Array) || key.length !== 32) {
    throw new Error('Invalid decryption key. Key must be a 32-byte Uint8Array.');
  }

  if (!encryptedData || !encryptedData.ciphertext || !encryptedData.nonce) {
    throw new Error('Invalid encrypted data. Must contain ciphertext and nonce.');
  }

  try {
    // Convert hex strings to bytes
    const ciphertext = hexToBytes(encryptedData.ciphertext);
    const nonce = hexToBytes(encryptedData.nonce);

    // Decrypt using AES-GCM
    const cipher = gcm(key, nonce);
    const plaintext = cipher.decrypt(ciphertext);

    // Convert bytes to JSON string and parse
    const jsonString = new TextDecoder().decode(plaintext);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decrypting profile:', error);
    throw new Error('Failed to decrypt profile data: ' + error.message);
  }
};

module.exports = {
  decryptProfile
};

