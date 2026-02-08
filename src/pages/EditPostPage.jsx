import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { fetchPostById, updatePost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPostById(Number(id));
        setInitialValues({
          title: data.post.title,
          content: data.post.content,
          published: data.post.published,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleUpdate(values) {
    setSubmitting(true);
    setError("");
    try {
      await updatePost(Number(id), values);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
        <h1 className="text-xl font-semibold">Edit Post</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">
            {user?.name || user?.email}
          </span>
          <button
            onClick={logout}
            className="rounded-md border border-slate-600 px-3 py-1 text-xs hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-3xl w-full mx-auto">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading post…</p>
        ) : (
          <PostForm
            initialValues={initialValues}
            onSubmit={handleUpdate}
            submitting={submitting}
            error={error}
            submitLabel="Save changes"
          />
        )}
      </main>
    </div>
  );
}

export default EditPostPage;