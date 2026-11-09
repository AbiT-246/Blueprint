export type MeshyTaskStatusValue =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'SUCCEEDED'
  | 'FAILED';

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
