import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientLogInterceptorService } from '@core/client/service/http-client-log-interceptor.service';
import { HttpClientService } from '@core/client/service/http-client.service';

@Module({
  imports: [HttpModule],
  providers: [HttpClientLogInterceptorService, HttpClientService],
  exports: [HttpClientService, HttpClientLogInterceptorService],
})
export class HttpClientModule {}
