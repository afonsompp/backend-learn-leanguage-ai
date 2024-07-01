import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PropertiesConfig from './config/properties.config';
import { AwsConfigService } from '@config/aws.config.service';
import { OAuthConfigService } from '@config/oauth.config.service';
import { DatabaseModule } from '@core/database/database.module';
import { SecurityModule } from '@core/security/security.module';
import { AudioModule } from '@app/features/geneate/audio/audio.module';
import { TextModule } from '@app/features/geneate/text/text.module';
import { SystemModule } from '@app/system/system.module';
import { UserModule } from '@app/user/user.module';
import { LoggingMiddleware } from '@shared/logs/middleware/default-logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PropertiesConfig],
    }),
    AudioModule,
    SecurityModule,
    SystemModule,
    TextModule,
    DatabaseModule,
    UserModule,
  ],
  providers: [AwsConfigService, OAuthConfigService],
  exports: [AwsConfigService, OAuthConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
