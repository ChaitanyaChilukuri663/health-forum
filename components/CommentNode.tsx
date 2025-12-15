"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentNode({ comment, user, onReplyPosted }: { comment: any, user: any, onReplyPosted: () => void }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle submitting a reply
  const handleReply = async () => {
    if (!replyContent.trim()) return;
    
    setLoading(true);
    const { error } = await supabase.from('comments').insert([{
      content: replyContent,
      post_id: comment.post_id,
      parent_id: comment.id, // <--- This links it to THIS comment
      user_id: user.id,
      author_name: user.user_metadata.full_name,
      author_avatar: user.user_metadata.avatar_url
    }]);

    if (!error) {
      setReplyContent("");
      setIsReplying(false);
      onReplyPosted(); // Tell the parent to refresh the list
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-3 mt-4">
      {/* Avatar Line (Visual Thread Guide) */}
      <div className="flex flex-col items-center">
        <img 
          src={comment.author_avatar || "https://www.gravatar.com/avatar/?d=mp"} 
          className="w-8 h-8 rounded-full border border-gray-200 z-10 bg-white"
        />
        {/* The gray vertical line */}
        {comment.children.length > 0 && (
            <div className="w-px h-full bg-gray-200 mt-2"></div>
        )}
      </div>

      <div className="flex-1">
        {/* Comment Bubble */}
        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm text-gray-900">{comment.author_name}</span>
            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-800 text-sm">{comment.content}</p>
        </div>

        {/* Action Bar (Reply Button) */}
        <div className="mt-1 mb-2">
            {user && (
                <button 
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs font-bold text-gray-500 hover:text-blue-600 transition"
                >
                    {isReplying ? "Cancel" : "Reply"}
                </button>
            )}
        </div>

        {/* Reply Input Box (Hidden until Reply clicked) */}
        {isReplying && (
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.author_name}...`}
                    className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                />
                <button 
                    onClick={handleReply}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold"
                >
                    Reply
                </button>
            </div>
        )}

        {/* RECURSION: Render Children Comments Here */}
        {comment.children.length > 0 && (
          <div className="pl-4"> {/* Indent the replies */}
            {comment.children.map((child: any) => (
              <CommentNode 
                key={child.id} 
                comment={child} 
                user={user} 
                onReplyPosted={onReplyPosted} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}