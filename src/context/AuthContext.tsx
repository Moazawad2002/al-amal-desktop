import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/erp';
import { mockDb } from '../services/mockDatabase';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isManager: boolean;
  isSalesRep: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  availableDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const demoUsers = mockDb.getUsers();
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('alamal_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return demoUsers[0]; // Default to Manager
      }
    }
    return demoUsers[0]; // Default to Manager for immediate review
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('alamal_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alamal_auth_user');
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // If Supabase is live, authenticate through Supabase Auth
    if (isSupabaseConfigured() && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          // Fetch profile from supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role,
              representativeId: profile.representative_id,
              phone: profile.phone,
            });
            return true;
          }
        }
      } catch (err) {
        console.error('Supabase Auth error:', err);
      }
    }

    // Fallback demo accounts matching email
    const match = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setUser(match);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  };

  const switchDemoUser = (userId: string) => {
    const target = demoUsers.find(u => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  const isManager = user?.role === 'manager';
  const isSalesRep = user?.role === 'sales_rep';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isManager,
        isSalesRep,
        login,
        logout,
        switchDemoUser,
        availableDemoUsers: demoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
