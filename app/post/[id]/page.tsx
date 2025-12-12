import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import { notFound } from "next/navigation";

// Define the type for the props
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  // 1. AWAIT the params (This is the fix for Next.js 15)
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 2. Fetch the specific post
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

  // 3. Fetch the comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl">
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">
          &larr; Back to Home
        </Link>

        {/* Main Post */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Discussion ({comments?.length || 0})
          </h3>

          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded border border-gray-100 shadow-sm"
            >
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          {/* <- Replaced placeholder with CommentForm */}
          <CommentForm postId={id} />
        </div>
      </div>
    </main>
  );
}
