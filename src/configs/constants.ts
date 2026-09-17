import { ACCESS_TOKEN_STORAGE_KEY, QUERY_KEYS } from "@/constants/keys.constants";

export const BACKEND_API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
export const TIME_OUT_API = 30000;
export const ACCESS_TOKEN_KEY = ACCESS_TOKEN_STORAGE_KEY;

export { QUERY_KEYS };
