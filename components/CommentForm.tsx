"use client"; // Interactive component

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId }: { postId: string }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from('comments')
      .insert([
        { content: comment, post_id: postId }
      ]);

    if (error) {
      console.error(error);
      alert("Failed to post comment");
    } else {
      setComment(""); // Clear the box
      router.refresh(); // Reload the page to show the new comment
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Add to the discussion</h3>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        rows={3}
        placeholder="Share your experience or advice..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}