// Customer Authentication Service (Google OAuth + Firestore Sync)
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseUser,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDB } from './firebase';
import type { CustomerUser, CustomerAddress } from '../types/order';

const CUSTOMER_USER_KEY = 'fashiongate_customer_session';

/**
 * Reads local cached customer user session
 */
export function getLocalCustomerSession(): CustomerUser | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading customer user from localStorage:', e);
    return null;
  }
}

/**
 * Saves customer user session in localStorage
 */
export function saveLocalCustomerSession(user: CustomerUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CUSTOMER_USER_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fashiongate_profile_updated', { detail: user }));
    }
  } catch (e) {
    console.error('Error saving customer user to localStorage:', e);
  }
}

/**
 * Synchronize user profile into Firestore collection 'users/{uid}'
 */
export async function syncUserProfileToFirestore(user: CustomerUser): Promise<void> {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userDocRef);

    const now = new Date().toISOString();
    const payload: Partial<CustomerUser> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      lastLoginAt: now,
    };

    if (!existingSnap.exists()) {
      payload.createdAt = now;
      if (user.defaultAddress) {
        payload.defaultAddress = user.defaultAddress;
      }
    } else {
      const data = existingSnap.data() as CustomerUser;
      if (data.defaultAddress && !user.defaultAddress) {
        user.defaultAddress = data.defaultAddress;
      }
    }

    await setDoc(userDocRef, payload, { merge: true });
    saveLocalCustomerSession(user);
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}

/**
 * Fetch customer profile including saved addresses from Firestore
 */
export async function fetchCustomerProfile(uid: string): Promise<CustomerUser | null> {
  const db = getFirestoreDB();
  if (!db) return getLocalCustomerSession();

  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const user = snap.data() as CustomerUser;
      saveLocalCustomerSession(user);
      return user;
    }
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err);
  }
  return getLocalCustomerSession();
}

/**
 * Save / Update Full Customer Profile (Display Name, Phone, Photo, Gender, DOB, Style Preferences, Address)
 */
export async function updateCustomerProfile(
  uid: string,
  updates: Partial<CustomerUser>
): Promise<CustomerUser | null> {
  const current = getLocalCustomerSession();
  let updatedAddress = updates.defaultAddress || current?.defaultAddress;

  // If display name or phone is updated, also synchronize defaultAddress if present
  if (updatedAddress) {
    updatedAddress = {
      ...updatedAddress,
      ...(updates.displayName ? { fullName: updates.displayName } : {}),
      ...(updates.phoneNumber !== undefined ? { phone: updates.phoneNumber } : {}),
    };
  }

  const updatedUser: CustomerUser = current
    ? {
        ...current,
        ...updates,
        ...(updatedAddress ? { defaultAddress: updatedAddress } : {}),
        uid: current.uid,
        email: current.email, // email is locked to Google auth
        lastLoginAt: new Date().toISOString(),
      }
    : {
        uid,
        email: updates.email || '',
        displayName: updates.displayName || 'Fashion Gate Patron',
        phoneNumber: updates.phoneNumber || '',
        photoURL: updates.photoURL || '',
        gender: updates.gender,
        dateOfBirth: updates.dateOfBirth,
        preferredSize: updates.preferredSize,
        bio: updates.bio,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        ...(updatedAddress ? { defaultAddress: updatedAddress } : {}),
      };

  saveLocalCustomerSession(updatedUser);

  // Update Firebase Auth user profile if currentUser is active
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser) {
    try {
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (updates.displayName !== undefined) authUpdates.displayName = updates.displayName;
      if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL;
      if (Object.keys(authUpdates).length > 0) {
        await updateFirebaseUser(auth.currentUser, authUpdates);
      }
    } catch (err) {
      console.warn('Could not update Firebase Auth user profile object:', err);
    }
  }

  // Update Firestore
  const db = getFirestoreDB();
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const cleanUpdates: Record<string, any> = {};
      Object.entries(updates).forEach(([k, v]) => {
        if (v !== undefined) {
          cleanUpdates[k] = v;
        }
      });
      if (updatedAddress) {
        cleanUpdates.defaultAddress = updatedAddress;
      }
      cleanUpdates.lastLoginAt = new Date().toISOString();
      await setDoc(userDocRef, cleanUpdates, { merge: true });
    } catch (err) {
      console.warn('Could not update customer profile in Firestore:', err);
    }
  }

  return updatedUser;
}

/**
 * Save / Update Customer Default Address
 */
