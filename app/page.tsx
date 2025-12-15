import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import VoteButton from "@/components/VoteButton";
import DeletePost from "@/components/DeletePost";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  // Read URL params
  const params = await searchParams;
  const query = params.search || "";
  const category = params.category || "";

  // Simple query (no JOIN)
  let supabaseQuery = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // Filter by search text
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%`
    );
  }

  // Filter by category
  if (category) {
    supabaseQuery = supabaseQuery.eq("category", category);
  }

  // Fetch posts
  const { data: posts, error } = await supabaseQuery;
  if (error) console.error("Error fetching posts:", error);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">

      {/* If search active, show banner */}
      {query && (
        <div className="mb-6 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm">
          Showing results for: <strong>{query}</strong>
        </div>
      )}

      {/* If category filtered */}
      {category && (
        <div className="mb-6 flex items-center gap-4">
          <span className="text-xl font-bold text-gray-800">
            Topic: {category}
          </span>

          <Link
            href="/"
            className="text-sm text-red-600 hover:underline bg-red-50 px-3 py-1 rounded-full"
          >
            ✕ Clear Filter
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Health Forum</h1>

        <Link
          href="/create-post"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Ask Question
        </Link>
      </div>

      {/* Posts List */}
      <div className="w-full max-w-2xl grid gap-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
          >
            {/* TOP ROW: Category + Vote + Delete */}
            <div className="flex justify-between items-start mb-2">

              {/* LEFT SIDE: Category + Vote */}
              <div className="flex gap-2 items-center">
                {/* Clickable Category Badge */}
                <Link
                  href={`/?category=${post.category}`}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded hover:bg-blue-200 transition"
                >
                  {post.category || "General"}
                </Link>

                {/* Vote Button */}
                <VoteButton postId={post.id} initialVotes={post.votes || 0} />
              </div>

              {/* RIGHT SIDE: Delete Button (updated → no currentUserId needed) */}
              <DeletePost postId={post.id} authorId={post.user_id} />
            </div>

            {/* AUTHOR INFO */}
            {post.author_name && (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={post.author_avatar || "/default-avatar.png"}
                  alt={post.author_name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-gray-500">
                  {post.author_name}
                </span>
              </div>
            )}

            {/* TITLE + CONTENT */}
            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mt-2 line-clamp-3 text-sm">
              {post.content}
            </p>
          </div>
        ))}

        {/* No posts fallback */}
        {posts?.length === 0 && (
          <p className="text-center text-gray-500">No discussions yet.</p>
        )}
      </div>
    </main>
  );
}
