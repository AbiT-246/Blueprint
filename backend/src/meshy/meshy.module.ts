import { Module } from '@nestjs/common';
import { MeshyController } from './meshy.controller';
import { MeshyService } from './meshy.service';

@Module({
  controllers: [MeshyController],
  providers: [MeshyService],
  exports: [MeshyService],
})
export class MeshyModule {}
