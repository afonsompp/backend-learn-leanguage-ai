import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CustomAxiosRequestConfig } from '@core/client/interface/CustomAxiosRequestConfig';

@Injectable()
export class HttpClientLogInterceptorService {
  private readonly logger = new Logger(HttpClientLogInterceptorService.name);

  interceptRequest(
    request: CustomAxiosRequestConfig,
  ): CustomAxiosRequestConfig {
    this.logger.log(
      `Start request: ${request.method.toUpperCase()} ${request.url}`,
    );
    request.metadata = { startTime: new Date() };
    return request;
  }

  interceptResponse(response: AxiosResponse): AxiosResponse {
    const { config } = response;
    const { startTime } = (config as CustomAxiosRequestConfig).metadata;
    const totalTime = new Date().getTime() - startTime.getTime();
    this.logger.log(
      `Integration request completed: ${config.method.toUpperCase()} ${config.url}`,
    );
    this.logger.log(`Total Integration Time: ${totalTime}ms`);
    return response;
  }

  interceptError(error: any): Promise<any> {
    const { config } = error;
    const { startTime } = config.metadata;
    const totalTime = new Date().getTime() - startTime.getTime();
    this.logger.log(
      `Error during integration: ${config.method.toUpperCase()} ${config.url}`,
    );
    this.logger.log(`Total Integration Time: ${totalTime}ms`);
    return Promise.reject(error);
  }
}
