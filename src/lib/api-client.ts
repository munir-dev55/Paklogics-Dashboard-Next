import { getAccessToken, clearSession } from "@/lib/auth-session";
import { ApiError } from "@/lib/api-error";
import type { ApiResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

function getBaseUrl() {
  if (!API_BASE_URL) {
    throw new ApiError(500, "API base URL is not configured.");
  }

  return API_BASE_URL.replace(/\/$/, "");
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getAccessToken() : null;

  let response: Response;

  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Please try again.");
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.status, "Unable to read the server response.");
  }

  if (!response.ok || !payload.success) {
    const statusCode = payload.statusCode || response.status;

    if (auth && statusCode === 401) {
      clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.replace("/auth/signin");
      }
    }

    throw new ApiError(
      statusCode,
      payload.message || "Request failed.",
      "errors" in payload ? payload.errors ?? [] : [],
    );
  }

  return payload.data;
}
