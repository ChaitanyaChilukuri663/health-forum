"use client";

import { useEffect, Suspense } from "react"; // <--- Import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// 1. Create a Child Component that uses the search params
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const handleAuth = async () => {
      if (code) {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
          // Success! Go to homepage and refresh
          router.push("/");
          router.refresh();
        } else {
          console.error("Login error:", error);
          router.push("/"); // Go home anyway if it fails
        }
      }
    };

    handleAuth();
  }, [code, router]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Logging you in...</h2>
      <p className="text-gray-500 mt-2">Please wait a moment.</p>
    </div>
  );
}

// 2. Export the Parent Component wrapped in Suspense
export default function AuthCallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}