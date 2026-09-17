import { TQueryOptions } from "@/@types/common.types";
import {
  TCreateQuestionRequest,
  TGetQuestionResponse,
  TGetQuestionsResponse,
  TUpdateQuestionRequest,
} from "@/@types/question.types";
import { questionApi } from "@/api/question/question.api";
import { QUERY_KEYS } from "@/configs/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TUseQuestionsQueryOptions = TQueryOptions<TGetQuestionsResponse>;

export function useQuestionsQuery(params?: { categoryId?: number }, options?: TUseQuestionsQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTIONS, params],
    queryFn: () => questionApi.getQuestions(params),
    staleTime: 60_000,
    ...options,
  });
}

export type TUseQuestionDetailQueryOptions = TQueryOptions<TGetQuestionResponse>;

export function useQuestionDetailQuery(id: number, options?: TUseQuestionDetailQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTION_DETAIL, id],
    queryFn: () => questionApi.getQuestionById(id),
    staleTime: 60_000,
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetQuestionResponse, Error, TCreateQuestionRequest>({
    mutationFn: (data) => questionApi.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTIONS] });
    },
  });
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetQuestionResponse, Error, { id: number; data: TUpdateQuestionRequest }>({
    mutationFn: ({ id, data }) => questionApi.updateQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_DETAIL, variables.id] });
    },
  });
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => questionApi.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTIONS] });
    },
  });
}
