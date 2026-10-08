import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DESIGN_STYLE_LABELS } from './constants/design-style-labels';
import { TemplateItemSummary } from './interfaces/template-item-summary.interface';
import {
  TemplateSummary,
  TemplateSummaryFields,
} from './interfaces/template-summary.interface';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TemplateSummary[]> {
    const templates = await this.fetchTemplateSummaries();
    return templates.map((template) => ({
      ...template,
      label: DESIGN_STYLE_LABELS[template.style],
    }));
  }

  async findItems(templateId: string): Promise<TemplateItemSummary[]> {
    const items = await this.fetchTemplateItems(templateId);
    if (!items) {
      throw new NotFoundException(`Template ${templateId} not found.`);
    }
    return items;
  }

  private async fetchTemplateSummaries(): Promise<TemplateSummaryFields[]> {
    try {
      return await this.prisma.template.findMany({
        select: {
          id: true,
          style: true,
          description: true,
          previewImageUrl: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      this.logger.error('Failed to load templates', error);
      throw new InternalServerErrorException('Unable to load templates.');
    }
  }

  /** Returns null when the template does not exist. */
  private async fetchTemplateItems(
    templateId: string,
  ): Promise<TemplateItemSummary[] | null> {
    try {
      const template = await this.prisma.template.findUnique({
        where: { id: templateId },
        select: {
          templateItems: {
            select: {
              item: { select: { id: true, title: true, imageUrl: true } },
            },
            orderBy: { item: { title: 'asc' } },
          },
        },
      });
      return template?.templateItems.map(({ item }) => item) ?? null;
    } catch (error) {
      this.logger.error(
        `Failed to load items for template ${templateId}`,
        error,
      );
      throw new InternalServerErrorException('Unable to load template items.');
    }
  }
}
