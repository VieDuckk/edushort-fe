import { BACKEND_API_ROOT, TIME_OUT_API } from "@/configs/constants";
import { getAuthToken, useAuthStore } from "@/state/auth";
import { useAuthModal } from "@/state/modal/auth";
import { authUtils } from "@/utils/auth";
import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from "axios";
import qs from "query-string";

export const serializeParams = (params: Record<string, any>) => {
  const { filter, sort, ...other } = params;
  const queryStr = qs.stringify(other);
  const strings: string[] = [];
  if (queryStr) strings.push(queryStr);

  if (typeof filter === "object" && filter !== null) {
    const filterStr = Object.entries(filter)
      .map(([key, value]) => `filter%5B${key}%5D=${value}`)
      .join("&");
    if (filterStr) {
      strings.push(filterStr);
    }
  }

  if (typeof sort === "object" && sort !== null) {
    const sortStr = Object.entries(sort)
      .map(([key, value]) => `sort%5B${key}%5D=${value}`)
      .join("&");
    if (sortStr) {
      strings.push(sortStr);
    }
  }

  return strings.join("&");
};

const CancelToken = axios.CancelToken.source();

const authorizedRequest: AxiosInstance = axios.create({
  baseURL: BACKEND_API_ROOT,
  cancelToken: CancelToken.token,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIME_OUT_API,
  paramsSerializer: {
    serialize: serializeParams,
  },
});

authorizedRequest.interceptors.request.use((config) => {
  const token = getAuthToken() || authUtils.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authorizedRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response?.data;
  },
  (error) => {
    const { response, config } = (error as AxiosError) || {};
    if (!response || !config) return Promise.reject(error);
    const status = response?.status;

    // if status is 401 Unauthorized, access token is expired or invalid
    if (status === HttpStatusCode.Unauthorized) {
      useAuthStore.getState().logout();
      useAuthModal.getState().openModal("login");
    }

    return Promise.reject(error);
  }
);

export default authorizedRequest;
