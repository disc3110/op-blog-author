import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createPost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ToastProvider";

function NewPostPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  async function handleCreate(values) {
    setSubmitting(true);
    setError("");
    try {
      await createPost(values);
      toast.success("Post created")
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create post");
      setError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
        <h1 className="text-xl font-semibold">New Post</h1>
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
        <PostForm
          onSubmit={handleCreate}
          submitting={submitting}
          error={error}
          submitLabel="Create post"
        />
      </main>
    </div>
  );
}

export default NewPostPage;