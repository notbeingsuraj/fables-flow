import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = process.env['API_PORT'] ?? 4000;
  const corsOrigin = process.env['API_CORS_ORIGIN'] ?? 'http://localhost:3000';

  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: corsOrigin, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fables Flow API')
    .setDescription('AI-Native Order-to-Collection Operating System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`API running on http://localhost:${String(port)}`);
  console.log(`Swagger docs on http://localhost:${String(port)}/api`);
}

void bootstrap();
