import { Module } from '@nestjs/common';
import { openAiClientProvider } from './openai.client';
import { OpenAiController } from './openai.controller';
import { OpenAiService } from './openai.service';

@Module({
  controllers: [OpenAiController],
  providers: [openAiClientProvider, OpenAiService],
})
export class OpenAiModule {}
