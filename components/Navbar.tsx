"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // 2. Listen for login/logout events automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      router.refresh(); // Refresh page to update permissions
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">HealthForum</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />
            
            {user ? (
              // If Logged In: Show Profile & Logout
              <div className="flex items-center gap-3">
                 {/* User Avatar */}
                 {user.user_metadata.avatar_url && (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                 )}
                 <div className="hidden md:block text-sm">
                    <p className="font-medium text-gray-700">{user.user_metadata.full_name}</p>
                 </div>
                 <button 
                   onClick={handleLogout}
                   className="text-sm text-red-600 hover:text-red-800"
                 >
                   Logout
                 </button>
              </div>
            ) : (
              // If Logged Out: Show Login Button
              <button 
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
              >
                <img 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  className="w-4 h-4 bg-white rounded-full" 
                  alt="G" 
                />
                Login with Google
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}