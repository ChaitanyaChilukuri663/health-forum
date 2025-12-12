"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VoteButton({ postId, initialVotes }: { postId: string; initialVotes: number }) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false); // Prevents spamming clicks locally

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop the click from opening the post link if it's on a card
    e.stopPropagation();

    if (hasVoted) return; // If already voted, do nothing

    // 1. Update the UI instantly (Optimistic UI)
    setVotes(votes + 1);
    setHasVoted(true);

    // 2. Update the Database
    // We fetch the current count first to be safe, then add 1
    const { data: post } = await supabase
      .from('posts')
      .select('votes')
      .eq('id', postId)
      .single();

    if (post) {
        const newCount = (post.votes || 0) + 1;
        await supabase
          .from('posts')
          .update({ votes: newCount })
          .eq('id', postId);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted}
      className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition ${
        hasVoted 
          ? "bg-green-100 text-green-700 cursor-default" 
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <span>👍</span>
      <span>{votes}</span>
    </button>
  );
}