export async function saveCustomerAddress(
  uid: string,
  address: CustomerAddress
): Promise<CustomerUser | null> {
  const current = getLocalCustomerSession();
  const updatedUser: CustomerUser = current
    ? {
        ...current,
        defaultAddress: address,
        displayName: address.fullName || current.displayName,
        phoneNumber: address.phone || current.phoneNumber,
      }
    : {
        uid,
        email: '',
        displayName: address.fullName || 'Fashion Gate Patron',
        phoneNumber: address.phone || '',
        createdAt: new Date().toISOString(),
        defaultAddress: address,
      };

  saveLocalCustomerSession(updatedUser);

  const db = getFirestoreDB();
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const payload: Record<string, any> = {
        defaultAddress: address,
      };
      if (address.fullName) payload.displayName = address.fullName;
      if (address.phone) payload.phoneNumber = address.phone;
      await setDoc(userDocRef, payload, { merge: true });
    } catch (err) {
      console.warn('Could not save customer address to Firestore:', err);
    }
  }

  return updatedUser;
}

/**
 * Sign in with Instant VIP Test Account (for preview/testing before Firebase console setup)
 */
export async function signInWithQuickDemo(
  customEmail = 'vip.customer@fashiongate.lk',
  customName = 'Kasun Perera'
): Promise<CustomerUser> {
  const customerUser: CustomerUser = {
    uid: 'vip_' + btoa(customEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
    email: customEmail,
    displayName: customName,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    phoneNumber: '+94 77 123 4567',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    defaultAddress: {
      fullName: customName,
      phone: '+94 77 123 4567',
      address: 'No. 45/A, Thalawathugoda Road',
      city: 'Kotte',
      postalCode: '10100',
      province: 'Western Province (Colombo, Gampaha, Kalutara)',
    },
  };

  await syncUserProfileToFirestore(customerUser);
  saveLocalCustomerSession(customerUser);
  return customerUser;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGooglePopup(): Promise<CustomerUser> {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error('Firebase Authentication is not initialized. Please verify your Firebase project configuration.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const fbUser: FirebaseUser = result.user;

    const customerUser: CustomerUser = {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Fashion Gate Patron',
      photoURL: fbUser.photoURL || '',
      phoneNumber: fbUser.phoneNumber || '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Load any existing profile from Firestore or local cache so custom changes are preserved
    const existingProfile = await fetchCustomerProfile(customerUser.uid);
    if (existingProfile) {
      if (existingProfile.displayName) customerUser.displayName = existingProfile.displayName;
      if (existingProfile.phoneNumber) customerUser.phoneNumber = existingProfile.phoneNumber;
      if (existingProfile.photoURL) customerUser.photoURL = existingProfile.photoURL;
      if (existingProfile.defaultAddress) customerUser.defaultAddress = existingProfile.defaultAddress;
      if (existingProfile.gender) customerUser.gender = existingProfile.gender;
      if (existingProfile.dateOfBirth) customerUser.dateOfBirth = existingProfile.dateOfBirth;
      if (existingProfile.preferredSize) customerUser.preferredSize = existingProfile.preferredSize;
      if (existingProfile.bio) customerUser.bio = existingProfile.bio;
      if (existingProfile.createdAt) customerUser.createdAt = existingProfile.createdAt;
    }

    await syncUserProfileToFirestore(customerUser);
    saveLocalCustomerSession(customerUser);

    return customerUser;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    // Provide user-friendly message
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in request was cancelled.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
    } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
      throw new Error('FIREBASE_GOOGLE_NOT_ENABLED: Google Sign-In is not enabled in Firebase Authentication console. Please enable Google Provider in Firebase.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('FIREBASE_UNAUTHORIZED_DOMAIN: This domain is not authorized in Firebase Authentication console. Please add your domain to Authorized Domains.');
    }
    throw new Error(error.message || 'Google Sign-In failed. Please try again.');
  }
}

/**
 * Sign out customer user
 */
export async function signOutCustomer(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
  }
  saveLocalCustomerSession(null);
}

/**
 * Subscribe to Firebase Auth State changes
 */
export function subscribeToAuthState(
  onUserChanged: (user: CustomerUser | null) => void
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    const cached = getLocalCustomerSession();
    onUserChanged(cached);
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const cached = getLocalCustomerSession();
      // Fetch full profile from Firestore if available
      const remoteProfile = await fetchCustomerProfile(fbUser.uid);

      const customerUser: CustomerUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: remoteProfile?.displayName || cached?.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Fashion Gate Patron',
        photoURL: remoteProfile?.photoURL || cached?.photoURL || fbUser.photoURL || '',
        phoneNumber: remoteProfile?.phoneNumber || cached?.phoneNumber || fbUser.phoneNumber || '',
        gender: remoteProfile?.gender || cached?.gender,
        dateOfBirth: remoteProfile?.dateOfBirth || cached?.dateOfBirth,
        preferredSize: remoteProfile?.preferredSize || cached?.preferredSize,
        bio: remoteProfile?.bio || cached?.bio,
        createdAt: remoteProfile?.createdAt || cached?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        defaultAddress: remoteProfile?.defaultAddress || cached?.defaultAddress,
      };

      saveLocalCustomerSession(customerUser);
      onUserChanged(customerUser);
    } else {
      saveLocalCustomerSession(null);
      onUserChanged(null);
    }
  });
}
