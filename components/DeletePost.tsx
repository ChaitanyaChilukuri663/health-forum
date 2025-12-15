"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DeletePost({ postId, authorId }: { postId: string, authorId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    checkUser();
  }, []);

  // FIX 1: If I am not logged in, OR IDs don't match, hide button.
  if (!currentUserId || currentUserId !== authorId) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    setIsDeleting(true);

    // FIX 2: We ask Supabase to return the 'count' of deleted rows
    const { error, count } = await supabase
      .from('posts')
      .delete({ count: 'exact' }) // <--- This is important
      .eq('id', postId);

    if (error) {
      alert("Error: " + error.message);
      setIsDeleting(false);
    } else if (count === 0) {
      // If no error, but count is 0, it means RLS blocked us silently
      alert("Permission denied: You cannot delete this post.");
      setIsDeleting(false);
    } else {
      // Success!
      router.refresh(); 
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition ml-auto"
      title="Delete Post"
    >
      {isDeleting ? "..." : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      )}
    </button>
  );
}