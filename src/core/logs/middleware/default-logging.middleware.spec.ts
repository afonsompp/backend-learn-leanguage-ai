import { Logger } from '@nestjs/common';
import { HttpRequestInterceptor } from '@core/logs/middleware/default-logging.middleware';

describe('HttpRequestInterceptor', () => {
  let interceptor: HttpRequestInterceptor;
  let loggerLogSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new HttpRequestInterceptor();
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log request received and completed', () => {
    const mockReq = {
      method: 'GET',
      originalUrl: '/test',
    } as any; // Mock Request object

    const mockRes = {
      on: jest.fn((event: string, callback: () => void) => {
        if (event === 'finish') {
          callback();
        }
      }),
    } as any; // Mock Response object

    const mockNext = jest.fn(); // Mock NextFunction

    interceptor.use(mockReq, mockRes, mockNext);

    // Check log messages
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `[${mockReq.method} ${mockReq.originalUrl}] Request received`,
    );
  });
});
