import { Module } from '@nestjs/common';
import { IkeaController } from './ikea.controller';
import { IkeaService } from './ikea.service';

@Module({
  controllers: [IkeaController],
  providers: [IkeaService],
  exports: [IkeaService],
})
export class IkeaModule {}
