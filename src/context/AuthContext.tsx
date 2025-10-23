import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth-context-definitions';

interface AuthState {
  session: Session | null;
  user: User | null;
  userRole: 'admin' | 'user' | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    userRole: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateAuthState = async (session: Session | null) => {
    if (!session) {
      setAuthState({
        session: null,
        user: null,
        userRole: null,
        loading: false,
      });
      return;
    }

    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      setAuthState({
        session,
        user: session.user,
        userRole: roleData?.role as 'admin' | 'user' | null,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching user role:', error);
      setAuthState({
        session,
        user: session.user,
        userRole: 'user', // Default to user role
        loading: false,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (authState.loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
