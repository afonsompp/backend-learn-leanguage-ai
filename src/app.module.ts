import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PropertiesConfig from './config/properties.config';
import { SecurityModule } from '@core/security/security.module';
import { SystemModule } from '@app/system/system.module';
import { UserModule } from '@app/user/user.module';
import { HttpRequestInterceptor } from '@core/logs/middleware/default-logging.middleware';
import { AIModule } from '@shared/ai/AI.module';
import { StoryModule } from '@app/features/story/story.module';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { OAuthGuard } from '@core/security/auth/guard/oauth.guard';
import { HttpClientModule } from '@core/client/http-client.module';
import { HttpModule } from '@nestjs/axios';
import { StorageModule } from '@core/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PropertiesConfig],
    }),
    SecurityModule,
    SystemModule,
    UserModule,
    AIModule,
    StoryModule,
    HttpModule,
    HttpClientModule,
    StorageModule,
  ],
  providers: [ScopesGuard, OAuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestInterceptor).forRoutes('*');
  }
}
