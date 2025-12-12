"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"; // We will install this in a second

export default function SearchBar() {
  const router = useRouter();
  const [text, setText] = useState("");
  
  // "Debounce" means: Wait 500ms after I stop typing before searching.
  // This prevents the website from freezing while you type fast.
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    if (!query) {
      router.push("/"); // If empty, go to home
    } else {
      router.push(`/?search=${query}`); // Add ?search=word to URL
    }
  }, [query, router]);

  return (
    <div className="relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search topics..."
        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 outline-none"
      />
      {/* Search Icon (SVG) */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
    </div>
  );
}