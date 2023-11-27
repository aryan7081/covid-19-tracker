import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
import { Mixpanel } from '@/utils/mixpanel';

const Context = createContext();

const SupabaseProvider = ({ children }) => {
  const [supabase] = useState(() => createClient('https://ketzhqjblfahcxvfkbqr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldHpocWpibGZhaGN4dmZrYnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU1MzM2NDAsImV4cCI6MjAxMTEwOTY0MH0.wtypurcHvcbvSsRgRo5jQXRkiaXABp_04si0TSJQ7JU'))

  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const location = useLocation(); // to get the current location

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthPath = location.pathname.startsWith('/auth/signIn') || location.pathname.startsWith('/auth/signUp');
      if (!session && !isAuthPath) {
        navigate('/auth/signIn', { replace: true });
      }
      
      if (event == "SIGNED_OUT") {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
        Mixpanel.track('Logout');
      } else {
        localStorage.setItem("session", JSON.stringify(session));
      }
      
      if (event === 'SIGNED_IN') {
        console.log('event', event, session.user.id);
        Mixpanel.identify(session.user.id);
      }

      if (event === 'SIGNED_IN' && isAuthPath) {
        console.log("redirecting");
        window.location.reload();
        navigate('/dashboard/explore', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  );
};


export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};

export default SupabaseProvider;
