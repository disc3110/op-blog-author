import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchMyPosts, fetchAllPosts, togglePublish } from "../services/postService";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";
import { useToast } from "../components/ToastProvider"; 

function DashboardPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const token = localStorage.getItem("authToken");
  const isAdmin = user?.role === "ADMIN";

  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all"); // all | true | false
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  async function loadPosts(options = {}) {
    setLoading(true);
    setError("");
    try {
      const page = options.page ?? meta.page;

      const res = await (isAdmin ? fetchAllPosts : fetchMyPosts)({
        page,
        pageSize: meta.pageSize,
        search,
        published: publishedFilter,
      });

      setPosts(res.posts);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      const message = err.message || "Failed to load posts";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedFilter, search]);

  async function handleTogglePublish(postId) {
    setActionLoadingId(postId);
    setError("");

    const target = posts.find((p) => p.id === postId);
    const wasPublished = target?.published;

    try {
      await togglePublish(postId);
      await loadPosts();

      if (wasPublished === true) {
        toast.success("Post unpublished");
      } else if (wasPublished === false) {
        toast.success("Post published");
      } else {
        toast.success("Post status updated");
      }
    } catch (err) {
      console.error(err);
      const message = err.message || "Failed to update publish status";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > meta.totalPages) return;
    loadPosts({ page: nextPage });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadPosts({ page: 1 });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <h1 className="text-xl font-semibold">{isAdmin ? "Admin Dashboard 🛠️" : "Author Dashboard ✍️"}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">
            {user?.name || user?.email}
          </span>
          <a
            href={`https://op-blog-public-production.up.railway.app?token=${token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Public Blog
          </a>
          <button
            onClick={logout}
            className="rounded-md border border-slate-600 px-3 py-1 text-xs hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-6xl w-full mx-auto">
        {/* Filters & actions */}
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{isAdmin ? "All Posts" : "My Posts"}</h2>
            <p className="text-xs text-slate-400">
              {isAdmin ? "Review and manage every post in the system." : "Manage your drafts and published articles."}
            </p>
          </div>

          <Link
            to="/posts/new"
            className="ml-0 md:ml-2 inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition"
          >
            New Post
          </Link>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search posts..."
                className="rounded-md bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-1 rounded-md bg-slate-900 border border-slate-700 p-1 text-xs">
              {[
                { value: "all", label: "All" },
                { value: "true", label: "Published" },
                { value: "false", label: "Drafts" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPublishedFilter(opt.value)}
                  className={`px-2 py-1 rounded-md transition ${
                    publishedFilter === opt.value
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/70 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Comments
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Likes
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Created
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Loading posts...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-t border-slate-800 hover:bg-slate-900/60"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-100">
                          {post.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {post.content}
                        </div>
                        {isAdmin && (
                          <div className="mt-1 text-xs text-slate-500">{post.author.name}</div>)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge published={post.published} />
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {post._count?.comments ?? 0}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {post._count?.likes ?? 0}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post.id)}
                          disabled={actionLoadingId === post.id}
                          className="inline-flex items-center rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                        >
                          {actionLoadingId === post.id
                            ? "Updating..."
                            : post.published
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="inline-flex items-center rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
            <div>
              Page <span className="font-semibold">{meta.page}</span> of{" "}
              <span className="font-semibold">{meta.totalPages}</span>{" "}
              · Total{" "}
              <span className="font-semibold">{meta.totalItems}</span> posts
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1 || loading}
                className="px-3 py-1 rounded-md border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-xs"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages || loading}
                className="px-3 py-1 rounded-md border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-xs"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;