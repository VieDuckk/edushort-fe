import { TBaseRecord } from "./common.types";

export type TCategory = TBaseRecord<{
  name: string;
  slug: string;
}>;

export type TCreateCategoryRequest = {
  name: string;
  slug: string;
};

export type TUpdateCategoryRequest = Partial<{
  name: string;
  slug: string;
}>;

export type TGetCategoryResponse = TCategory;
export type TGetCategoriesResponse = TCategory[];
