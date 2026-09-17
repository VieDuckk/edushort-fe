import { TQueryOptions } from "@/@types/common.types";
import { TQuestion } from "@/@types/question.types";
import { TQuizAnswer, TSubmitQuizAnswerRequest, TSubmitQuizAnswerResponse } from "@/@types/quiz.types";
import { quizApi } from "@/api/quiz/quiz.api";
import { QUERY_KEYS } from "@/configs/constants";
import useAuthQuery from "@/hooks/useAuthQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TUseRandomQuestionQueryOptions = TQueryOptions<TQuestion>;

export function useRandomQuestionQuery(videoIds: number[], options?: TUseRandomQuestionQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUIZ_QUESTION, videoIds.join(",")],
    queryFn: () => quizApi.getRandomQuestion(videoIds),
    enabled: videoIds.length > 0 && (options?.enabled ?? true),
    retry: false,
    ...options,
  });
}

export function useSubmitQuizAnswerMutation() {
  const queryClient = useQueryClient();

  return useMutation<TSubmitQuizAnswerResponse, Error, TSubmitQuizAnswerRequest>({
    mutationFn: (data) => quizApi.submitAnswer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUIZ_REVIEW_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUIZ_ANSWERS] });
    },
  });
}

export type TUseQuizReviewListQueryOptions = TQueryOptions<TQuizAnswer[]>;

export function useReviewListQuery(options?: TUseQuizReviewListQueryOptions) {
  return useAuthQuery({
    queryKey: [QUERY_KEYS.QUIZ_REVIEW_LIST],
    queryFn: () => quizApi.getReviewList(),
    staleTime: 30_000,
    ...options,
    enabled: options?.enabled ?? false,
  });
}

export type TUseQuizAnswersQueryOptions = TQueryOptions<TQuizAnswer[]>;

export function useQuizAnswersQuery(options?: TUseQuizAnswersQueryOptions) {
  return useAuthQuery({
    queryKey: [QUERY_KEYS.QUIZ_ANSWERS],
    queryFn: () => quizApi.getQuizAnswers(),
    staleTime: 30_000,
    ...options,
    enabled: options?.enabled ?? false,
  });
}
