// Firebase service - handles Firestore operations
// For Firebase Functions, admin is automatically initialized

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (in Cloud Functions, this is usually already initialized)
if (!admin.apps.length) {
  // In Cloud Functions, admin is auto-initialized, but we can also initialize explicitly
  admin.initializeApp();
}

const db = getFirestore();

/**
 * Get all profiles from Firestore
 * @returns {Promise<Array>}
 */
const getAllProfiles = async () => {
  try {
    const profilesCollection = db.collection('profiles');
    const snapshot = await profilesCollection.get();

    const profiles = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      profiles.push({
        ...data,
        username: doc.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      });
    });

    // Also get test profiles if needed
    try {
      const testCollection = db.collection('profile_test');
      const testSnapshot = await testCollection.get();
      testSnapshot.forEach((doc) => {
        const data = doc.data();
        profiles.push({
          ...data,
          username: doc.id,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          _isTestRecord: true
        });
      });
    } catch (testError) {
      // Test collection might not exist, that's okay
      console.log('Test profiles collection not found or error:', testError.message);
    }

    return profiles;
  } catch (error) {
    console.error('Error getting all profiles:', error);
    throw error;
  }
};

/**
 * Get profile by wallet address
 * @param {string} walletAddress - Normalized wallet address
 * @returns {Promise<object|null>}
 */
const getProfileByWallet = async (walletAddress) => {
  try {
    // First, get username from walletUsers collection
    const walletUserDoc = await db.collection('walletUsers').doc(walletAddress).get();
    
    if (!walletUserDoc.exists) {
      return null;
    }

    const walletUserData = walletUserDoc.data();
    const username = walletUserData.username;

    if (!username) {
      return null;
    }

    // Get profile from profiles collection
    const profileDoc = await db.collection('profiles').doc(username).get();

    if (!profileDoc.exists) {
      return null;
    }

    const profileData = profileDoc.data();
    return {
      ...profileData,
      username: profileDoc.id,
      createdAt: profileData.createdAt?.toDate?.() || profileData.createdAt,
      updatedAt: profileData.updatedAt?.toDate?.() || profileData.updatedAt
    };
  } catch (error) {
    console.error('Error getting profile by wallet:', error);
    throw error;
  }
};

module.exports = {
  getAllProfiles,
  getProfileByWallet
};

