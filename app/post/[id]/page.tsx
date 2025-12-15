import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import CommentSection from "@/components/CommentSection"; // ⭐ NEW
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  // 1. Await params (Next.js 15 fix)
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 2. Fetch this specific post
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return (
      <div className="p-10 text-center text-red-500">
        Post not found. (ID: {id})
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl">

        {/* Back Button */}
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">
          &larr; Back to Home
        </Link>

        {/* MAIN POST */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* ⭐ New Comment Section Component */}
        <CommentSection postId={post.id} />

      </div>
    </main>
  );
}
