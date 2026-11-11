import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmazonModule } from './amazon/amazon.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { IkeaModule } from './ikea/ikea.module';
import { MeshyModule } from './meshy/meshy.module';
import { OpenAiModule } from './openai/openai.module';
import { PrismaModule } from './prisma/prisma.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    AuthModule,
    PrismaModule,
    OpenAiModule,
    TemplatesModule,
    IkeaModule,
    AmazonModule,
    CatalogModule,
    MeshyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

