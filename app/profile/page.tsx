import { createClient } from "@/lib/supabaseServer"; 
import { redirect } from "next/navigation";
import Link from "next/link";
import DeletePost from "@/components/DeletePost";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/");
  }

  // Fetch user's posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Stats
  const safePosts = posts || [];
  const totalPosts = safePosts.length;
  const totalVotes = safePosts.reduce(
    (acc: number, post: any) => acc + (post.votes || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-50 mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              {user.user_metadata.full_name}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <span className="block text-3xl font-bold text-blue-600">
                {totalPosts}
              </span>
              <span className="text-sm text-blue-800 font-medium">
                Questions Asked
              </span>
            </div>

            <div className="bg-green-50 p-6 rounded-lg text-center">
              <span className="block text-3xl font-bold text-green-600">
                {totalVotes}
              </span>
              <span className="text-sm text-green-800 font-medium">
                Upvotes Received
              </span>
            </div>
          </div>
        </div>

        {/* POST HISTORY */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Contribution History</h2>

        <div className="space-y-4">
          {safePosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group"
            >
              <div>
                <Link href={`/post/${post.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                </Link>

                <div className="flex gap-3 text-sm text-gray-500 mt-1">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 rounded">{post.category}</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">
                    👍 {post.votes} votes
                  </span>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DeletePost postId={post.id} authorId={post.user_id} />
              </div>
            </div>
          ))}

          {totalPosts === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              <p>You haven't posted anything yet.</p>
              <Link
                href="/create-post"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Ask your first question
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
