import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  // 1. Read ?search= from URL
  const params = await searchParams;
  const query = params.search || "";

  // 2. Start query
  let supabaseQuery = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Apply filtering if searching
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%`
    );
  }

  // 4. Fetch posts
  const { data: posts, error } = await supabaseQuery;
  if (error) console.error("Error fetching posts:", error);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">

      {/* If searching, show tag */}
      {query && (
        <div className="mb-6 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm">
          Showing results for: <strong>{query}</strong>
        </div>
      )}

      {/* Header with Title + Ask Question Button */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Health Forum
        </h1>

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
            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {post.content}
            </p>
          </div>
        ))}

        {/* If no posts exist */}
        {posts?.length === 0 && (
          <p className="text-center text-gray-500">No discussions yet.</p>
        )}
      </div>
    </main>
  );
}
