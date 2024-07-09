import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { HttpClientLogInterceptorService } from '@core/client/service/http-client-log-interceptor.service';
import { CustomAxiosRequestConfig } from '@core/client/interface/CustomAxiosRequestConfig';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpClientService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            axiosRef: {
              interceptors: {
                request: {
                  use: jest.fn(),
                },
                response: {
                  use: jest.fn(),
                },
              },
            },
          },
        },
        {
          provide: HttpClientLogInterceptorService,
          useValue: {
            interceptRequest: jest.fn(
              (config: CustomAxiosRequestConfig) => config,
            ),
            interceptResponse: jest.fn((response: AxiosResponse) => response),
            interceptError: jest.fn((error: any) => Promise.reject(error)),
          },
        },
      ],
    }).compile();

    service = module.get<HttpClientService>(HttpClientService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize interceptors', () => {
    expect(httpService.axiosRef.interceptors.request.use).toHaveBeenCalled();
    expect(httpService.axiosRef.interceptors.response.use).toHaveBeenCalled();
  });

  it('should make a GET request and return data', async () => {
    const mockData = { data: 'test' };
    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: null,
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.get('https://example.com');
    expect(result).toEqual(mockData);
  });

  it('should make a POST request and return data', async () => {
    const mockData = { data: 'test' };
    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: null,
    };

    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.post('https://example.com', { key: 'value' });
    expect(result).toEqual(mockData);
  });
});
