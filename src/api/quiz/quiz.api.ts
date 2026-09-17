import { TQuestion } from "@/@types/question.types";
import { TQuizAnswer, TSubmitQuizAnswerRequest, TSubmitQuizAnswerResponse } from "@/@types/quiz.types";
import authorizedRequest from "../request";

export const quizApi = {
  getRandomQuestion: (videoIds: number[]) => {
    const videoIdsStr = videoIds.join(",");
    return authorizedRequest.get<TQuestion, TQuestion>(`/quiz/question`, {
      params: videoIdsStr ? { videoIds: videoIdsStr } : {},
    });
  },
  submitAnswer: (data: TSubmitQuizAnswerRequest) => {
    return authorizedRequest.post<TSubmitQuizAnswerResponse, TSubmitQuizAnswerResponse>("/quiz/answer", data);
  },
  getQuizAnswers: () => {
    return authorizedRequest.get<TQuizAnswer[], TQuizAnswer[]>("/quiz/answers");
  },
  getReviewList: () => {
    return authorizedRequest.get<TQuizAnswer[], TQuizAnswer[]>("/quiz/review");
  },
};
