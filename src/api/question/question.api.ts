import {
  TCreateQuestionRequest,
  TGetQuestionResponse,
  TGetQuestionsResponse,
  TUpdateQuestionRequest,
} from "@/@types/question.types";
import authorizedRequest from "../request";

export const questionApi = {
  getQuestions: (params?: { categoryId?: number }) => {
    return authorizedRequest.get<TGetQuestionsResponse, TGetQuestionsResponse>("/questions", { params });
  },
  getQuestionById: (id: number) => {
    return authorizedRequest.get<TGetQuestionResponse, TGetQuestionResponse>(`/questions/${id}`);
  },
  createQuestion: (data: TCreateQuestionRequest) => {
    return authorizedRequest.post<TGetQuestionResponse, TGetQuestionResponse>("/questions", data);
  },
  updateQuestion: (id: number, data: TUpdateQuestionRequest) => {
    return authorizedRequest.patch<TGetQuestionResponse, TGetQuestionResponse>(`/questions/${id}`, data);
  },
  deleteQuestion: (id: number) => {
    return authorizedRequest.delete<{ success: boolean }, { success: boolean }>(`/questions/${id}`);
  },
};
