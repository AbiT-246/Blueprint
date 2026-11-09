import {
  BadGatewayException,
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MESHY_AI_MODEL,
  MESHY_API_BASE_URL,
  MESHY_CREATE_TASK_TIMEOUT_MS,
  MESHY_DOWNLOAD_TIMEOUT_MS,
  MESHY_ENABLE_PBR,
  MESHY_GET_TASK_TIMEOUT_MS,
  MESHY_GLB_CONTENT_TYPE,
  MESHY_SHOULD_TEXTURE,
  MESHY_TARGET_FORMATS,
} from './constants/meshy.constants';
import {
  MeshyCreateTaskResponse,
  MeshyTaskStatus,
} from './interfaces/meshy-task.interface';

@Injectable()
export class MeshyService {
  private readonly logger = new Logger(MeshyService.name);

  constructor(private readonly configService: ConfigService) {}

  async createImageTo3DTask(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<MeshyCreateTaskResponse> {
    const imageDataUri = this.toDataUri(imageBuffer, mimeType);

    return this.requestJson<MeshyCreateTaskResponse>(
      `${MESHY_API_BASE_URL}/image-to-3d`,
      {
        method: 'POST',
        body: JSON.stringify({
          image_url: imageDataUri,
          ai_model: MESHY_AI_MODEL,
          should_texture: MESHY_SHOULD_TEXTURE,
          enable_pbr: MESHY_ENABLE_PBR,
          target_formats: [...MESHY_TARGET_FORMATS],
        }),
        signal: AbortSignal.timeout(MESHY_CREATE_TASK_TIMEOUT_MS),
      },
      'Meshy task creation failed',
    );
  }

  async createImageTo3DTaskFromUrl(
    imageUrl: string,
  ): Promise<MeshyCreateTaskResponse> {
    return this.requestJson<MeshyCreateTaskResponse>(
      `${MESHY_API_BASE_URL}/image-to-3d`,
      {
        method: 'POST',
        body: JSON.stringify({
          image_url: imageUrl,
          ai_model: MESHY_AI_MODEL,
          should_texture: MESHY_SHOULD_TEXTURE,
          enable_pbr: MESHY_ENABLE_PBR,
          target_formats: [...MESHY_TARGET_FORMATS],
        }),
        signal: AbortSignal.timeout(MESHY_CREATE_TASK_TIMEOUT_MS),
      },
      'Meshy task creation failed',
    );
  }

  async getTaskStatus(taskId: string): Promise<MeshyTaskStatus> {
    return this.requestJson<MeshyTaskStatus>(
      `${MESHY_API_BASE_URL}/image-to-3d/${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(MESHY_GET_TASK_TIMEOUT_MS),
      },
      'Failed to retrieve Meshy task',
    );
  }

  async downloadTaskGlb(
    taskId: string,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const task = await this.getTaskStatus(taskId);
    const glbUrl = task.model_urls?.glb;

    if (task.status !== 'SUCCEEDED' || !glbUrl) {
      throw new ConflictException('GLB model is not ready for this task.');
    }

    try {
      const response = await fetch(glbUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(MESHY_DOWNLOAD_TIMEOUT_MS),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Meshy GLB download failed (${response.status}): ${errorBody.slice(0, 300)}`,
        );
        throw new BadGatewayException('Unable to download the generated GLB model.');
      }

      const arrayBuffer = await response.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType:
          response.headers.get('content-type') ?? MESHY_GLB_CONTENT_TYPE,
      };
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(`Unable to download Meshy GLB for task ${taskId}`, error);
      throw new ServiceUnavailableException(
        'Unable to download the generated GLB model.',
      );
    }
  }

  private toDataUri(imageBuffer: Buffer, mimeType: string): string {
    const base64 = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  }

  private getAuthHeaders(): Record<string, string> {
    const apiKey = this.configService.get<string>('MESHY_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'MESHY_API_KEY is not configured.',
      );
    }

    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async requestJson<TResponse>(
    url: string,
    init: RequestInit,
    errorMessage: string,
  ): Promise<TResponse> {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...this.getAuthHeaders(),
          ...init.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `${errorMessage} (${response.status}): ${errorBody.slice(0, 300)}`,
        );
        throw new BadGatewayException(
          `${errorMessage}: ${errorBody.slice(0, 300)}`,
        );
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      this.logger.error(`Unable to reach Meshy endpoint ${url}`, error);
      throw new ServiceUnavailableException(
        'Unable to reach the Meshy API endpoint.',
      );
    }
  }
}
