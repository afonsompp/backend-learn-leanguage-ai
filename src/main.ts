import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@config/swegger.config';
import { LoggingInterceptor } from '@shared/logs/interceptor/log-http-request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
