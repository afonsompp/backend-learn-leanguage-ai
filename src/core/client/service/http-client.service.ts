import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpClientLogInterceptorService } from '@core/client/service/http-client-log-interceptor.service';
import { CustomAxiosRequestConfig } from '@core/client/interface/CustomAxiosRequestConfig';

@Injectable()
export class HttpClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly axiosLoggingInterceptor: HttpClientLogInterceptorService,
  ) {
    this.initializeInterceptors();
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, config));
    return response.data;
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.post<T>(url, data, config),
    );
    return response.data;
  }

  private initializeInterceptors() {
    const axios = this.httpService.axiosRef;

    axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      return this.axiosLoggingInterceptor.interceptRequest(
        request as CustomAxiosRequestConfig,
      );
    });

    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return this.axiosLoggingInterceptor.interceptResponse(response);
      },
      (error) => {
        return this.axiosLoggingInterceptor.interceptError(error);
      },
    );
  }
}
