import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClientProfile } from '../types';
import { storageService } from '../services/storageService';
import { INITIAL_CLIENT } from '../data/mockData';

interface AuthContextType {
  user: ClientProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (data: Partial<ClientProfile> & { password?: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<ClientProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientProfile | null>(() => {
    // Check storage or default to initial active demo session for seamless navigation
    const savedUser = storageService.getAuthUser();
    return savedUser || storageService.getClient();
  });

  useEffect(() => {
    if (user) {
      storageService.setAuthUser(user);
    } else {
      storageService.setAuthUser(null);
    }
  }, [user]);

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedClient = storageService.getClient();

    // Check against current client or demo credentials
    if (
      (cleanEmail === 'v.malhotra@raymondapparel.in' && pass === 'LoomPilot@2026') ||
      (cleanEmail === storedClient.email.toLowerCase() && (pass === 'LoomPilot@2026' || pass === 'password123'))
    ) {
      setUser(storedClient);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid corporate credentials. Please check your work email and password.',
    };
  };

  const register = (data: Partial<ClientProfile> & { password?: string }) => {
    if (!data.company || !data.email || !data.contactPerson) {
      return { success: false, error: 'Please fill in all mandatory enterprise registration fields.' };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newProfile: ClientProfile = {
      ...INITIAL_CLIENT,
      ...data,
      id: `CLI-CLIENT-${randomSuffix}`,
      clientCode: `CLT-IND-${randomSuffix}`,
      accountTier: 'Enterprise Tier 2 (Standard Mill Access)',
    };

    storageService.setClient(newProfile);
    setUser(newProfile);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    storageService.setAuthUser(null);
  };

  const updateProfile = (updates: Partial<ClientProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      storageService.setClient(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

