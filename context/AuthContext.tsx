import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount to persist session
    const stored = localStorage.getItem('moh_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('moh_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulate Network Request to Google Auth Provider
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Strict Access Control List (ACL)
    if (email.toLowerCase() === 'david@proux.co') {
      const newUser = {
        email,
        name: 'David Proux',
        avatar: 'https://ui-avatars.com/api/?name=David+Proux&background=0D8ABC&color=fff&size=128'
      };
      setUser(newUser);
      localStorage.setItem('moh_user', JSON.stringify(newUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moh_user');
    // Optional: Force reload to clear any sensitive in-memory states
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};