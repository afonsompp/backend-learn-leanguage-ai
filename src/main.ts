import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@config/swegger.config';
import { LoggingInterceptor } from '@shared/logs/interceptor/log-http-request.interceptor';
import { OAuthGuard } from '@core/security/auth/guard/oauth.guard';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const reflector = app.get(Reflector);

  // Register OAuth2 Bearer strategy
  app.useGlobalGuards(new OAuthGuard(), new ScopesGuard(reflector));

  app.setGlobalPrefix('api');
  setupSwagger(app);
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
