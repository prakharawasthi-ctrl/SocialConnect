// src/hooks/useIsAdmin.ts

import { useAuth } from './useAuth';

export function useIsAdmin() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  return {
    isAdmin,
    user
  };
}

// Example usage in a component:
/*
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function SomeComponent() {
  const { isAdmin } = useIsAdmin();
  
  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }
  
  return (
    <div>
      <h1>Admin Panel</h1>
      // Admin-only content here
    </div>
  );
}
*/