import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@config/swegger.config';
import { OAuthGuard } from '@core/security/auth/guard/oauth.guard';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new OAuthGuard(), new ScopesGuard(reflector));

  setupSwagger(app);

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
