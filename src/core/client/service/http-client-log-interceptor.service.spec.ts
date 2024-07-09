import { Logger } from '@nestjs/common';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpClientLogInterceptorService } from './http-client-log-interceptor.service';
import { CustomAxiosRequestConfig } from '@core/client/interface/CustomAxiosRequestConfig';

describe('HttpClientLogInterceptorService', () => {
  let service: HttpClientLogInterceptorService;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    service = new HttpClientLogInterceptorService();
    jest.spyOn(logger, 'log').mockImplementation(() => {}); // Mock logger.log
  });

  it('should intercept request start and add metadata', () => {
    const request: Partial<CustomAxiosRequestConfig> = {
      method: 'GET',
      url: 'https://example.com',
    };

    const result = service.interceptRequest(
      request as CustomAxiosRequestConfig,
    );

    expect(result.metadata).toBeDefined();
    expect(result.metadata.startTime).toBeInstanceOf(Date);
  });

  it('should intercept response and calculate total time', () => {
    const request: Partial<CustomAxiosRequestConfig> = {
      method: 'GET',
      url: 'https://example.com',
      metadata: { startTime: new Date() },
    };
    const response: AxiosResponse = {
      config: request as InternalAxiosRequestConfig,
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    const result = service.interceptResponse(response);

    expect(result).toBe(response);
  });
  it('should intercept error and calculate total time', async () => {
    const request: Partial<CustomAxiosRequestConfig> = {
      method: 'GET',
      url: 'https://example.com',
      metadata: { startTime: new Date() },
    };
    const error = {
      config: request,
    };

    await expect(service.interceptError(error)).rejects.toEqual(error);
  });
});
