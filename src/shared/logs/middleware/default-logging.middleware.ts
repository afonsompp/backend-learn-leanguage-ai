import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HttpRequestInterceptor');
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(`[${method} ${originalUrl}] Request received`);

    next();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      this.logger.log(
        `[${method} ${originalUrl}] Response sent with status ${statusCode} in ${duration}ms`,
      );
    });
  }
}
