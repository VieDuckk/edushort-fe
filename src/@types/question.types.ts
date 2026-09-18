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
  videoId?: number | null;
  video?: { id: number; title: string; thumbnailKey?: string | null } | null;
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
  videoId?: number;
  options: TCreateQuestionOptionRequest[];
};

export type TUpdateOptionRequest = {
  id: number;
  content?: string;
  isCorrect?: boolean;
};

export type TUpdateQuestionRequest = {
  content?: string;
  categoryId?: number;
  videoId?: number;
  options?: TUpdateOptionRequest[];
};

export type TGetQuestionResponse = TQuestion;
export type TGetQuestionsResponse = TQuestion[];
