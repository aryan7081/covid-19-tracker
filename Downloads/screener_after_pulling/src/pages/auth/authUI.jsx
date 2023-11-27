import { Auth } from '@supabase/auth-ui-react'
import { useState, useEffect } from 'react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { useSupabase } from '../../supabaseProvider';


export default function AuthUI({view}) {
    const [session, setSession] = useState(null)
    const { supabase } = useSupabase();
    
    return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={[]}
        redirectTo={`/dashboard/callback`}
        view={view}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: { background: '#EB5017', color: 'white', border: '#EB5017' },
            anchor: { color: '#CC400C' },
            message: {color: 'rgb(255 73 5)', fontSize: '20px'}
          },
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b'
              }
            }
          }
        }}
      />
    </div>
  );
}
