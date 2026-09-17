import axios from "axios";
import {
  TCreateVideoRequest,
  TGetVideoResponse,
  TGetVideosResponse,
  TUpdateVideoRequest,
  TVideoQueryParams,
} from "@/@types/video.types";
import authorizedRequest from "../request";

export const videoApi = {
  getVideos: (params?: TVideoQueryParams) => {
    return authorizedRequest.get<TGetVideosResponse, TGetVideosResponse>("/videos", { params });
  },
  getVideoById: (id: number) => {
    return authorizedRequest.get<TGetVideoResponse, TGetVideoResponse>(`/videos/${id}`);
  },
  increaseVideoView: (id: number) => {
    return authorizedRequest.post<TGetVideoResponse, TGetVideoResponse>(`/videos/${id}/view`);
  },
  createVideo: (data: TCreateVideoRequest) => {
    return authorizedRequest.post<TGetVideoResponse, TGetVideoResponse>("/videos", data);
  },
  updateVideo: (id: number, data: TUpdateVideoRequest) => {
    return authorizedRequest.patch<TGetVideoResponse, TGetVideoResponse>(`/videos/${id}`, data);
  },
  deleteVideo: (id: number) => {
    return authorizedRequest.delete<{ success: boolean }, { success: boolean }>(`/videos/${id}`);
  },
  getUploadUrl: (data: { fileName: string; contentType: string }) => {
    return authorizedRequest.post<{ url: string; key: string }, { url: string; key: string }>(
      "/videos/upload-url",
      data
    );
  },
  getThumbnailUploadUrl: (data: { fileName: string; contentType: string }) => {
    return authorizedRequest.post<{ url: string; key: string }, { url: string; key: string }>(
      "/videos/thumbnail-upload-url",
      data
    );
  },
};

export async function uploadFileToStorage(
  file: File,
  type: "video" | "thumbnail",
  onProgress?: (percent: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await authorizedRequest.post<{ key: string; url: string }, { key: string; url: string }>(
    "/videos/upload-file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  return res.key;
}


