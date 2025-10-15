import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './infrastructure/config/swagger.config';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  return app;
}

async function bootstrap() {
  const app = await createApp();
  app.enableCors({
    origin: 'http://localhost:4173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Start the application
bootstrap();
