import { TCategory } from "./category.types";
import { TBaseRecord } from "./common.types";

export type TQuestionOption = {
  id: number;
  label: string; // "A" | "B" | "C" | "D"
  content: string;
  isCorrect?: boolean;
  questionId: number;
};

export type TQuestion = TBaseRecord<{
  content: string;
  categoryId: number;
  category?: TCategory;
  options: TQuestionOption[];
}>;

export type TCreateQuestionOptionRequest = {
  label: string;
  content: string;
  isCorrect: boolean;
};

export type TCreateQuestionRequest = {
  content: string;
  categoryId: number;
  options: TCreateQuestionOptionRequest[];
};

export type TUpdateQuestionRequest = Partial<TCreateQuestionRequest>;

export type TGetQuestionResponse = TQuestion;
export type TGetQuestionsResponse = TQuestion[];
