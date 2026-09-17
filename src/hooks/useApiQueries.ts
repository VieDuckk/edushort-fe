import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getAuthToken } from "@/lib/api";

// 1. Fetch Videos feed
export function useVideosQuery(page = 1, limit = 20, categoryId?: number) {
  return useQuery({
    queryKey: ["videos", page, limit, categoryId],
    queryFn: async () => {
      const res = await api.getVideos(page, limit, categoryId);
      return res.data || [];
    },
  });
}

// 2. Fetch Quiz Question
export function useRandomQuestionQuery(videoIds: number[], enabled = false) {
  return useQuery({
    queryKey: ["randomQuestion", videoIds.join(",")],
    queryFn: () => api.getRandomQuestion(videoIds),
    enabled: enabled && videoIds.length > 0,
    retry: false,
  });
}

// 3. Submit Quiz Answer
export function useSubmitAnswerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      questionId: number;
      selectedOptionId: number;
      videoIds: number[];
    }) =>
      api.submitAnswer(data.questionId, data.selectedOptionId, data.videoIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewList"] });
    },
  });
}

// 4. Fetch Review List
export function useReviewListQuery() {
  const token = getAuthToken();
  return useQuery({
    queryKey: ["reviewList"],
    queryFn: () => api.getReviewList(),
    enabled: !!token,
  });
}

// 5. Auth Mutations
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.login(data.email, data.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["reviewList"] });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string; username: string }) =>
      api.register(data.email, data.password, data.username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["reviewList"] });
    },
  });
}
