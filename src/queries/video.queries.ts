import { TQueryOptions } from "@/@types/common.types";
import {
  TCreateVideoRequest,
  TGetVideoResponse,
  TGetVideosResponse,
  TUpdateVideoRequest,
  TVideoQueryParams,
} from "@/@types/video.types";
import { videoApi } from "@/api/video/video.api";
import { QUERY_KEYS } from "@/configs/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TUseVideosQueryOptions = TQueryOptions<TGetVideosResponse>;

export function useVideosQuery(params?: TVideoQueryParams, options?: TUseVideosQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, params],
    queryFn: () => videoApi.getVideos(params),
    staleTime: 30_000,
    ...options,
  });
}

export type TUseVideoDetailQueryOptions = TQueryOptions<TGetVideoResponse>;

export function useVideoDetailQuery(id: number, options?: TUseVideoDetailQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEO_DETAIL, id],
    queryFn: () => videoApi.getVideoById(id),
    staleTime: 30_000,
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetVideoResponse, Error, TCreateVideoRequest>({
    mutationFn: (data) => videoApi.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] });
    },
  });
}

export function useUpdateVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetVideoResponse, Error, { id: number; data: TUpdateVideoRequest }>({
    mutationFn: ({ id, data }) => videoApi.updateVideo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEO_DETAIL, variables.id] });
    },
  });
}

export function useDeleteVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => videoApi.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] });
    },
  });
}
