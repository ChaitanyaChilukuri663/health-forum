"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildCommentTree } from "@/lib/commentTree";
import CommentNode from "./CommentNode";

export default function CommentSection({ postId }: { postId: string }) {
  const [commentTree, setCommentTree] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [mainComment, setMainComment] = useState("");

  // 1. Fetch & Build Tree
  const fetchComments = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true }); // Oldest first

    if (data) {
        const tree = buildCommentTree(data);
        setCommentTree(tree);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 2. Handle Main Post Comment
  const handlePostMainComment = async () => {
    if (!mainComment.trim() || !user) return;

    await supabase.from('comments').insert([{
        content: mainComment,
        post_id: postId,
        parent_id: null, // Root comment
        user_id: user.id,
        author_name: user.user_metadata.full_name,
        author_avatar: user.user_metadata.avatar_url
    }]);

    setMainComment("");
    fetchComments();
  };

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>

      {/* Main Comment Input */}
      {user ? (
          <div className="flex gap-4 mb-8">
             <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full" />
             <div className="flex-1">
                 <textarea 
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="What are your thoughts?"
                    rows={2}
                 />
                 <button 
                    onClick={handlePostMainComment}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700"
                 >
                    Comment
                 </button>
             </div>
          </div>
      ) : (
          <div className="p-4 bg-blue-50 text-blue-800 rounded mb-8 text-center">
              Please login to join the discussion.
          </div>
      )}

      {/* Render The Tree */}
      <div className="space-y-2">
        {commentTree.map((rootComment) => (
            <CommentNode 
                key={rootComment.id} 
                comment={rootComment} 
                user={user}
                onReplyPosted={fetchComments}
            />
        ))}
        {commentTree.length === 0 && <p className="text-gray-400 italic">No comments yet.</p>}
      </div>
    </div>
  );
}