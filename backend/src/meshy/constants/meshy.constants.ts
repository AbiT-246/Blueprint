export const MESHY_API_BASE_URL = 'https://api.meshy.ai/openapi/v1';

export const MESHY_AI_MODEL = 'meshy-7.1';
export const MESHY_TARGET_FORMATS = ['glb'] as const;
export const MESHY_SHOULD_TEXTURE = true;
export const MESHY_ENABLE_PBR = true;

export const MESHY_CREATE_TASK_TIMEOUT_MS = 60_000;
export const MESHY_GET_TASK_TIMEOUT_MS = 30_000;
export const MESHY_DOWNLOAD_TIMEOUT_MS = 120_000;
export const MESHY_GLB_CONTENT_TYPE = 'model/gltf-binary';

export const MESHY_MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
export const MESHY_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MESHY_IMAGE_FIELD_NAME = 'image';
