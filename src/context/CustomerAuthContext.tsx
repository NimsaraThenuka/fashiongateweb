import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CustomerUser, CustomerAddress } from '../types/order';
import {
  getLocalCustomerSession,
  signInWithGooglePopup,
  signInWithQuickDemo,
  signOutCustomer,
  subscribeToAuthState,
  saveCustomerAddress,
  updateCustomerProfile,
} from '../services/authService';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  signInWithGoogle: () => Promise<CustomerUser>;
  signInWithDemo: (customEmail?: string, customName?: string) => Promise<CustomerUser>;
  signOut: () => Promise<void>;
  updateSavedAddress: (address: CustomerAddress) => Promise<CustomerUser | null>;
  updateProfile: (updates: Partial<CustomerUser>) => Promise<CustomerUser | null>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => getLocalCustomerSession());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cross-tab auto sync for user session & profile updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashiongate_customer_session') {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Same-tab instant sync
    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<CustomerUser | null>;
      if (customEvent.detail !== undefined) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener('fashiongate_profile_updated', handleCustomSync);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fashiongate_profile_updated', handleCustomSync);
    };
  }, []);

  const signInWithGoogle = async (): Promise<CustomerUser> => {
    setLoading(true);
    try {
      const loggedUser = await signInWithGooglePopup();
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signInWithDemo = async (customEmail?: string, customName?: string): Promise<CustomerUser> => {
    setLoading(true);
    try {
      const demoUser = await signInWithQuickDemo(customEmail, customName);
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOutCustomer();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSavedAddress = async (address: CustomerAddress): Promise<CustomerUser | null> => {
    if (!user) return null;
    const updated = await saveCustomerAddress(user.uid, address);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const updateProfile = async (updates: Partial<CustomerUser>): Promise<CustomerUser | null> => {
    if (!user) return null;
    const updated = await updateCustomerProfile(user.uid, updates);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        signInWithGoogle,
        signInWithDemo,
        signOut,
        updateSavedAddress,
        updateProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
