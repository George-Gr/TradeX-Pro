import { supabase } from '@/integrations/supabase/client';
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        if (requiredRole === 'admin') {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleError) {
            console.error('Role fetch error:', roleError);
            setIsAuthorized(false);
          } else {
            setIsAuthorized(roleData?.role === 'admin');
          }
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return null; // Or a loading spinner component
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
