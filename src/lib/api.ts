const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("edushort.at");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("edushort.at", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("edushort.at");
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}

export const api = {
  // Videos
  getVideos: async (page = 1, limit = 10, categoryId?: number) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (categoryId) params.append("categoryId", String(categoryId));
    return fetchApi(`/videos?${params.toString()}`);
  },

  increaseVideoView: async (id: number) => {
    return fetchApi(`/videos/${id}/view`, { method: "POST" });
  },

  // Quiz
  getRandomQuestion: async (videoIds: number[]) => {
    const params = new URLSearchParams();
    if (videoIds.length > 0) {
      params.append("videoIds", videoIds.join(","));
    }
    return fetchApi(`/quiz/question?${params.toString()}`);
  },

  submitAnswer: async (
    questionId: number,
    selectedOptionId: number,
    videoIds: number[],
  ) => {
    return fetchApi("/quiz/answer", {
      method: "POST",
      body: JSON.stringify({ questionId, selectedOptionId, videoIds }),
    });
  },

  getReviewList: async () => {
    return fetchApi("/quiz/review");
  },

  // Auth
  login: async (email: string, password: string) => {
    const data = await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  register: async (email: string, password: string, username: string) => {
    const data = await fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });
    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  getMe: async () => {
    return fetchApi("/auth/me");
  },
};
