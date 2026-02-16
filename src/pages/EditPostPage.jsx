import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { fetchPostById, updatePost, deletePost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";
import { fetchCommentsForPost, deleteComment } from "../services/commentService";
import { useToast } from "../components/ToastProvider";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsMeta, setCommentsMeta] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
  });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentActionId, setCommentActionId] = useState(null);
  const [commentsError, setCommentsError] = useState("");
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    async function loadPostAndComments() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPostById(Number(id));
        setInitialValues({
          title: data.post.title,
          content: data.post.content,
          published: data.post.published,
        });
        
        await loadComments({ page: 1 });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    loadPostAndComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadComments(options = {}) {
    const page = options.page ?? commentsMeta.page;
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const res = await fetchCommentsForPost(Number(id), {
        page,
        pageSize: commentsMeta.pageSize,
      });

      setComments(res.comments || []);
      setCommentsMeta(res.meta || commentsMeta);
    } catch (err) {
      console.error(err);
      setCommentsError(err.message || "Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleUpdate(values) {
    setSubmitting(true);
    setError("");
    try {
      await updatePost(Number(id), values);
      toast.success("Post updated");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update post");
      setError(err.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    setCommentActionId(commentId);
    setCommentsError("");
    try {
      await deleteComment(commentId);
      await loadComments(); // reload same page
      toast.success("Comment deleted");
    } catch (err) {
      console.error(err);
      setCommentsError(err.message || "Failed to delete comment");
    } finally {
      setCommentActionId(null);
    }
  }

  async function handleDeletePost() {
    const hasComments = (commentsMeta?.totalItems ?? 0) > 0;
    if (hasComments) {
      toast.error("Posts with comments can’t be deleted");
      return;
    }

    const ok = window.confirm(
      "Delete this post? This can’t be undone."
    );
    if (!ok) return;

    setDeletingPost(true);
    setError("");
    try {
      await deletePost(Number(id));
      toast.success("Post deleted");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete post");
      setError(err.message || "Failed to delete post");
    } finally {
      setDeletingPost(false);
    }
  }

  function handleCommentsPageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > commentsMeta.totalPages ||
      commentsLoading
    ) {
      return;
    }
    loadComments({ page: nextPage });
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
          <>
            {/* Delete post (only allowed when there are no comments) */}
            <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Danger zone</p>
                  {commentsMeta.totalItems > 0 ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Posts with comments can’t be deleted.
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">
                      You can delete this post because it has no comments.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={deletingPost || commentsMeta.totalItems > 0}
                  className="inline-flex items-center justify-center rounded-md border border-red-500/60 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentsMeta.totalItems > 0
                    ? "Can’t delete (has comments)"
                    : deletingPost
                    ? "Deleting…"
                    : "Delete post"}
                </button>
              </div>
            </div>

            <PostForm
              initialValues={initialValues}
              onSubmit={handleUpdate}
              submitting={submitting}
              error={error}
              submitLabel="Save changes"
            />

            {/* Comments management */}
            <section className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-100">
                  Comments
                </h2>
                <span className="text-xs text-slate-400">
                  {commentsMeta.totalItems} total
                </span>
              </div>

              {commentsError && (
                <div className="mb-3 rounded-md bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-xs">
                  {commentsError}
                </div>
              )}

              <div className="rounded-lg border border-slate-800 bg-slate-950/60">
                {commentsLoading ? (
                  <p className="px-4 py-4 text-xs text-slate-400">
                    Loading comments…
                  </p>
                ) : comments.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-slate-400">
                    No comments yet for this post.
                  </p>
                ) : (
                  <>
                    <ul className="divide-y divide-slate-800">
                      {comments.map((comment) => (
                        <li
                          key={comment.id}
                          className="px-4 py-3 flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm text-slate-100">
                              {comment.content}
                            </p>
                            <div className="mt-1 text-[11px] text-slate-400">
                              <span>
                                By {comment.author?.name || "Unknown"}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                {new Date(
                                  comment.createdAt
                                ).toLocaleString()}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{comment._count?.likes ?? 0} likes</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={commentActionId === comment.id}
                            className="inline-flex items-center rounded-md border border-red-500/60 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {commentActionId === comment.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Comments pagination */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <div>
                        Page{" "}
                        <span className="font-semibold">
                          {commentsMeta.page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {commentsMeta.totalPages}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleCommentsPageChange(commentsMeta.page - 1)
                          }
                          disabled={
                            commentsMeta.page <= 1 || commentsLoading
                          }
                          className="px-2 py-1 rounded-md border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCommentsPageChange(commentsMeta.page + 1)
                          }
                          disabled={
                            commentsMeta.page >= commentsMeta.totalPages ||
                            commentsLoading
                          }
                          className="px-2 py-1 rounded-md border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default EditPostPage;