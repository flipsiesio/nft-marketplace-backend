import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { MainMarketplaceModule } from './main-marketplace.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MarketplaceServiceConfig } from '@app/config/services';

function setupSwaggerModule(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') return;
  const config = new DocumentBuilder()
    .setTitle('Marketplace service')
    .setDescription('Marketplace service API')
    .setVersion('1.0')
    .addTag('marketplace')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs/marketplace', app, document);
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(MainMarketplaceModule);
    app.enableCors();
    setupSwaggerModule(app);
    await app.listen(MarketplaceServiceConfig.HTTP_PORT);
    Logger.log(`Marketplace service running on ${MarketplaceServiceConfig.HTTP_PORT}`);
  } catch (err) {
    console.log(err);
  }
}

bootstrap();
