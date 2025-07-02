import React from 'react';
import { Navigate } from 'react-router-dom';

interface MemberProtectedRouteProps {
  children: React.ReactNode;
}

const MemberProtectedRoute: React.FC<MemberProtectedRouteProps> = ({ children }) => {
  // Check if member is authenticated by looking for memberData in localStorage
  const memberData = localStorage.getItem('memberData');
  
  if (!memberData) {
    // If no member data found, redirect to members login
    return <Navigate to="/members-login" replace />;
  }

  try {
    // Validate that the stored data is valid JSON
    const parsed = JSON.parse(memberData);
    if (!parsed.email || !parsed.id) {
      // If data is invalid, clear it and redirect to login
      localStorage.removeItem('memberData');
      return <Navigate to="/members-login" replace />;
    }
  } catch (error) {
    // If JSON is invalid, clear it and redirect to login
    localStorage.removeItem('memberData');
    return <Navigate to="/members-login" replace />;
  }

  // If member is authenticated, render the protected content
  return <>{children}</>;
};

export default MemberProtectedRoute; 