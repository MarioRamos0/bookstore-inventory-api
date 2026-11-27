const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type FieldErrors = Record<string, string[]>;

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string>;
}

interface ApiErrorPayload {
  message?: string;
  details?: Record<string, string[] | string>;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly backendMessage: string;
  readonly details: FieldErrors;

  constructor(
    backendMessage: string,
    status: number,
    statusText: string,
    details: FieldErrors = {}
  ) {
    super(`${status} ${statusText}: ${backendMessage}`);
    this.name = "ApiClientError";
    this.status = status;
    this.statusText = statusText;
    this.backendMessage = backendMessage;
    this.details = details;
  }

  get statusLabel(): string {
    return this.statusText ? `${this.status} ${this.statusText}` : `${this.status}`;
  }

  firstErrorPerField(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.details)
        .filter(([, messages]) => messages.length > 0)
        .map(([field, messages]) => [field, messages[0]])
    );
  }
}

function normalizeDetails(details: ApiErrorPayload["details"]): FieldErrors {
  if (!details || typeof details !== "object") return {};
  return Object.fromEntries(
    Object.entries(details).map(([field, value]) => [
      field,
      Array.isArray(value) ? value.map(String) : [String(value)],
    ])
  );
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildUrl(path: string, query?: Record<string, string>): string {
  const search = query ? `?${new URLSearchParams(query).toString()}` : "";
  return `${API_BASE_URL}${path}${search}`;
}

function toApiError(response: Response, payload: unknown): ApiClientError {
  const errorPayload = (payload ?? {}) as ApiErrorPayload;
  const details = normalizeDetails(errorPayload.details);
  const firstFieldError = Object.values(details)[0]?.[0];
  const message =
    firstFieldError || errorPayload.message || "Error en la solicitud";
  return new ApiClientError(
    message,
    response.status,
    response.statusText,
    details
  );
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, query }: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const hasBody = body !== undefined;
  const response = await fetch(buildUrl(path, query), {
    method,
    cache: "no-store",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const isNoContent = response.status === 204;
  const payload = isNoContent ? undefined : await readJson(response);

  if (!response.ok) {
    throw toApiError(response, payload);
  }

  return {
    data: payload as T,
    status: response.status,
    statusText: response.statusText || (isNoContent ? "No Content" : ""),
  };
}
