import { TCategory } from "./category.types";
import { TBaseRecord, BaseApiParamsType } from "./common.types";
import { TUser } from "./user.types";

export enum EVideoStatus {
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
}

export type TVideo = TBaseRecord<{
  title: string;
  description: string | null;
  videoKey: string;
  videoUrl?: string;
  thumbnailKey: string | null;
  thumbnailUrl?: string;
  duration: number | null;
  fileSize: number | string | null;
  status: EVideoStatus;
  views: number;
  authorId: number;
  author?: TUser;
  categoryId: number | null;
  category?: TCategory | null;
}>;

export type TCreateVideoRequest = {
  title: string;
  description?: string;
  videoKey: string;
  thumbnailKey?: string;
  duration?: number;
  fileSize?: number;
  categoryId?: number;
};

export type TUpdateVideoRequest = Partial<TCreateVideoRequest> & {
  status?: EVideoStatus;
};

export type TVideoQueryParams = BaseApiParamsType & {
  categoryId?: number;
  status?: EVideoStatus;
  authorId?: number;
  sort?: "latest" | "oldest" | "popular" | "random";
};

import { MetadataApiType } from "./common.types";

export type TGetVideoResponse = TVideo;
export type TGetVideosResponse = {
  data: TVideo[];
  meta?: MetadataApiType;
} | TVideo[];
