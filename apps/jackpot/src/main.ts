import { Logger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JackpotModule } from './jackpot.module';

function setupSwaggerModule(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') return;
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jackpot service')
    .setDescription('jackpot service API')
    .setVersion('1.0')
    .addTag('jackpot')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs/jackpot', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(JackpotModule);
  app.enableCors();
  setupSwaggerModule(app);
  await app.listen(3003);
  Logger.log('Jackpot service running on 3003');
}
bootstrap();
