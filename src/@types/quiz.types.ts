import { TQuestion, TQuestionOption } from "./question.types";
import { TVideo } from "./video.types";

export type TQuizAnswer = {
  id: number;
  userId: number;
  questionId: number;
  question?: TQuestion;
  selectedOptionId: number;
  selectedOption?: TQuestionOption;
  isCorrect: boolean;
  videoToReviewId: number | null;
  videoToReview?: TVideo | null;
  createdAt: string;
};

export type TSubmitQuizAnswerRequest = {
  questionId: number;
  selectedOptionId: number;
  videoIds?: number[];
  recentVideoIds?: number[];
};

export type TSubmitQuizAnswerResponse = {
  isCorrect: boolean;
  quizAnswer: TQuizAnswer;
  recommendedVideo?: TVideo | null;
};
