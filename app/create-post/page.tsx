"use client"; // This tells Next.js this is an interactive page (Client Side)

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("General"); // <-- new
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the form from refreshing the page
    setLoading(true);

    // 1. Send data to Supabase (include category)
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        category, // <-- added
      },
    ]);

    if (error) {
      alert("Error creating post!");
      console.error(error);
      setLoading(false);
    } else {
      // 2. If successful, go back to the homepage
      setTitle("");
      setContent("");
      setCategory("General");
      router.push("/");
      router.refresh(); // Force the homepage to reload the new data
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow border"
      >
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
            <option value="Nutrition">Nutrition &amp; Diet</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Fitness">Fitness &amp; Exercise</option>
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
  );
}
