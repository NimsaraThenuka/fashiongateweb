import React, { createContext, useContext, useState } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'fashiongate_admin_session';

// Designated authorized credentials
const AUTH_EMAIL = 'fashiongate777@gmail.com';
const AUTH_PASS = 'FG1237FG#';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed && parsed.email === AUTH_EMAIL && parsed.token === 'fg_auth_valid';
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed?.email || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate brief network verification for realism
    await new Promise(r => setTimeout(r, 600));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === AUTH_EMAIL.toLowerCase() && cleanPass === AUTH_PASS) {
      const sessionData = {
        email: AUTH_EMAIL,
        token: 'fg_auth_valid',
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      setIsAuthenticated(true);
      setAdminEmail(AUTH_EMAIL);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your email and password.',
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
