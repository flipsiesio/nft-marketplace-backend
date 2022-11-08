import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthServiceConfig } from '@app/config/services';
import { MainAuthModule } from './main-auth.module';

function setupSwaggerModule(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') return;
  const config = new DocumentBuilder()
    .setTitle('Auth service')
    .setDescription('Authentication & authorization service API')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs/auth', app, document);
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(MainAuthModule);
    app.enableCors();
    setupSwaggerModule(app);
    await app.listen(AuthServiceConfig.HTTP_PORT);
    Logger.log(`Auth service running on ${AuthServiceConfig.HTTP_PORT}`);
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
