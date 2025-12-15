"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function CreatePostPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetch logged-in user when page loads
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
        alert("Please log in to create a post.");
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, [router]);

  // If user not loaded yet, show temporary UI
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-500">Redirecting to login...</p>
      </div>
    );
  }

  // Handle Create Post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !user) return;

    setLoading(true);

    // ⭐ UPDATED INSERT BLOCK — NOW SAVES AUTHOR DETAILS TOO
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        category,
        user_id: user.id,
        author_name: user.user_metadata.full_name,
        author_avatar: user.user_metadata.avatar_url,
        votes: 0,
      },
    ]);

    if (error) {
      alert("Error creating post!");
      console.error(error);
      setLoading(false);
    } else {
      setTitle("");
      setContent("");
      setCategory("General");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="General">General Health</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Nutrition">Nutrition & Diet</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Fitness">Fitness & Exercise</option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Best diet for type 2 diabetes?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              required
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe your symptoms or question in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </main>
  );
}
