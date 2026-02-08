import { apiRequest } from "./apiClient";

// Fetch current author's posts (backend: GET /api/posts/mine)
export async function fetchMyPosts({ page = 1, pageSize = 10, search = "", published = "all" } = {}) {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("pageSize", pageSize);

  if (search) params.set("search", search);
  if (published && published !== "all") params.set("published", published);

  return apiRequest(`/posts/mine?${params.toString()}`);
}

// Toggle publish/unpublish (PATCH /api/posts/:id/publish)
export async function togglePublish(postId) {
  return apiRequest(`/posts/${postId}/publish`, {
    method: "PATCH",
  });
}


export async function createPost({ title, content, published = false }) {
  return apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, published }),
  });
}

export async function updatePost(postId, { title, content, published }) {
  return apiRequest(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ title, content, published }),
  });
}

export async function fetchPostById(postId) {
  return apiRequest(`/posts/${postId}`, {
    method: "GET",
  });
}
