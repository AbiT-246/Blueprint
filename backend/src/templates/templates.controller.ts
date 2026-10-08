import { Controller, Get, Param } from '@nestjs/common';
import { TemplateItemSummary } from './interfaces/template-item-summary.interface';
import { TemplateSummary } from './interfaces/template-summary.interface';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(): Promise<TemplateSummary[]> {
    return this.templatesService.findAll();
  }

  @Get(':id/items')
  findItems(@Param('id') id: string): Promise<TemplateItemSummary[]> {
    return this.templatesService.findItems(id);
  }
}
