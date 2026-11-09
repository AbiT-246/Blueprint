import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MESHY_ALLOWED_MIME_TYPES,
  MESHY_GLB_CONTENT_TYPE,
  MESHY_IMAGE_FIELD_NAME,
  MESHY_MAX_IMAGE_SIZE_BYTES,
} from './constants/meshy.constants';
import { CreateImageTo3DFromUrlDto } from './dto/create-image-to-3d-from-url.dto';
import {
  MeshyCreateTaskResponse,
  MeshyTaskStatus,
} from './interfaces/meshy-task.interface';
import { MeshyService } from './meshy.service';

@Controller('meshy')
export class MeshyController {
  constructor(private readonly meshyService: MeshyService) {}

  @Post('image-to-3d')
  @UseInterceptors(
    FileInterceptor(MESHY_IMAGE_FIELD_NAME, {
      limits: {
        fileSize: MESHY_MAX_IMAGE_SIZE_BYTES,
      },
      fileFilter: (_req, file, callback) => {
        const isAllowed = MESHY_ALLOWED_MIME_TYPES.includes(
          file.mimetype as (typeof MESHY_ALLOWED_MIME_TYPES)[number],
        );

        if (!isAllowed) {
          return callback(
            new BadRequestException(
              'Unsupported image format. Use JPEG, PNG, or WebP.',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  createTask(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MeshyCreateTaskResponse> {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    return this.meshyService.createImageTo3DTask(file.buffer, file.mimetype);
  }

  @Post('image-to-3d-from-url')
  createTaskFromUrl(
    @Body() { imageUrl }: CreateImageTo3DFromUrlDto,
  ): Promise<MeshyCreateTaskResponse> {
    return this.meshyService.createImageTo3DTaskFromUrl(imageUrl);
  }

  @Get('tasks/:taskId')
  getTask(@Param('taskId') taskId: string): Promise<MeshyTaskStatus> {
    if (!taskId.trim()) {
      throw new BadRequestException('Task ID is required');
    }

    return this.meshyService.getTaskStatus(taskId);
  }

  @Get('tasks/:taskId/glb')
  @Header('Cache-Control', 'public, max-age=86400')
  async getTaskGlb(
    @Param('taskId') taskId: string,
  ): Promise<StreamableFile> {
    if (!taskId.trim()) {
      throw new BadRequestException('Task ID is required');
    }

    const { buffer, contentType } =
      await this.meshyService.downloadTaskGlb(taskId);

    return new StreamableFile(buffer, {
      type: contentType || MESHY_GLB_CONTENT_TYPE,
      disposition: `inline; filename="${taskId}.glb"`,
    });
  }
}
