import { apiRequest } from "./apiClient";

// Get comments for a specific post (backend: GET /api/posts/:postId/comments)
export async function fetchCommentsForPost(postId, { page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("pageSize", pageSize);

  return apiRequest(`/posts/${postId}/comments?${params.toString()}`);
}

// Delete a comment (backend: DELETE /api/comments/:id)
export async function deleteComment(commentId) {
  return apiRequest(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
