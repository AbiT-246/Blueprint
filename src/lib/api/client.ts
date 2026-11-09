const DEFAULT_API_URL = "http://localhost:3001";
export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL}/api`;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getJson<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>(path, { method: "GET" });
}

export function postJson<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function request<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response, path), response.status);
  }

  return response.json() as Promise<TResponse>;
}

async function readErrorMessage(response: Response, path: string): Promise<string> {
  const fallback = `Request to ${path} failed with status ${response.status}`;

  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "message" in body) {
      const message = (body as { message: unknown }).message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
      if (Array.isArray(message) && message.every((item) => typeof item === "string")) {
        return message.join(", ");
      }
    }
  } catch {
    // Response body was not JSON; use the status fallback.
  }

  return fallback;
}
