import { API_BASE_URL, getJson, postJson } from "./client";

const MESHY_POLL_INTERVAL_MS = 5_000;

export type MeshyTaskStatusValue = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";

export interface MeshyCreateTaskResponse {
  result: string;
}

export interface MeshyModelUrls {
  glb?: string;
  fbx?: string;
  obj?: string;
  usdz?: string;
}

export interface MeshyTaskError {
  message?: string;
}

export interface MeshyTaskStatus {
  id: string;
  status: MeshyTaskStatusValue;
  progress?: number;
  model_urls?: MeshyModelUrls;
  thumbnail_url?: string;
  task_error?: MeshyTaskError;
}

interface CreateImageTo3DFromUrlRequest {
  imageUrl: string;
}

export interface WaitForMeshyTaskOptions {
  intervalMs?: number;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export function createImageTo3DFromUrl(imageUrl: string): Promise<MeshyCreateTaskResponse> {
  return postJson<CreateImageTo3DFromUrlRequest, MeshyCreateTaskResponse>(
    "/meshy/image-to-3d-from-url",
    { imageUrl },
  );
}

export function getMeshyTaskStatus(taskId: string): Promise<MeshyTaskStatus> {
  return getJson<MeshyTaskStatus>(`/meshy/tasks/${encodeURIComponent(taskId)}`);
}

/** Same-origin proxy URL so Three.js can load Meshy GLBs without CDN CORS issues. */
export function getMeshyGlbProxyUrl(taskId: string): string {
  return `${API_BASE_URL}/meshy/tasks/${encodeURIComponent(taskId)}/glb`;
}

export async function waitForMeshyTask(
  taskId: string,
  options: WaitForMeshyTaskOptions = {},
): Promise<MeshyTaskStatus> {
  const intervalMs = options.intervalMs ?? MESHY_POLL_INTERVAL_MS;

  while (true) {
    throwIfAborted(options.signal);

    const task = await getMeshyTaskStatus(taskId);
    options.onProgress?.(task.progress ?? 0);

    if (task.status === "SUCCEEDED") {
      return task;
    }

    if (task.status === "FAILED") {
      throw new Error(task.task_error?.message ?? "3D generation failed");
    }

    await sleep(intervalMs, options.signal);
  }
}

function sleep(durationMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, durationMs);

    function onAbort() {
      window.clearTimeout(timeoutId);
      reject(createAbortError());
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function createAbortError(): DOMException {
  return new DOMException("Aborted", "AbortError");
}
