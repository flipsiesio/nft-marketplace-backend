import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CardsCliModule } from './cards-cli.module';
import { CardsCliServiceConfig } from '@app/config/services/cards-cli-service.config';

// console.log(env.get());

// console.log(env.get('CARDS_CLI_CONTAINER_NAME'));

// console.log({
//   type: 'postgres',
//   host: PostgresConfig.POSTGRES_HOST,
//   port: PostgresConfig.POSTGRES_PORT,
//   username: PostgresConfig.POSTGRES_USERNAME,
//   password: PostgresConfig.POSTGRES_PASSWORD,
//   database: PostgresConfig.POSTGRES_DATABASE,
//   synchronize: true, //false,
//   autoLoadEntities: true,
// });

function setupSwaggerModule(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') return;
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cards service')
    .setDescription('Generate NFT SVG and metadata service API')
    .setVersion('1.0')
    .addTag('cards')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs/cards-cli', app, document);
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(CardsCliModule);
    app.enableCors();
    setupSwaggerModule(app);
    await app.listen(CardsCliServiceConfig.HTTP_PORT);
    Logger.log(
      `Cards-cli service running on ${CardsCliServiceConfig.HTTP_PORT}`,
    );
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
