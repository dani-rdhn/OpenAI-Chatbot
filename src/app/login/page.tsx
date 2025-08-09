// import React from 'react';
//    import { supabase } from '../../lib/supabaseClient';
//    import { useRouter } from 'next/navigation';

//    const LoginPage = () => {
//      const router = useRouter();

//      const handleLogin = async () => {
//        const { user, error } = await supabase.auth.signInWithOAuth({
//          provider: 'github',
//        });

//        if (error) {
//          console.error('Login error', error);
//        } else {
//          router.push('/');
//        }
//      };

//      return (
//        <div>
//          <h1>Login</h1>
//          <button onClick={handleLogin}>Login with GitHub</button>
//        </div>
//      );
//    };

//    export default LoginPage;