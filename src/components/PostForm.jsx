/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

function PostForm({
  initialValues,
  onSubmit,
  submitting,
  error,
  submitLabel = "Save",
}) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [published, setPublished] = useState(
    initialValues?.published ?? false
  );

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setContent(initialValues.content || "");
      setPublished(initialValues.published ?? false);
    }
  }, [initialValues]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, content, published });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="mb-2 rounded-md bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Title
        </label>
        <input
          type="text"
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Content
        </label>
        <textarea
          className="w-full min-h-[200px] rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          kkk
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Publish immediately</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-4 py-2 text-sm font-medium text-white transition"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;