import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  courses?: any[];
}

interface AuthContextType {
  // Admin authentication
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Student authentication
  isStudent: boolean;
  studentUser: User | null;
  loginAsStudent: (userData: User) => void;
  logoutStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [studentUser, setStudentUser] = useState<User | null>(null);

  // Check for existing student session on component mount
  useEffect(() => {
    const memberData = localStorage.getItem('memberData');
    if (memberData) {
      try {
        const userData = JSON.parse(memberData);
        setIsStudent(true);
        setStudentUser(userData);
        console.log('👨‍🎓 Student session restored:', userData.name);
      } catch (error) {
        console.error('Error parsing member data:', error);
        localStorage.removeItem('memberData');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Validate against admin credentials
    const isValidAdmin = username === 'sm@ptuniverse.com' && password === 'RA7xmjv.AE#_?pi';
    
    if (isValidAdmin) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      // Clear any student session when admin logs in
      setIsStudent(false);
      setStudentUser(null);
      localStorage.removeItem('memberData');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    // Also clear student session
    setIsStudent(false);
    setStudentUser(null);
    localStorage.removeItem('memberData');
  };

  const loginAsStudent = (userData: User) => {
    setIsStudent(true);
    setStudentUser(userData);
    // Clear admin session when student logs in
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    // Store in localStorage
    localStorage.setItem('memberData', JSON.stringify({
      ...userData,
      loginTime: new Date().toISOString()
    }));
    
    console.log('👨‍🎓 Student logged in:', userData.name);
  };

  const logoutStudent = () => {
    setIsStudent(false);
    setStudentUser(null);
    localStorage.removeItem('memberData');
    console.log('👋 Student logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout,
      isStudent,
      studentUser,
      loginAsStudent,
      logoutStudent
    }}>
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